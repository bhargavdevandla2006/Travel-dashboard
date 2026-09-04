import { useEffect } from "react";
import { CircleMarker, MapContainer, TileLayer, Tooltip, useMap as useLeafletMap } from "react-leaflet";
import { useMap } from "../context/MapContext";
import "leaflet/dist/leaflet.css";

const mapStyle = {
  width: "100%",
  height: "360px",
  borderRadius: "1rem",
};

function RecenterMap({ center }) {
  const map = useLeafletMap();

  useEffect(() => {
    map.setView(center, 12, { animate: true });
  }, [center, map]);

  return null;
}

export default function MapView() {
  const { location, locationStatus } = useMap();
 
  const center = [location.lat, location.lng];

  return (
    <div className="mt-0 overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 p-3 shadow-2xl dark:border-slate-700">
      <div className="flex items-center justify-between px-2 pb-3 text-white">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-sky-300">Live map</p>
          <p className="mt-1 text-sm font-semibold">{location.name}</p>
        </div>
        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-300">
          {locationStatus === "ready" ? "Current location" : "Default view"}
        </span>
      </div>
      <MapContainer center={center} zoom={12} style={mapStyle} scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RecenterMap center={center} />
        <CircleMarker
          center={center}
          pathOptions={{ color: "#38bdf8", fillColor: "#0ea5e9", fillOpacity: 0.95, weight: 4 }}
          radius={10}
        >
          <Tooltip permanent direction="top" offset={[0, -10]}>
            You are here
          </Tooltip>
        </CircleMarker>
      </MapContainer>
    </div>
  );
}