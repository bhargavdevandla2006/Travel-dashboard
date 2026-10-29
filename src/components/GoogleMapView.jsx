import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useEffect, useRef } from "react";
import { useMap } from "../context/MapContext";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function GoogleMapView() {
  const { location } = useMap();
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || !window.google?.maps?.marker?.AdvancedMarkerElement) {
      return;
    }

    if (!markerRef.current) {
      markerRef.current = new window.google.maps.marker.AdvancedMarkerElement({
        position: location,
        map: mapRef.current,
        title: "Current location",
      });
      return;
    }

    markerRef.current.position = location;
    markerRef.current.map = mapRef.current;
  }, [location]);

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.panTo(location);
  }, [location]);

  const handleLoad = (map) => {
    mapRef.current = map;
  };

  if (!apiKey) {
    return (
      <div
        className="flex h-[500px] items-center justify-center rounded-xl bg-slate-100 p-6 text-center text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        role="status"
      >
        Add VITE_GOOGLE_MAPS_API_KEY to the client environment to enable this map.
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={["marker"]}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={12}
        onLoad={handleLoad}
      />
    </LoadScript>
  );
}
