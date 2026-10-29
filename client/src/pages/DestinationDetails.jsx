import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaCheck,
  FaCloudSun,
  FaCompass,
  FaHeart,
  FaMapMarkerAlt,
  FaPlane,
  FaRegHeart,
  FaShareAlt,
  FaSun,
  FaUmbrella,
  FaWind,
} from "react-icons/fa";
import { getDestinationById } from "../services/api";

function getDestinationHue(name = "Travel") {
  return [...name].reduce((total, character) => total + character.charCodeAt(0), 0) % 360;
}

function getDestinationKey(place) {
  return `${place.id || place.name}-${place.country}`;
}

function getWeatherDescription(code) {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Heavy drizzle",
    56: "Freezing drizzle",
    57: "Heavy freezing drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Heavy freezing rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Light rain showers",
    81: "Rain showers",
    82: "Heavy rain showers",
    85: "Snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Heavy thunderstorm with hail",
  };

  return descriptions[code] || "Current conditions";
}

export default function DestinationDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState("");
  const [activeTab, setActiveTab] = useState("Overview");
  const [saved, setSaved] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [checklist, setChecklist] = useState({ weather: false, guide: false });

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather(place) {
      setWeather(null);
      setWeatherError("");
      setWeatherLoading(true);

      try {
        const searchTerms = [
          [place.name, place.country].filter(Boolean).join(", "),
          place.name,
        ].filter((term, index, terms) => term && terms.indexOf(term) === index);
        let locationResult;

        for (const searchTerm of searchTerms) {
          const geocodingParams = new URLSearchParams({
            name: searchTerm,
            count: "5",
            language: "en",
            format: "json",
          });
          const geocodingResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?${geocodingParams}`,
            { signal: controller.signal }
          );
          if (!geocodingResponse.ok) {
            throw new Error("Could not look up the trip location for weather.");
          }

          const geocodingData = await geocodingResponse.json();
          locationResult = geocodingData.results?.[0];
          if (locationResult) break;
        }

        if (!locationResult) {
          throw new Error(`Could not find weather for ${place.name}, ${place.country}.`);
        }

        const forecastParams = new URLSearchParams({
          latitude: String(locationResult.latitude),
          longitude: String(locationResult.longitude),
          current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m",
          daily:
            "temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset",
          forecast_days: "1",
          timezone: "auto",
          temperature_unit: "celsius",
          wind_speed_unit: "kmh",
        });
        const forecastResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?${forecastParams}`,
          { signal: controller.signal }
        );
        if (!forecastResponse.ok) {
          throw new Error("Could not load live weather for this trip location.");
        }

        const forecast = await forecastResponse.json();
        if (!forecast.current || !forecast.daily) {
          throw new Error("Live weather is not available for this location.");
        }

        const locationParts = [
          locationResult.name,
          locationResult.admin1,
          locationResult.country,
        ].filter((part, index, parts) => part && parts.indexOf(part) === index);
        setWeather({
          ...forecast,
          locationName: locationParts.join(", "),
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load live weather:", error);
          setWeatherError(error.message || "Could not load live weather.");
        }
      } finally {
        if (!controller.signal.aborted) setWeatherLoading(false);
      }
    }

    async function loadDestination() {
      try {
        const localDestinations = JSON.parse(localStorage.getItem("destination_discoveries") || "[]");
        const localDestination = localDestinations.find((place) => String(place.id) === String(id));
        const data = localDestination || await getDestinationById(id);
        if (controller.signal.aborted) return;
        setDestination(data);

        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setSaved(favorites.some((place) => getDestinationKey(place) === getDestinationKey(data)));
        await loadWeather(data);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to load destination:", error);
        }
      }
    }

    loadDestination();
    return () => controller.abort();
  }, [id, location.key]);

  const hue = useMemo(() => getDestinationHue(destination?.name), [destination?.name]);

  function toggleSaved() {
    if (!destination) return;
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const key = getDestinationKey(destination);
    const nextSaved = !saved;
    const nextFavorites = saved
      ? favorites.filter((place) => getDestinationKey(place) !== key)
      : [...favorites, { id: destination.id, name: destination.name, country: destination.country, image: destination.image }];

    localStorage.setItem("favorites", JSON.stringify(nextFavorites));
    setSaved(nextSaved);

    const localNotifications = JSON.parse(localStorage.getItem("travelhub-local-notifications") || "[]");
    localNotifications.unshift({
      id: `favorite-${destination.id}-${Date.now()}`,
      type: "favorite",
      title: nextSaved ? "Place saved" : "Place removed",
      message: nextSaved
        ? `${destination.name}, ${destination.country} was added to your favorites.`
        : `${destination.name}, ${destination.country} was removed from your favorites.`,
      is_read: 0,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("travelhub-local-notifications", JSON.stringify(localNotifications.slice(0, 30)));
    window.dispatchEvent(new Event("travelhub-notification"));
  }

  async function shareDestination() {
    try {
      const shareData = {
        title: `${destination.name} | TravelHub`,
        text: `Explore ${destination.name}, ${destination.country}`,
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(shareData);
        setShareStatus("Shared");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("Link copied");
      } else {
        const fallbackInput = document.createElement("textarea");
        fallbackInput.value = window.location.href;
        fallbackInput.setAttribute("readonly", "");
        fallbackInput.style.position = "fixed";
        fallbackInput.style.opacity = "0";
        document.body.appendChild(fallbackInput);
        fallbackInput.select();
        document.execCommand("copy");
        fallbackInput.remove();
        setShareStatus("Link copied");
      }
      window.setTimeout(() => setShareStatus(""), 2200);
    } catch (error) {
      if (error.name !== "AbortError") setShareStatus("Try again");
    }
  }

  if (!destination) return <div className="destination-detail-loading">Loading destination...</div>;

  const weatherCondition = weather
    ? getWeatherDescription(weather.current.weather_code)
    : weatherLoading
      ? "Loading live weather..."
      : "Weather unavailable";

  return (
    <div className="destination-detail" style={{ "--destination-hue": hue }}>
      <div className="detail-route-scene" aria-hidden="true">
        <span className="detail-map-orb detail-map-orb-one" />
        <span className="detail-map-orb detail-map-orb-two" />
        <span className="detail-scan-beam" />
        <span className="detail-route-line detail-route-line-one" />
        <span className="detail-route-line detail-route-line-two" />
        <span className="detail-route-node detail-route-node-one" />
        <span className="detail-route-node detail-route-node-two" />
        <span className="detail-route-node detail-route-node-three" />
        <FaCompass className="detail-route-marker" />
        <FaPlane className="detail-route-plane" />
      </div>
      <header className="destination-detail-nav">
        <button type="button" onClick={() => navigate(-1)} className="detail-icon-button" aria-label="Go back"><FaArrowLeft /></button>
        <span className="detail-nav-label">FIELD GUIDE / {destination.name}</span>
        <button type="button" onClick={shareDestination} className="detail-icon-button" aria-label="Share destination" title={shareStatus || "Share destination"}><FaShareAlt /></button>
      </header>

      <main className="destination-detail-content">
        <section className="destination-detail-hero">
          {destination.image ? <img src={destination.image} alt={destination.name} /> : <div className="destination-detail-image-fallback" />}
          <div className="destination-detail-wash" />
          <div className="destination-detail-orbit destination-detail-orbit-one" />
          <div className="destination-detail-orbit destination-detail-orbit-two" />
          <div className="destination-detail-hero-copy">
            <p className="detail-kicker"><FaCompass /> Coordinates found</p>
            <h1>{destination.name}</h1>
            <p className="detail-location"><FaMapMarkerAlt /> {destination.country}</p>
            <div className="detail-actions">
              <button type="button" onClick={toggleSaved} className={`detail-primary-action ${saved ? "is-saved" : ""}`}>{saved ? <FaHeart /> : <FaRegHeart />} {saved ? "Saved" : "Save place"}</button>
              <button type="button" onClick={shareDestination} className="detail-secondary-action" aria-live="polite">{shareStatus ? <FaCheck /> : <FaShareAlt />} {shareStatus || "Share"}</button>
            </div>
          </div>
          {/^\d+$/.test(String(destination.id)) && (
            <div className="detail-hero-number">
              {String(destination.id).padStart(2, "0")}
            </div>
          )}
        </section>

        <section className="destination-detail-body">
          <nav className="detail-tabs" aria-label="Destination sections">
            {["Overview", "Weather", "Plan"].map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={activeTab === tab ? "active" : ""}>{tab}</button>)}
          </nav>

          {activeTab === "Overview" && <div className="detail-panel detail-overview-panel">
            <div className="detail-overview-heading"><p className="detail-kicker">The short version</p><h2>A different kind of detour.</h2></div>
            <p className="detail-description">{destination.description || `A new route through ${destination.name}. Save it now and build the details around your own style of travel.`}</p>
            <div className="detail-mini-stats"><span><strong>{destination.country}</strong><small>region</small></span><span><strong>{weather ? `${Math.round(weather.current.temperature_2m)}°` : "--"}</strong><small>right now</small></span><span><strong>{saved ? "01" : "00"}</strong><small>saved</small></span></div>
          </div>}

          {activeTab === "Weather" && <div className="detail-panel detail-weather-panel">
            <div>
              <p className="detail-kicker">Live conditions</p>
              <h2>{weatherCondition}</h2>
              {weather && <p className="detail-muted">{weather.locationName} · Updated {weather.current.time.replace("T", " ")} local time</p>}
              {weather && <p className="detail-muted">Feels like {Math.round(weather.current.apparent_temperature)}°C · High {Math.round(weather.daily.temperature_2m_max[0])}°C · Low {Math.round(weather.daily.temperature_2m_min[0])}°C</p>}
            </div>
            {weather ? <div className="weather-metrics"><div><FaSun /><strong>{Math.round(weather.current.temperature_2m)}°C</strong><small>temperature</small></div><div><FaUmbrella /><strong>{weather.current.relative_humidity_2m}%</strong><small>humidity</small></div><div><FaWind /><strong>{Math.round(weather.current.wind_speed_10m)} km/h</strong><small>wind</small></div></div> : <p className="detail-muted">{weatherLoading ? "Getting live weather for this trip location..." : weatherError}</p>}
          </div>}

          {activeTab === "Plan" && <div className="detail-panel detail-plan-panel">
            <div><p className="detail-kicker">Your next move</p><h2>Make it real.</h2></div>
            <div className="detail-checklist">
              {[{ key: "save", label: "Save this place", done: saved }, { key: "weather", label: "Check the weather", done: checklist.weather }, { key: "guide", label: "Open the guide", done: checklist.guide }].map((item) => <button type="button" key={item.key} onClick={() => item.key === "save" ? toggleSaved() : setChecklist((current) => ({ ...current, [item.key]: !current[item.key] }))} className={item.done ? "done" : ""}><span>{item.done ? <FaCheck /> : item.key === "weather" ? <FaCloudSun /> : <FaCompass />}</span>{item.label}<strong>{item.done ? "Done" : "Go"}</strong></button>)}
            </div>
            <button type="button" onClick={() => navigate("/add-trip", { state: { destination: destination.name } })} className="detail-plan-button">Start a trip <FaCompass /></button>
          </div>}
        </section>
      </main>
    </div>
  );
}
