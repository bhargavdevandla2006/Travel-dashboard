import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTrip } from "../services/api";

export default function AddTrip() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const wiki = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${destination}`
      );
      const wikiData = await wiki.json();

      const tripData = {
        title: wikiData.title || destination,
        location: destination,
        price: Math.floor(Math.random() * 5000) + 500,
        image:
          wikiData.thumbnail?.source ||
          "https://via.placeholder.com/400x250",
      };

      await createTrip(tripData);
      alert("Trip added successfully");
      navigate("/trips");
    } catch (error) {
      alert("Could not fetch destination details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[48px] border bg-white shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.05),_transparent_20%)]" />
        <div className="relative grid gap-10 p-10 md:grid-cols-[1.2fr_0.95fr] md:p-14">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full border  px-4 py-2 text-sm font-semibold tracking-[0.2em] text-slate-100/90">
              Voyager Edition
            </div>

            <div className="space-y-6">
              <h1 className="max-w-3xl text-3xl font-bold leading-tight text-black sm:text-4xl">
                Turn any destination into a bold travel story.
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-black sm:text-base">
                Enter a place, hit generate, and watch your trip card come alive in soft gray tones.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border bg-black p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                <p className="text-sm uppercase tracking-[0.3em] text-white">Top pickups</p>
                <div className="mt-5 flex flex-wrap gap-3 ">
                  {[
                    "Bali escapes",
                    "Arctic aurora",
                    "Kyoto bloom",
                    "Santorini stays",
                  ].map((item) => (
                    <span key={item} className="rounded-2xl bg-white px-4 py-2 text-sm text-black">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border bg-black p-6 shadow-[0_20px_50px_rgba(0,0,0,0.2)]">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Why this page</p>
                <ul className="mt-5 space-y-3 text-sm text-slate-300">
                  <li>• Glossy destination preview</li>
                  <li>• Smart destination input</li>
                  <li>• Fast, minimal flow with strong contrast</li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[36px] border bg-black p-6 shadow-[0_30px_65px_rgba(0,0,0,0.25)]">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-slate-600/70 blur-2xl" />
              <div className="absolute -left-10 bottom-10 h-28 w-28 rounded-full bg-slate-700/70 blur-2xl" />
              <div className="relative z-10 grid gap-5 sm:grid-cols-3">
                {[
                  { label: "Instant mood", value: "Bold" },
                  { label: "Looks", value: "Sharp" },
                  { label: "Energy", value: "Clean" },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl bg-slate-700/80 p-4 backdrop-blur-sm">
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
            className="relative rounded-[40px] border bg-black p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)] lg:p-10"
          >
            <div className="absolute right-6 top-6 hidden h-24 w-24 rounded-full bg-white blur-3xl md:block" />
            <div className="absolute left-6 bottom-6 hidden h-20 w-20 rounded-full bg-slate-900/10 blur-3xl md:block" />

            <div className="mb-8 space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-white">
                Quick trip generator
              </p>
              <h2 className="text-2xl font-bold text-white">Enjoy your Trips</h2>
              <p className="max-w-[22rem] text-sm text-white">
                Enter a place and we'll build a destination preview for you.
              </p>
            </div>

            <label className="block text-sm text-white text-center underline">
              Destination
              <input
                type="text"
                placeholder="Enter a destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="mt-4 w-full rounded-[26px] border bg-white px-5 py-4 text-black outline-none transition focus:border-slate-700/40 focus:ring-2 focus:ring-slate-700/10"
              />
            </label>

    

            <button
              type="submit"
              disabled={loading || !destination.trim()}
              className="mt-8 inline-flex w-full items-center justify-center rounded-[26px] bg-white text-black  px-6 py-4 text-base font-semibold shadow-lg shadow-slate-900/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Trip"}
            </button>

            <div className="mt-7 rounded-3xl border border-slate-600/50 bg-white p-5 text-sm text-slate-200">
              <p className="font-semibold text-black">Trending starters</p>
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
