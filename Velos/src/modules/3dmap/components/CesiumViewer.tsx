import { useEffect, useRef } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import {
  TIME_STEP_IN_SECONDS,
  FLIGHT_START_ISO,
  TAKEOFF_POINTS,
  LANDING_POINTS,
  type FlightRoute,
  type Vertiport,
} from '../data/flightData';

const CESIUM_ION_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjZTFiMDY1MS0yNTZjLTQ5MGItYTRkMS0yNjBhY2Q5ZmZhNzgiLCJpZCI6NDA0ODcyLCJpYXQiOjE3NzM3MjMyODV9.V1OwAo0ipV58Rej1d60IerF8rzkQSGQdirSsOXJb9sE';

const LOCAL_EVTOL_MODEL = '/Cesium_Air_split.glb';
const LIFT_ROTOR_NODES = [
  'Propeller_0',
  'Propeller_1',
  'Propeller_2',
  'Propeller_3',
  'Propeller_4',
  'Propeller_5',
  'Propeller_6',
  'Propeller_7',
];

const LIFT_ROTOR_SPIN = 90;
const PUSHER_SPIN = 70;
const IDLE_SPIN = 2;

const PUSHER_PIVOT = new Cesium.Cartesian3(0.4504, -8.6645, -10.3384);

const TRANSPARENT_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

interface Flight {
  id: string;
  label: string;
  route: FlightRoute;
  model: Cesium.Model;
  entity: Cesium.Entity;
  positionProperty: Cesium.SampledPositionProperty;
  orientationProperty: Cesium.SampledProperty;
  routeStart: Cesium.JulianDate;
  routeStop: Cesium.JulianDate;
  liftNodes: Cesium.ModelNode[];
  liftBases: Cesium.Matrix4[];
  pusherNode: Cesium.ModelNode | undefined;
  pusherBase: Cesium.Matrix4 | null;
  totalSamples: number;
  liveState: { phase: string; altitude: number | null };
}

interface Props {
  routes: FlightRoute[];
  vertiports: Vertiport[];
  selectedFlightId: string | null;
  onSelectFlight: (id: string | null) => void;
  /** Fired once the scene, models and routes have finished initializing. */
  onReady?: () => void;
}

export default function CesiumViewer({
  routes,
  vertiports,
  selectedFlightId,
  onSelectFlight,
  onReady,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const flightsRef = useRef<Flight[]>([]);

  // Capture latest props in refs so the one-time init effect can read them
  // without re-creating the (expensive) viewer.
  const routesRef = useRef(routes);
  routesRef.current = routes;
  const vertiportsRef = useRef(vertiports);
  vertiportsRef.current = vertiports;
  const onSelectRef = useRef(onSelectFlight);
  onSelectRef.current = onSelectFlight;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

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

    viewer.scene.renderError.addEventListener((_scene, error) => {
      console.error('Cesium render error:', error);
    });

    const disposers: Array<() => void> = [];

    async function init() {
      try {
        const osmBuildings = await Cesium.createOsmBuildingsAsync();
        if (cancelled) return;
        viewer.scene.primitives.add(osmBuildings);
      } catch (err) {
        console.warn('Could not load OSM buildings:', err);
      }

      const localRoutes = routesRef.current;
      const localVertiports = vertiportsRef.current;
      const globalStart = Cesium.JulianDate.fromIso8601(FLIGHT_START_ISO);

      let maxStopSeconds = 0;
      localRoutes.forEach((r) => {
        const dur = (r.waypoints.length - 1) * TIME_STEP_IN_SECONDS;
        maxStopSeconds = Math.max(maxStopSeconds, r.startOffsetSeconds + dur);
      });
      const globalStop = Cesium.JulianDate.addSeconds(
        globalStart,
        maxStopSeconds + 10,
        new Cesium.JulianDate(),
      );

      viewer.clock.startTime = globalStart.clone();
      viewer.clock.stopTime = globalStop.clone();
      viewer.clock.currentTime = globalStart.clone();
      viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
      viewer.clock.multiplier = 2;
      viewer.timeline.zoomTo(globalStart, globalStop);

      localVertiports.forEach((vp) => {
        viewer.entities.add({
          name: vp.name,
          description: `<b>${vp.name}</b><br>Lon: ${vp.longitude}<br>Lat: ${vp.latitude}`,
          position: Cesium.Cartesian3.fromDegrees(vp.longitude, vp.latitude, vp.groundHeight),
          point: {
            pixelSize: 14,
            color: Cesium.Color.ORANGE,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
          },
          label: {
            text: vp.name,
            font: '14px sans-serif',
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

      const flights: Flight[] = [];
      for (const route of localRoutes) {
        const flight = await setupRoute(viewer, route, globalStart);
        if (cancelled) return;
        flights.push(flight);
      }
      flightsRef.current = flights;

      const removeUpdate = viewer.scene.preUpdate.addEventListener((_scene, time) => {
        flights.forEach((f) => updateFlight(f, time, globalStart));
      });
      disposers.push(removeUpdate);

      const clickHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
      clickHandler.setInputAction((event: Cesium.ScreenSpaceEventHandler.PositionedEvent) => {
        const picked = viewer.scene.pick(event.position);
        if (!picked) return;
        const prim = picked.primitive;
        if (prim instanceof Cesium.Model) {
          const match = flights.find((f) => f.model === prim);
          if (match) {
            viewer.selectedEntity = match.entity;
            onSelectRef.current(match.id);
          }
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      disposers.push(() => clickHandler.destroy());

      const lons = localVertiports.map((v) => v.longitude);
      const lats = localVertiports.map((v) => v.latitude);
      const midLon = (Math.min(...lons) + Math.max(...lons)) / 2;
      const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(midLon + 0.22, midLat - 0.08, 15000),
        orientation: {
          heading: Cesium.Math.toRadians(280.0),
          pitch: Cesium.Math.toRadians(-22.0),
          roll: 0.0,
        },
        duration: 3.0,
      });

      // Signal readiness once the scene has rendered a frame with everything in place.
      viewer.scene.requestRender();
      requestAnimationFrame(() => {
        if (!cancelled) onReadyRef.current?.();
      });
    }

    init().catch((err) => console.error(err));

    return () => {
      cancelled = true;
      disposers.forEach((d) => {
        try {
          d();
        } catch {
          /* noop */
        }
      });
      flightsRef.current = [];
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
      }
      viewerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to external flight selection (e.g. from the flight list panel):
  // select the entity (opens the info box) and fly the camera to it.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed() || !selectedFlightId) return;
    const flight = flightsRef.current.find((f) => f.id === selectedFlightId);
    if (!flight) return;
    viewer.selectedEntity = flight.entity;
    const pos = flight.positionProperty.getValue(viewer.clock.currentTime);
    if (pos) {
      viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(pos, 1200), { duration: 1.5 });
    }
  }, [selectedFlightId]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}

// ---------------------------------------------------------------------------
// Per-route setup: samples, polylines, model primitive.
// ---------------------------------------------------------------------------
async function setupRoute(
  viewer: Cesium.Viewer,
  route: FlightRoute,
  globalStart: Cesium.JulianDate,
): Promise<Flight> {
  const { waypoints, startOffsetSeconds, id, label } = route;
  const routeStart = Cesium.JulianDate.addSeconds(globalStart, startOffsetSeconds, new Cesium.JulianDate());
  const routeStop = Cesium.JulianDate.addSeconds(
    routeStart,
    (waypoints.length - 1) * TIME_STEP_IN_SECONDS,
    new Cesium.JulianDate(),
  );

  const routeCartesians = waypoints.map((p) =>
    Cesium.Cartesian3.fromDegrees(p.longitude, p.latitude, p.height),
  );

  const positionProperty = new Cesium.SampledPositionProperty();
  positionProperty.setInterpolationOptions({
    interpolationDegree: 2,
    interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
  });

  const orientationProperty = new Cesium.SampledProperty(Cesium.Quaternion);
  const headingOffset = Cesium.Math.toRadians(-90);

  for (let i = 0; i < waypoints.length; i++) {
    const p = waypoints[i];
    const time = Cesium.JulianDate.addSeconds(routeStart, i * TIME_STEP_IN_SECONDS, new Cesium.JulianDate());
    const position = routeCartesians[i];
    positionProperty.addSample(time, position);

    const nbr = i < waypoints.length - 1 ? waypoints[i + 1] : waypoints[i - 1] || p;
    const fromCart = Cesium.Cartographic.fromDegrees(p.longitude, p.latitude);
    const toCart = Cesium.Cartographic.fromDegrees(nbr.longitude, nbr.latitude);
    let heading = 0;
    if (
      Math.abs(fromCart.longitude - toCart.longitude) > 1e-10 ||
      Math.abs(fromCart.latitude - toCart.latitude) > 1e-10
    ) {
      const geo = new Cesium.EllipsoidGeodesic(fromCart, toCart);
      heading = geo.startHeading;
      if (i === waypoints.length - 1) heading += Math.PI;
    }
    const hpr = new Cesium.HeadingPitchRoll(heading + headingOffset, 0, 0);
    const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
    orientationProperty.addSample(time, orientation);
  }

  viewer.entities.add({
    name: `${label} route`,
    polyline: {
      positions: routeCartesians,
      width: 4,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.22,
        color: Cesium.Color.fromCssColorString('#2f7bff'),
      }),
      arcType: Cesium.ArcType.NONE,
    },
  });

  const liveState: { phase: string; altitude: number | null } = { phase: 'pre-flight', altitude: null };
  const flightEntity = viewer.entities.add({
    id: `evtol-${id}`,
    name: label,
    description: new Cesium.CallbackProperty(
      () => buildDescription(label, route, liveState.phase, liveState.altitude),
      false,
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
        color: Cesium.Color.fromCssColorString('#ffb347'),
      }),
    }),
  });

  const model = await Cesium.Model.fromGltfAsync({
    url: LOCAL_EVTOL_MODEL,
    scale: 1.0,
    minimumPixelSize: 96,
    maximumScale: 300,
  });
  viewer.scene.primitives.add(model);

  await waitForReady(model);

  const liftNodes = LIFT_ROTOR_NODES.map((name) => model.getNode(name)).filter(
    (n): n is Cesium.ModelNode => Boolean(n),
  );
  const liftBases = liftNodes.map((n) => Cesium.Matrix4.clone(n.originalMatrix));
  const pusherNode = model.getNode('Bk.Propeller');
  const pusherBase = pusherNode ? Cesium.Matrix4.clone(pusherNode.originalMatrix) : null;

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

function buildDescription(
  label: string,
  route: FlightRoute,
  phase: string,
  altitude: number | null,
): string {
  const { from, to } = route;
  const alt = altitude != null ? `${altitude.toFixed(0)} m` : '—';
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

function waitForReady(model: Cesium.Model): Promise<void> {
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

function rotateAroundPivot(
  baseMatrix: Cesium.Matrix4,
  rotationM3: Cesium.Matrix3,
  pivot: Cesium.Cartesian3,
  result: Cesium.Matrix4,
): Cesium.Matrix4 {
  Cesium.Matrix4.fromTranslation(pivot, _scratchTranslate);
  Cesium.Cartesian3.negate(pivot, _scratchNegPivot);
  Cesium.Matrix4.fromTranslation(_scratchNegPivot, _scratchTranslateInv);
  Cesium.Matrix4.fromRotationTranslation(rotationM3, Cesium.Cartesian3.ZERO, _scratchRotM4);
  Cesium.Matrix4.multiply(_scratchRotM4, _scratchTranslateInv, _scratchCombined);
  Cesium.Matrix4.multiply(_scratchTranslate, _scratchCombined, _scratchCombined);
  return Cesium.Matrix4.multiply(baseMatrix, _scratchCombined, result);
}

function updateFlight(flight: Flight, time: Cesium.JulianDate, globalStart: Cesium.JulianDate) {
  const { model, positionProperty, orientationProperty } = flight;
  if (!model.ready) return;

  const position = positionProperty.getValue(time, _scratchPos);
  if (!position) {
    model.show = false;
    return;
  }
  model.show = true;

  const orientation = orientationProperty.getValue(time, _scratchQuat) || Cesium.Quaternion.IDENTITY;

  Cesium.Matrix4.fromTranslationQuaternionRotationScale(
    position,
    orientation,
    _scratchScale,
    model.modelMatrix,
  );

  const secs = Cesium.JulianDate.secondsDifference(time, flight.routeStart);
  const idx = secs / TIME_STEP_IN_SECONDS;
  const total = flight.totalSamples;
  let phase = 'cruise';
  if (idx < 0 || idx > total - 1) phase = 'idle';
  else if (idx < TAKEOFF_POINTS) phase = 'takeoff';
  else if (idx >= total - LANDING_POINTS) phase = 'landing';

  flight.liveState.phase = phase;
  const cart = Cesium.Cartographic.fromCartesian(position);
  flight.liveState.altitude = cart ? cart.height : null;

  const elapsed = Cesium.JulianDate.secondsDifference(time, globalStart);

  if (flight.liftNodes.length) {
    const spinRate =
      phase === 'takeoff' || phase === 'landing'
        ? LIFT_ROTOR_SPIN
        : phase === 'cruise'
        ? IDLE_SPIN
        : 0;
    const angle = elapsed * spinRate;
    Cesium.Matrix3.fromRotationY(angle, _scratchRotM3);
    Cesium.Matrix4.fromRotationTranslation(_scratchRotM3, Cesium.Cartesian3.ZERO, _scratchRotM4);
    for (let i = 0; i < flight.liftNodes.length; i++) {
      flight.liftNodes[i].matrix = Cesium.Matrix4.multiply(
        flight.liftBases[i],
        _scratchRotM4,
        new Cesium.Matrix4(),
      );
    }
  }

  if (flight.pusherNode && flight.pusherBase) {
    const spinRate =
      phase === 'cruise'
        ? PUSHER_SPIN
        : phase === 'takeoff' || phase === 'landing'
        ? IDLE_SPIN
        : 0;
    const angle = elapsed * spinRate;
    Cesium.Matrix3.fromRotationX(angle, _scratchRotM3);
    flight.pusherNode.matrix = rotateAroundPivot(
      flight.pusherBase,
      _scratchRotM3,
      PUSHER_PIVOT,
      new Cesium.Matrix4(),
    );
  }
}
