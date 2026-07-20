import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNearbyPlaces } from "../services/places";
import { useMap } from "../context/MapContext";

export default function Transport() {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { location: routeLocation } = useParams();
  const { location: mapLocation } = useMap();

  useEffect(() => {
    loadTransport();
  }, [routeLocation, mapLocation]);

  async function geocodeLocation(name) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1`
      );
      const results = await response.json();
      if (results.length === 0) return null;
      return {
        lat: parseFloat(results[0].lat),
        lng: parseFloat(results[0].lon),
      };
    } catch {
      return null;
    }
  }

  async function loadTransport() {
    setError(null);
    setLoading(true);

    let coords = mapLocation;
    if (routeLocation) {
      const geocoded = await geocodeLocation(routeLocation);
      if (geocoded) coords = geocoded;
      else {
        setError("Unable to find location for transport.");
        setPlaces([]);
        setLoading(false);
        return;
      }
    }

    try {
      const data = await getNearbyPlaces("taxi_stand", coords);
      setPlaces(data || []);
    } catch (error) {
      console.error("Transport load error:", error);
      setError("Unable to load transport.");
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }

  const displayLocation = routeLocation ? decodeURIComponent(routeLocation) : mapLocation?.name;

  return (
    <div>
      <h2>Near Me Transport{displayLocation ? ` for ${displayLocation}` : ""}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading transport...</p>}

      {places.map((item, i) => (
        <div key={i} style={{ margin: "10px", padding: "10px", border: "1px solid gray" }}>
          <h3>{item.name}</h3>
          <p>{item.vicinity}</p>
        </div>
      ))}
    </div>
  );
}