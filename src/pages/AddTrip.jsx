import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCompass, FaGlobeAmericas, FaMapMarkerAlt, FaPlane, FaSuitcaseRolling } from "react-icons/fa";
import { createTrip } from "../services/api";

export default function AddTrip() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const wiki = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(destination.trim())}`
      );
      const wikiData = wiki.ok ? await wiki.json() : {};

      const tripData = {
        title: wikiData.title || destination,
        location: destination,
        price: Math.floor(Math.random() * 5000) + 500,
        image:
          wikiData.thumbnail?.source ||
          "https://via.placeholder.com/400x250",
      };

      await createTrip(tripData);
      navigate("/trips");
    } catch (error) {
      setError(error.message || "Could not add this trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="travel-page relative min-h-screen overflow-hidden bg-[#020617] px-6 py-16 text-white">
      <div className="travel-backdrop pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="travel-flight-board travel-flight-board-one">DEPARTURES <span>08:42</span></div>
        <div className="travel-flight-board travel-flight-board-two">NEXT STOP <span>ANYWHERE</span></div>
        <div className="travel-route travel-route-one" />
        <div className="travel-route travel-route-two" />
        <span className="travel-node travel-node-one" />
        <span className="travel-node travel-node-two" />
        <span className="travel-node travel-node-three" />
        <span className="travel-pin travel-pin-one"><FaMapMarkerAlt /></span>
        <span className="travel-pin travel-pin-two"><FaMapMarkerAlt /></span>
        <FaPlane className="travel-plane travel-plane-one" />
        <FaPlane className="travel-plane travel-plane-two" />
        <FaPlane className="travel-plane-sweep travel-plane-sweep-forward" />
        <FaPlane className="travel-plane-sweep travel-plane-sweep-return" />
        <FaCompass className="travel-compass" />
        <FaGlobeAmericas className="travel-globe" />
        <FaSuitcaseRolling className="travel-suitcase" />
        <div className="travel-label travel-label-one"><span>03</span> destinations saved</div>
        <div className="travel-label travel-label-two">next stop <span>anywhere</span></div>
      </div>
      <div className="travel-shell relative mx-auto max-w-6xl overflow-hidden rounded-[42px] border border-white/70 bg-[#f8fafc] shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
        <div className="relative grid gap-10 p-10 md:grid-cols-[1.2fr_0.95fr] md:p-14">
          <div className="travel-story space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-slate-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.8)]" />
              Voyager Edition
            </div>

            <div className="space-y-6">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-sky-700">Atlas / 01</p>
              <h1 className="max-w-3xl text-3xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl">
                Turn any destination into a <span className="text-sky-600">bold travel story.</span>
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Enter a place, hit generate, and watch your next escape take shape through a sharper, more cinematic lens.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-slate-800 bg-[#05070b] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-300">Top pickups</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {[
                    "Bali escapes",
                    "Arctic aurora",
                    "Kyoto bloom",
                    "Santorini stays",
                  ].map((item) => (
                    <span key={item} className="travel-chip rounded-2xl border border-white/10 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-800 bg-[#05070b] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-rose-300">Why this page</p>
                <ul className="mt-5 space-y-3 text-sm text-slate-300">
                  <li>• Glossy destination preview</li>
                  <li>• Smart destination input</li>
                  <li>• Fast, minimal flow with strong contrast</li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[36px] border border-slate-800 bg-[#05070b] p-6 shadow-[0_30px_65px_rgba(0,0,0,0.25)]">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-sky-500/20 blur-2xl" />
              <div className="absolute -left-10 bottom-10 h-28 w-28 rounded-full bg-rose-500/15 blur-2xl" />
              <div className="relative z-10 grid gap-5 sm:grid-cols-3">
                {[
                  { label: "Instant mood", value: "Bold" },
                  { label: "Looks", value: "Sharp" },
                  { label: "Energy", value: "Clean" },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-slate-800/80 p-4 backdrop-blur-sm">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-300/80">
                      {item.label}
                    </p>
                    <p className="mt-3 text-xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="travel-generator relative overflow-hidden rounded-[40px] border border-slate-700 bg-[linear-gradient(145deg,#151922_0%,#050609_48%,#000000_100%)] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.38)] lg:p-10"
          >
            <div className="absolute -right-12 top-8 h-36 w-36 rounded-full border border-sky-300/20 shadow-[0_0_70px_rgba(56,189,248,0.24)]" />
            <div className="absolute -left-12 bottom-10 h-28 w-28 rounded-full bg-rose-400/10 blur-2xl" />

            <div className="mb-8 space-y-4">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-sky-300">
                Quick trip generator
              </p>
              <h2 className="text-2xl font-bold text-white">Enjoy your Trips</h2>
              <p className="max-w-[22rem] text-sm leading-6 text-slate-300">
                Enter a place and we'll build a destination preview for you.
              </p>
            </div>

            <label className="block text-center text-sm text-slate-200">
              Destination
              <input
                type="text"
                placeholder="Enter a destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="mt-4 w-full rounded-[26px] border border-white/10 bg-white px-5 py-4 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/20"
              />
            </label>

    

            <button
              type="submit"
              disabled={loading || !destination.trim()}
              className="mt-8 inline-flex w-full items-center justify-center rounded-[26px] bg-gradient-to-r from-sky-400 to-cyan-300 px-6 py-4 text-base font-bold text-slate-950 shadow-[0_12px_30px_rgba(34,211,238,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_35px_rgba(34,211,238,0.3)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Trip"}
            </button>

            {error && (
              <p className="mt-4 rounded-2xl border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
                {error}
              </p>
            )}

            <div className="mt-7 rounded-3xl border border-white/10 bg-white p-5 text-sm text-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
              <p className="font-semibold text-slate-900">Trending starters</p>
              <div className="mt-4 flex flex-wrap gap-3">
                {["Bali", "Marrakesh", "Seoul", "Oslo"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDestination(item)}
                    className="rounded-2xl border bg-white  px-3 py-2 text-xs text-slate-950 transition hover:border-slate-700/60 hover:bg-slate-950/20"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
