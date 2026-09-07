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

export default function DestinationDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [weather, setWeather] = useState(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [saved, setSaved] = useState(false);
  const [shareStatus, setShareStatus] = useState("");
  const [checklist, setChecklist] = useState({ weather: false, guide: false });

  useEffect(() => {
    async function loadDestination() {
      try {
        const localDestinations = JSON.parse(localStorage.getItem("destination_discoveries") || "[]");
        const localDestination = localDestinations.find((place) => String(place.id) === String(id));
        const data = localDestination || await getDestinationById(id);
        setDestination(data);

        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setSaved(favorites.some((place) => getDestinationKey(place) === getDestinationKey(data)));

        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        if (apiKey && data?.name) {
          const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(data.name)}&appid=${apiKey}&units=metric`);
          if (weatherResponse.ok) setWeather(await weatherResponse.json());
        }
      } catch (error) {
        console.error("Failed to load destination:", error);
      }
    }

    loadDestination();
  }, [id, location.key]);

  const hue = useMemo(() => getDestinationHue(destination?.name), [destination?.name]);

  function toggleSaved() {
    if (!destination) return;
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const key = getDestinationKey(destination);
    const nextFavorites = saved
      ? favorites.filter((place) => getDestinationKey(place) !== key)
      : [...favorites, { id: destination.id, name: destination.name, country: destination.country, image: destination.image }];

    localStorage.setItem("favorites", JSON.stringify(nextFavorites));
    setSaved(!saved);
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

  const weatherCondition = weather?.weather?.[0]?.main || "Waiting for weather";

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
        <span className="detail-nav-label">FIELD GUIDE / {String(destination.id).padStart(2, "0")}</span>
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
          <div className="detail-hero-number">{String(destination.id).padStart(2, "0")}</div>
        </section>

        <section className="destination-detail-body">
          <nav className="detail-tabs" aria-label="Destination sections">
            {["Overview", "Weather", "Plan"].map((tab) => <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={activeTab === tab ? "active" : ""}>{tab}</button>)}
          </nav>

          {activeTab === "Overview" && <div className="detail-panel detail-overview-panel">
            <div className="detail-overview-heading"><p className="detail-kicker">The short version</p><h2>A different kind of detour.</h2></div>
            <p className="detail-description">{destination.description || `A new route through ${destination.name}. Save it now and build the details around your own style of travel.`}</p>
            <div className="detail-mini-stats"><span><strong>{destination.country}</strong><small>region</small></span><span><strong>{weather ? `${Math.round(weather.main.temp)}°` : "--"}</strong><small>right now</small></span><span><strong>{saved ? "01" : "00"}</strong><small>saved</small></span></div>
          </div>}

          {activeTab === "Weather" && <div className="detail-panel detail-weather-panel">
            <div><p className="detail-kicker">Live conditions</p><h2>{weatherCondition}</h2></div>
            {weather ? <div className="weather-metrics"><div><FaSun /><strong>{Math.round(weather.main.temp)}°C</strong><small>temperature</small></div><div><FaUmbrella /><strong>{weather.main.humidity}%</strong><small>humidity</small></div><div><FaWind /><strong>{weather.wind.speed}</strong><small>wind m/s</small></div></div> : <p className="detail-muted">Add a weather API key to see live conditions.</p>}
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
