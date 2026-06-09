import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useEffect, useRef } from "react";
import { useMap } from "../context/MapContext";

const containerStyle = {
  width: "100%",
  height: "500px",
};

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

  return (
    <LoadScript googleMapsApiKey="AIzaSyC50_dwVpnUWv3Kk15Nh_MFvgNj0fEnuDM" libraries={["marker"]}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location}
        zoom={12}
        onLoad={handleLoad}
      />
    </LoadScript>
  );
}
