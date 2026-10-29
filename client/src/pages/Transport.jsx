import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNearbyPlaces } from "../services/places";
import { useMap } from "../context/useMap";

export default function Transport() {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { location: routeLocation } = useParams();
  const { location: mapLocation } = useMap();

  const geocodeLocation = useCallback(async (name) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1`
      );
      if (!response.ok) {
        throw new Error(`Location search failed: ${response.status}`);
      }

      const results = await response.json();
      if (results.length === 0) return null;

      return {
        lat: Number.parseFloat(results[0].lat),
        lng: Number.parseFloat(results[0].lon),
      };
    } catch (loadError) {
      console.error("Transport geocoding error:", loadError);
      return null;
    }
  }, []);

  const loadTransport = useCallback(async () => {
    setError(null);
    setLoading(true);

    let coords = mapLocation;
    if (routeLocation) {
      const geocoded = await geocodeLocation(routeLocation);
      if (!geocoded) {
        setError("Unable to find location for transport.");
        setPlaces([]);
        setLoading(false);
        return;
      }
      coords = geocoded;
    }

    try {
      const data = await getNearbyPlaces("taxi_stand", coords);
      setPlaces(Array.isArray(data) ? data : []);
    } catch (loadError) {
      console.error("Transport load error:", loadError);
      setError("Unable to load transport.");
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }, [geocodeLocation, mapLocation, routeLocation]);

  useEffect(() => {
    const request = setTimeout(() => {
      void loadTransport();
    }, 0);

    return () => clearTimeout(request);
  }, [loadTransport]);

  const displayLocation = routeLocation
    ? decodeURIComponent(routeLocation)
    : mapLocation?.name;

  return (
    <div>
      <h2>Near Me Transport{displayLocation ? ` for ${displayLocation}` : ""}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading transport...</p>}

      {places.map((item) => (
        <div
          key={item.id || `${item.name}-${item.vicinity}`}
          style={{ margin: "10px", padding: "10px", border: "1px solid gray" }}
        >
          <h3>{item.name}</h3>
          <p>{item.vicinity}</p>
        </div>
      ))}
    </div>
  );
}
