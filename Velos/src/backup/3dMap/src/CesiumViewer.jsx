import { useEffect, useRef } from "react";
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import {
  ROUTES,
  VERTIPORTS,
  TIME_STEP_IN_SECONDS,
  FLIGHT_START_ISO,
  TAKEOFF_POINTS,
  LANDING_POINTS,
} from "./flightData.js";

const CESIUM_ION_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTFiMDY1MS0yNTZjLTQ5MGItYTRkMS0yNjBhY2Q5ZmZhNzgiLCJpZCI6NDA0ODcyLCJpYXQiOjE3NzM3MjMyODV9.V1OwAo0ipV58Rej1d60IerF8rzkQSGQdirSsOXJb9sE";

// Split variant of Cesium_Air.glb where the merged 8-rotor mesh has been
// broken out into 8 individual nodes (Propeller_0 … Propeller_7) so each
// rotor can be animated around its own axis.
const LOCAL_EVTOL_MODEL = "/Cesium_Air_split.glb";
const LIFT_ROTOR_NODES = [
  "Propeller_0",
  "Propeller_1",
  "Propeller_2",
  "Propeller_3",
  "Propeller_4",
  "Propeller_5",
  "Propeller_6",
  "Propeller_7",
];

// Propeller spin rates (radians / second)
const LIFT_ROTOR_SPIN = 90;   // 8 vertical lift rotors
const PUSHER_SPIN = 70;       // rear pusher prop
const IDLE_SPIN = 2;

// True centroid of the Bk.Propeller mesh (averaged from its 4936 vertices) —
// rotating around this exact point keeps the prop in place with no wobble.
const PUSHER_PIVOT = new Cesium.Cartesian3(0.4504, -8.6645, -10.3384);

export default function CesiumViewer() {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || viewerRef.current) return;

    Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;

    let cancelled = false;

    const viewer = new Cesium.Viewer(containerRef.current, {
      terrain: Cesium.Terrain.fromWorldTerrain(),
      animation: true,
      timeline: true,
      baseLayerPicker: true,
      shouldAnimate: true,
      infoBox: true,
      selectionIndicator: true,
    });

    viewer.scene.globe.enableLighting = true;
    viewer.clock.shouldAnimate = true;
    viewerRef.current = viewer;
    if (typeof window !== "undefined") {
      window.__cesiumViewer = viewer;
      window.Cesium = Cesium;
    }

    viewer.scene.renderError.addEventListener((scene, error) => {
      console.error("Cesium render error:", error);
    });

    const disposers = [];

    async function init() {
      try {
        const osmBuildings = await Cesium.createOsmBuildingsAsync();
        if (cancelled) return;
        viewer.scene.primitives.add(osmBuildings);
      } catch (err) {
        console.warn("Could not load OSM buildings:", err);
      }

      const globalStart = Cesium.JulianDate.fromIso8601(FLIGHT_START_ISO);

      // Compute longest route duration so the clock covers everything.
      let maxStopSeconds = 0;
      ROUTES.forEach((r) => {
        const dur = (r.waypoints.length - 1) * TIME_STEP_IN_SECONDS;
        maxStopSeconds = Math.max(maxStopSeconds, r.startOffsetSeconds + dur);
      });
      const globalStop = Cesium.JulianDate.addSeconds(
        globalStart,
        maxStopSeconds + 10,
        new Cesium.JulianDate()
      );

      viewer.clock.startTime = globalStart.clone();
      viewer.clock.stopTime = globalStop.clone();
      viewer.clock.currentTime = globalStart.clone();
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
      viewer.clock.multiplier = 2;
      viewer.timeline.zoomTo(globalStart, globalStop);

      // Vertiport markers (shared).
      Object.values(VERTIPORTS).forEach((vp) => {
        viewer.entities.add({
          name: vp.name,
          description: `<b>${vp.name}</b><br>Lon: ${vp.longitude}<br>Lat: ${vp.latitude}`,
          position: Cesium.Cartesian3.fromDegrees(
            vp.longitude,
            vp.latitude,
            vp.groundHeight
          ),
          point: {
            pixelSize: 14,
            color: Cesium.Color.ORANGE,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
          },
          label: {
            text: vp.name,
            font: "14px sans-serif",
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -18),
            showBackground: true,
            backgroundColor: new Cesium.Color(0, 0, 0, 0.6),
          },
        });
      });

      // Per-route setup.
      const flights = [];
      for (const route of ROUTES) {
        const flight = await setupRoute(viewer, route, globalStart);
        if (cancelled) return;
        flights.push(flight);
      }

      // Single preUpdate handler drives all models + propellers.
      const removeUpdate = viewer.scene.preUpdate.addEventListener(
        (scene, time) => {
          flights.forEach((f) => updateFlight(f, time, globalStart));
        }
      );
      disposers.push(removeUpdate);

      // Bridge clicks on the eVTOL Model primitives to their paired entity so
      // Cesium's built-in info box opens with the flight details.
      const clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      clickHandler.setInputAction((event) => {
        const picked = viewer.scene.pick(event.position);
        if (!picked) return;
        const prim = picked.primitive;
        if (prim instanceof Cesium.Model) {
          const match = flights.find((f) => f.model === prim);
          if (match) viewer.selectedEntity = match.entity;
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      disposers.push(() => clickHandler.destroy());

      // Cinematic overview over Bangalore.
      const lons = Object.values(VERTIPORTS).map((v) => v.longitude);
      const lats = Object.values(VERTIPORTS).map((v) => v.latitude);
      const midLon = (Math.min(...lons) + Math.max(...lons)) / 2;
      const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          midLon + 0.22,
          midLat - 0.08,
          15000
        ),
        orientation: {
          heading: Cesium.Math.toRadians(280.0),
          pitch: Cesium.Math.toRadians(-22.0),
          roll: 0.0,
        },
        duration: 3.0,
      });

      console.log(`Loaded ${ROUTES.length} eVTOL routes`);
    }

    init().catch((err) => console.error(err));

    return () => {
      cancelled = true;
      disposers.forEach((d) => {
        try { d(); } catch {}
      });
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
      viewerRef.current = null;
    };
  }, []);

  return (
    <div
      id="cesiumContainer"
      ref={containerRef}
      style={{ width: "100%", height: "100vh" }}
    />
  );
}

// ---------------------------------------------------------------------------
// Per-route setup: samples, polylines, model primitive.
// ---------------------------------------------------------------------------
async function setupRoute(viewer, route, globalStart) {
  const { waypoints, startOffsetSeconds, id, label } = route;
  const routeStart = Cesium.JulianDate.addSeconds(
    globalStart,
    startOffsetSeconds,
    new Cesium.JulianDate()
  );
  const routeStop = Cesium.JulianDate.addSeconds(
    routeStart,
    (waypoints.length - 1) * TIME_STEP_IN_SECONDS,
    new Cesium.JulianDate()
  );

  // Full route Cartesians (for the blue polyline).
  const routeCartesians = waypoints.map((p) =>
    Cesium.Cartesian3.fromDegrees(p.longitude, p.latitude, p.height)
  );

  // Sampled position property.
  const positionProperty = new Cesium.SampledPositionProperty();
  positionProperty.setInterpolationOptions({
    interpolationDegree: 2,
    interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
  });

  // Sampled orientation property. Heading follows the segment direction on
  // the curved cruise leg; pitch/roll stay level.
  const orientationProperty = new Cesium.SampledProperty(Cesium.Quaternion);
  const headingOffset = Cesium.Math.toRadians(-90); // model's local forward

  for (let i = 0; i < waypoints.length; i++) {
    const p = waypoints[i];
    const time = Cesium.JulianDate.addSeconds(
      routeStart,
      i * TIME_STEP_IN_SECONDS,
      new Cesium.JulianDate()
    );
    const position = routeCartesians[i];
    positionProperty.addSample(time, position);

    // Compute heading from this point to the next (or prev for last).
    const nbr =
      i < waypoints.length - 1 ? waypoints[i + 1] : waypoints[i - 1] || p;
    const fromCart = Cesium.Cartographic.fromDegrees(p.longitude, p.latitude);
    const toCart = Cesium.Cartographic.fromDegrees(nbr.longitude, nbr.latitude);
    let heading = 0;
    if (
      Math.abs(fromCart.longitude - toCart.longitude) > 1e-10 ||
      Math.abs(fromCart.latitude - toCart.latitude) > 1e-10
    ) {
      const geo = new Cesium.EllipsoidGeodesic(fromCart, toCart);
      heading = geo.startHeading;
      if (i === waypoints.length - 1) heading += Math.PI; // reversed sample
    }
    const hpr = new Cesium.HeadingPitchRoll(heading + headingOffset, 0, 0);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(
      position,
      hpr
    );
    orientationProperty.addSample(time, orientation);
  }

  // Full route polyline (blue, always visible) — this is the "ahead" line.
  viewer.entities.add({
    name: `${label} route`,
    polyline: {
      positions: routeCartesians,
      width: 4,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.22,
        color: Cesium.Color.fromCssColorString("#2f7bff"),
      }),
      arcType: Cesium.ArcType.NONE,
    },
  });

  // Flight entity — carries position + orientation + metadata + trail path.
  // Also owns an invisible billboard used purely as a picking proxy so the
  // user can click the aircraft and see the info box.
  const liveState = { phase: "pre-flight", altitude: null };
  const flightEntity = viewer.entities.add({
    id: `evtol-${id}`,
    name: label,
    description: new Cesium.CallbackProperty(
      () => buildDescription(label, route, liveState.phase, liveState.altitude),
      false
    ),
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({ start: routeStart, stop: routeStop }),
    ]),
    position: positionProperty,
    orientation: orientationProperty,
    billboard: {
      image: TRANSPARENT_PIXEL,
      width: 64,
      height: 64,
      color: Cesium.Color.WHITE.withAlpha(0.01),
    },
    path: new Cesium.PathGraphics({
      width: 6,
      leadTime: 0,
      trailTime: 60 * 60 * 24,
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.35,
        taperPower: 0.4,
        color: Cesium.Color.fromCssColorString("#ffb347"),
      }),
    }),
  });

  // Load eVTOL as a primitive so we can rotate individual nodes.
  const model = await Cesium.Model.fromGltfAsync({
    url: LOCAL_EVTOL_MODEL,
    scale: 1.0,
    minimumPixelSize: 96,
    maximumScale: 300,
  });
  viewer.scene.primitives.add(model);

  // Wait for ready so node lookup works.
  await waitForReady(model);

  const liftNodes = LIFT_ROTOR_NODES.map((name) => model.getNode(name)).filter(
    Boolean
  );
  const liftBases = liftNodes.map((n) => Cesium.Matrix4.clone(n.originalMatrix));
  const pusherNode = model.getNode("Bk.Propeller");
  const pusherBase = pusherNode
    ? Cesium.Matrix4.clone(pusherNode.originalMatrix)
    : null;

  return {
    id,
    route,
    label,
    model,
    entity: flightEntity,
    positionProperty,
    orientationProperty,
    routeStart,
    routeStop,
    liftNodes,
    liftBases,
    pusherNode,
    pusherBase,
    totalSamples: waypoints.length,
    liveState,
  };
}

// 1x1 transparent PNG — invisible billboard sized to cover the eVTOL so
// Cesium's picking system can map clicks on the aircraft to its entity.
const TRANSPARENT_PIXEL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

function buildDescription(label, route, phase, altitude) {
  const { from, to } = route;
  const alt = altitude != null ? `${altitude.toFixed(0)} m` : "—";
  return `
    <table style="width:100%;font-family:sans-serif;">
      <tr><td><b>Route</b></td><td>${label}</td></tr>
      <tr><td><b>From</b></td><td>${from.name}</td></tr>
      <tr><td><b>To</b></td><td>${to.name}</td></tr>
      <tr><td><b>Phase</b></td><td>${phase}</td></tr>
      <tr><td><b>Altitude</b></td><td>${alt}</td></tr>
    </table>
  `;
}

function waitForReady(model) {
  return new Promise((resolve) => {
    const check = () => {
      if (model.ready) {
        resolve();
        return;
      }
      requestAnimationFrame(check);
    };
    check();
  });
}

// ---------------------------------------------------------------------------
// Per-frame update: position, orientation, propeller spin.
// ---------------------------------------------------------------------------
const _scratchPos = new Cesium.Cartesian3();
const _scratchScale = new Cesium.Cartesian3(1, 1, 1);
const _scratchQuat = new Cesium.Quaternion();
const _scratchRotM3 = new Cesium.Matrix3();
const _scratchRotM4 = new Cesium.Matrix4();
const _scratchTranslate = new Cesium.Matrix4();
const _scratchTranslateInv = new Cesium.Matrix4();
const _scratchCombined = new Cesium.Matrix4();
const _scratchNegPivot = new Cesium.Cartesian3();

// Build `base * T(pivot) * R * T(-pivot)` — rotate mesh around its own center.
function rotateAroundPivot(baseMatrix, rotationM3, pivot, result) {
  Cesium.Matrix4.fromTranslation(pivot, _scratchTranslate);
  Cesium.Cartesian3.negate(pivot, _scratchNegPivot);
  Cesium.Matrix4.fromTranslation(_scratchNegPivot, _scratchTranslateInv);
  Cesium.Matrix4.fromRotationTranslation(
    rotationM3,
    Cesium.Cartesian3.ZERO,
    _scratchRotM4
  );
  // combined = T(pivot) * R * T(-pivot)
  Cesium.Matrix4.multiply(_scratchRotM4, _scratchTranslateInv, _scratchCombined);
  Cesium.Matrix4.multiply(_scratchTranslate, _scratchCombined, _scratchCombined);
  // result = base * combined
  return Cesium.Matrix4.multiply(baseMatrix, _scratchCombined, result);
}

function updateFlight(flight, time, globalStart) {
  const { model, positionProperty, orientationProperty } = flight;
  if (!model.ready) return;

  const position = positionProperty.getValue(time, _scratchPos);
  if (!position) {
    model.show = false;
    return;
  }
  model.show = true;

  const orientation =
    orientationProperty.getValue(time, _scratchQuat) ||
    Cesium.Quaternion.IDENTITY;

  Cesium.Matrix4.fromTranslationQuaternionRotationScale(
    position,
    orientation,
    _scratchScale,
    model.modelMatrix
  );

  // Determine phase based on seconds since this route's start.
  const secs = Cesium.JulianDate.secondsDifference(time, flight.routeStart);
  const idx = secs / TIME_STEP_IN_SECONDS;
  const total = flight.totalSamples;
  let phase = "cruise";
  if (idx < 0 || idx > total - 1) phase = "idle";
  else if (idx < TAKEOFF_POINTS) phase = "takeoff";
  else if (idx >= total - LANDING_POINTS) phase = "landing";

  if (flight.liveState) {
    flight.liveState.phase = phase;
    const cart = Cesium.Cartographic.fromCartesian(position);
    flight.liveState.altitude = cart ? cart.height : null;
  }

  const elapsed = Cesium.JulianDate.secondsDifference(time, globalStart);

  // 8 lift rotors — each is its own node now, so spin about local Y at origin.
  if (flight.liftNodes && flight.liftNodes.length) {
    const spinRate =
      phase === "takeoff" || phase === "landing"
        ? LIFT_ROTOR_SPIN
        : phase === "cruise"
        ? IDLE_SPIN
        : 0;
    const angle = elapsed * spinRate;
    Cesium.Matrix3.fromRotationY(angle, _scratchRotM3);
    Cesium.Matrix4.fromRotationTranslation(
      _scratchRotM3,
      Cesium.Cartesian3.ZERO,
      _scratchRotM4
    );
    for (let i = 0; i < flight.liftNodes.length; i++) {
      flight.liftNodes[i].matrix = Cesium.Matrix4.multiply(
        flight.liftBases[i],
        _scratchRotM4,
        new Cesium.Matrix4()
      );
    }
  }

  // Rear pusher prop — single mesh, rotates cleanly around its own center.
  if (flight.pusherNode && flight.pusherBase) {
    const spinRate =
      phase === "cruise"
        ? PUSHER_SPIN
        : phase === "takeoff" || phase === "landing"
        ? IDLE_SPIN
        : 0;
    const angle = elapsed * spinRate;
    // Mesh's thin axis is X → pusher disc spins about local X.
    Cesium.Matrix3.fromRotationX(angle, _scratchRotM3);
    flight.pusherNode.matrix = rotateAroundPivot(
      flight.pusherBase,
      _scratchRotM3,
      PUSHER_PIVOT,
      new Cesium.Matrix4()
    );
  }
}
