import { useEffect, useState } from "react";
import MapContext from "./map-context-value";

export const MapProvider = ({ children }) => {
  const [location, setLocation] = useState({
    name: "Maldives",
    lat: 3.2028,
    lng: 73.2207,
  });
  const [locationStatus, setLocationStatus] = useState(() =>
    typeof navigator !== "undefined" && navigator.geolocation
      ? "loading"
      : "fallback"
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({
          name: "Your current location",
          lat: coords.latitude,
          lng: coords.longitude,
        });
        setLocationStatus("ready");
      },
      () => setLocationStatus("fallback"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  return (
    <MapContext.Provider value={{ location, setLocation, locationStatus }}>
      {children}
    </MapContext.Provider>
  );
};