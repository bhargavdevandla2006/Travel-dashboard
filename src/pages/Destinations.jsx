import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaCheck,
  FaCompass,
  FaHeart,
  FaMapMarkerAlt,
  FaPlus,
  FaRandom,
  FaRegHeart,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { getDestinations } from "../services/api";

export default function Destinations() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("All regions");
  const [sort, setSort] = useState("Curated");
  const [savedIds, setSavedIds] = useState(() => getSavedIds());
  const [showAdd, setShowAdd] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDestinations() {
      try {
        const data = await getDestinations();
        const places = Array.isArray(data) ? data : [];
        setDestinations(places);
        setSelected(places[0] || null);
      } catch (loadError) {
        console.error("Failed to load destinations:", loadError);
        setError("We could not load destinations right now.");
      }
    }

    loadDestinations();
  }, []);

  const countries = useMemo(
    () => ["All regions", ...new Set(destinations.map((place) => place.country).filter(Boolean))],
    [destinations]
  );

  const filteredDestinations = useMemo(() => {
    const query = search.trim().toLowerCase();
    const visible = destinations.filter((place) => {
      const matchesSearch = !query || `${place.name} ${place.country}`.toLowerCase().includes(query);
      const matchesCountry = country === "All regions" || place.country === country;
      return matchesSearch && matchesCountry;
    });

    return [...visible].sort((first, second) => {
      if (sort === "A-Z") return first.name.localeCompare(second.name);
      if (sort === "Saved") return Number(savedIds.has(second.id)) - Number(savedIds.has(first.id));
      return first.id - second.id;
    });
  }, [country, destinations, savedIds, search, sort]);

  function getSavedIds() {
    try {
      const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
      return new Set(saved.map((place) => `${place.id || place.name}-${place.country}`));
    } catch {
      return new Set();
    }
  }

  function destinationKey(place) {
    return `${place.id || place.name}-${place.country}`;
  }

  function toggleSaved(place) {
    const key = destinationKey(place);
    let favorites;
    try {
      favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    } catch {
      favorites = [];
    }

    const alreadySaved = savedIds.has(key);
    const nextFavorites = alreadySaved
      ? favorites.filter((item) => destinationKey(item) !== key)
      : [...favorites, { id: place.id, name: place.name, country: place.country, image: place.image }];

    localStorage.setItem("favorites", JSON.stringify(nextFavorites));
    setSavedIds(getSavedIds());
  }

  function surpriseMe() {
    if (!filteredDestinations.length) return;
    const next = filteredDestinations[Math.floor(Math.random() * filteredDestinations.length)];
    setSelected(next);
    document.getElementById(`destination-${next.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function addDestination(event) {
    event.preventDefault();
    if (!placeName.trim()) return;
    setAdding(true);
    setError("");

    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(placeName.trim())}`);
      if (!response.ok) throw new Error("Destination not found");
      const data = await response.json();
      const newPlace = {
        id: `local-${Date.now()}`,
        name: data.title || placeName.trim(),
        country: "Explore",
        image: data.originalimage?.source || data.thumbnail?.source || "",
        description: data.extract,
      };
      const storedPlaces = JSON.parse(localStorage.getItem("destination_discoveries") || "[]");
      localStorage.setItem("destination_discoveries", JSON.stringify([newPlace, ...storedPlaces]));
      setDestinations((current) => [newPlace, ...current]);
      setSelected(newPlace);
      setPlaceName("");
      setShowAdd(false);
    } catch (addError) {
      setError(addError.message || "We could not add that destination.");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="destination-shell min-h-screen p-4 text-slate-900 dark:text-white md:p-6">
      <div className="destination-layout flex overflow-hidden rounded-[32px] bg-white dark:bg-[#111827]">
        <Sidebar />
        <main className="destination-main flex-1 p-6 md:p-10 xl:p-12">
          <Navbar />
          <section className="destination-hero mt-10 overflow-hidden rounded-[30px] p-6 text-white md:p-10">
            <div className="destination-orbit destination-orbit-one" />
            <div className="destination-orbit destination-orbit-two" />
            <div className="relative z-10 max-w-2xl">
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">
                <FaCompass /> Destination atlas
              </p>
              <h1 className="max-w-xl text-5xl font-black leading-[0.95] tracking-tight md:text-8xl">WHERE<br />NEXT?</h1>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <label className="flex flex-1 items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/20 backdrop-blur-md">
                  <FaSearch className="text-cyan-200" />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a city or country" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-300" />
                </label>
                <button type="button" onClick={() => setShowAdd(true)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200">
                  <FaPlus /> Add place
                </button>
                <button type="button" onClick={surpriseMe} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-white/20">
                  <FaRandom /> Surprise me
                </button>
              </div>
            </div>
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">Your next coordinates</p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight">Pick a direction</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {countries.map((item) => (
                    <button key={item} type="button" onClick={() => setCountry(item)} className={`rounded-full px-3 py-2 text-xs font-bold transition ${country === item ? "bg-slate-900 text-white dark:bg-cyan-300 dark:text-slate-950" : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300"}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10">
                <p className="text-sm text-slate-500 dark:text-slate-400">{filteredDestinations.length} places</p>
                <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border-0 bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600 outline-none dark:bg-white/10 dark:text-slate-200">
                  <option>Curated</option>
                  <option>A-Z</option>
                  <option>Saved</option>
                </select>
              </div>

              {error && <p className="mb-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-600 dark:bg-rose-950/30 dark:text-rose-300">{error}</p>}

              {filteredDestinations.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 p-10 text-center dark:border-white/20">
                  <p className="font-bold">No destinations match that search.</p>
                  <button type="button" onClick={() => { setSearch(""); setCountry("All regions"); }} className="mt-3 text-sm font-bold text-cyan-600">Clear filters</button>
                </div>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {filteredDestinations.map((place, index) => {
                    const isSaved = savedIds.has(destinationKey(place));
                    return (
                      <article id={`destination-${place.id}`} key={place.id} className={`destination-card group relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-[#172033] ${selected?.id === place.id ? "destination-card-selected" : ""}`} style={{ "--delay": `${index * 70}ms` }}>
                        <button type="button" onClick={() => setSelected(place)} className="block w-full text-left">
                          {place.image ? <img src={place.image} alt={place.name} className="h-52 w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="h-52 w-full bg-gradient-to-br from-cyan-300 to-slate-800" />}
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div><p className="text-lg font-black">{place.name}</p><p className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400"><FaMapMarkerAlt /> {place.country}</p></div>
                              <span className="rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-900/70 dark:text-slate-300">{String(index + 1).padStart(2, "0")}</span>
                            </div>
                          </div>
                        </button>
                        <div className="flex items-center gap-3 px-5 pb-5">
                          <button type="button" onClick={() => navigate(`/destinations/${place.id}`)} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-cyan-600 dark:bg-cyan-300 dark:text-slate-950"><span>Open guide</span><FaArrowRight /></button>
                          <button type="button" aria-label={isSaved ? `Remove ${place.name} from favorites` : `Save ${place.name}`} onClick={() => toggleSaved(place)} className={`rounded-xl p-3 transition ${isSaved ? "bg-rose-100 text-rose-500 dark:bg-rose-500/20" : "bg-white text-slate-400 hover:text-rose-500 dark:bg-white/10"}`}>{isSaved ? <FaHeart /> : <FaRegHeart />}</button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            <aside className="destination-preview self-start rounded-3xl bg-slate-900 p-5 text-white dark:bg-[#172033]">
              <div className="flex items-center justify-between"><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">Now boarding</p><FaCompass className="text-cyan-300" /></div>
              {selected ? <>
                {selected.image ? <img src={selected.image} alt={selected.name} className="mt-5 h-44 w-full rounded-2xl object-cover" /> : <div className="mt-5 h-44 rounded-2xl bg-gradient-to-br from-cyan-300 to-slate-700" />}
                <h3 className="mt-5 text-2xl font-black">{selected.name}</h3>
                <p className="mt-1 text-sm text-slate-300">{selected.country}</p>
                <div className="mt-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-slate-400"><span className="h-2 w-2 rounded-full bg-cyan-300" /> {selected.description ? "Live brief" : "Ready to explore"}</div>
                <button type="button" onClick={() => navigate(`/destinations/${selected.id}`)} className="mt-5 flex w-full items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold transition hover:bg-cyan-300 hover:text-slate-950"><span>Open guide</span><FaArrowRight /></button>
              </> : <p className="mt-6 text-sm text-slate-400">Choose a place to see its signal.</p>}
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5"><div><p className="text-2xl font-black">{destinations.length}</p><p className="text-xs text-slate-400">in discovery</p></div><div><p className="text-2xl font-black">{savedIds.size}</p><p className="text-xs text-slate-400">saved for later</p></div></div>
            </aside>
          </section>
        </main>
      </div>

      {showAdd && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="add-destination-title">
        <form onSubmit={addDestination} className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl dark:bg-[#172033] dark:text-white">
          <div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-600">Live lookup</p><h2 id="add-destination-title" className="mt-2 text-2xl font-black">Name a place</h2></div><button type="button" onClick={() => setShowAdd(false)} aria-label="Close add destination dialog" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10"><FaTimes /></button></div>
          <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">We will fetch its summary and image, then add it to this discovery board for your session.</p>
          <input autoFocus value={placeName} onChange={(event) => setPlaceName(event.target.value)} placeholder="e.g. Lisbon" className="mt-6 w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm outline-none ring-cyan-300 transition focus:ring-2 dark:bg-white/10" />
          <button disabled={adding || !placeName.trim()} type="submit" className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-bold text-white transition hover:bg-cyan-600 disabled:opacity-50 dark:bg-cyan-300 dark:text-slate-950">{adding ? "Finding place..." : <><FaCheck /> Add to discovery</>}</button>
        </form>
      </div>}
    </div>
  );
}