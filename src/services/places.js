const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

async function fetchFallbackPlaces(query, latitude, longitude) {
  const delta = 0.05;
  const viewbox = `${longitude - delta},${latitude + delta},${longitude + delta},${latitude - delta}`;
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=15&q=${encodeURIComponent(query)}&viewbox=${viewbox}&bounded=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item) => ({
      name: item.display_name.split(",")[0],
      vicinity: item.display_name,
    }));
  } catch (error) {
    console.error("fetchFallbackPlaces error:", error);
    return [];
  }
}

export async function getNearbyPlaces(type, coords) {
  let latitude;
  let longitude;

  if (coords && typeof coords.lat === "number" && typeof coords.lng === "number") {
    latitude = coords.lat;
    longitude = coords.lng;
  } else {
    const position = await getLocation();
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
  }

  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=3000&type=${type}&key=${API_KEY}`;

  let googleResults = [];

  try {
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      googleResults = data.results || [];
    } else {
      console.warn(`Places API request failed: ${res.status}`);
    }
  } catch (error) {
    console.error("getNearbyPlaces Google fetch error:", error);
  }

  if (googleResults.length > 0) {
    return googleResults;
  }

  const fallbackQuery = type === "lodging" ? "hotel" : type === "taxi_stand" ? "taxi stand" : type;
  return await fetchFallbackPlaces(fallbackQuery, latitude, longitude);
}