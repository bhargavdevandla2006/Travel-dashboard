import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNearbyPlaces } from "../services/places";
import { useMap } from "../context/MapContext";
import { useNavigate } from "react-router-dom";


export default function Hotels() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { location: routeLocation } = useParams();
  const { location: mapLocation } = useMap();

  useEffect(() => {
    loadHotels();
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

  async function loadHotels() {
    setError(null);
    setLoading(true);

    let coords = mapLocation;
    if (routeLocation) {
      const geocoded = await geocodeLocation(routeLocation);
      if (geocoded) coords = geocoded;
      else {
        setError("Unable to find location for hotels.");
        setHotels([]);
        setLoading(false);
        return;
      }
    }

    try {
      const data = await getNearbyPlaces("lodging", coords);
      console.log(data);
      setHotels(data || []);
    } catch (error) {
      console.error("Hotel load error:", error);
      setError("Unable to load hotels.");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }

  const displayLocation = routeLocation ? decodeURIComponent(routeLocation) : mapLocation?.name;

  return (
    <div>
      <h2>Near Me Hotels{displayLocation ? ` for ${displayLocation}` : ""}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading hotels...</p>}

      {hotels.map((hotel, i) => (
        <div
          key={i}
          onClick={() =>
            navigate("/hotel-details", {
              state: hotel,
            })
          }
          className="bg-white rounded-xl shadow-lg p-4 mb-4 cursor-pointer hover:shadow-2xl transition"
        >
          <h3 className="text-xl font-bold">
            {hotel.name}
          </h3>

          <p className="text-gray-500">
            {hotel.vicinity}
          </p>

          <button className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-lg">
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}