import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import vertiportsData from "../data/vertiports.json";
import type { Vertiport } from "./VertiportCard";

const allVertiports: Vertiport[] = vertiportsData as Vertiport[];

const OSM_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

export default function VertiportMapBox() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { vertiportId } = useParams<{ vertiportId: string }>();

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const vertiport = allVertiports.find((vp) => vp.vertiportId === vertiportId);
    if (!vertiport || !vertiport.latitudeDeg || !vertiport.longitudeDeg) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: OSM_STYLE,
      center: [vertiport.longitudeDeg, vertiport.latitudeDeg],
      zoom: 14,
    });

    map.current.on('load', () => {
      const popup = new maplibregl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false
      }).setHTML(
        `<strong>${vertiport.vertiportName}</strong>`
      );

      new maplibregl.Marker()
        .setLngLat([vertiport.longitudeDeg, vertiport.latitudeDeg])
        .setPopup(popup)
        .addTo(map.current!)
        .togglePopup();
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [vertiportId]);

  return (
    <div
      style={{
        background: "var(--app-surface)",
        borderRadius: "14px",
        border: "1px solid var(--app-border-subtle)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)",
        padding: "24px",
        height: "100%",
      }}
    >
      <h3
        style={{
          fontSize: "1rem",
          fontWeight: 600,
          color: "var(--app-text)",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid var(--app-border-subtle)",
        }}
      >
        Vertiport Locations
      </h3>
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "400px",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      />
    </div>
  );
}
