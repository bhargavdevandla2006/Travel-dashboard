import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiUrl from "../services/api";
import { FaMapMarkerAlt, FaStar, FaPlane, FaCheck, FaCompass, FaHeart, FaRegHeart, FaShareAlt, FaPen, FaPlus, FaTrash, FaArrowLeft } from "react-icons/fa";

export default function TripDetails() {

  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [trip, setTrip] = useState(state || null);
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(() => localStorage.getItem(`saved-trip-${id}`) === "true");
  const [shareStatus, setShareStatus] = useState("");
  const [savedNotes, setSavedNotes] = useState(() => {
    try {
      const notes = JSON.parse(localStorage.getItem(`trip-notes-${id}`) || "null");
      if (Array.isArray(notes)) return notes;
      const oldNote = localStorage.getItem(`trip-note-${id}`);
      return oldNote ? [{ id: `legacy-${id}`, text: oldNote }] : [];
    } catch {
      return [];
    }
  });
  const [tripNote, setTripNote] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [noteStatus, setNoteStatus] = useState("");
  const [checklist, setChecklist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`trip-checklist-${id}`) || "null") || { route: false, stay: false, essentials: false };
    } catch {
      return { route: false, stay: false, essentials: false };
    }
  });
  const [customItems, setCustomItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`trip-items-${id}`) || "[]");
    } catch {
      return [];
    }
  });
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    if (state || !id) return;

    async function loadTrip() {
      try {
        const response = await fetch(`${apiUrl}/trips/${id}`, { credentials: "include" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Trip not found");
        setTrip(data);
      } catch (loadError) {
        setError(loadError.message || "Trip not found");
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [id, state]);

  useEffect(() => {
    if (id) localStorage.setItem(`trip-checklist-${id}`, JSON.stringify(checklist));
  }, [checklist, id]);

  useEffect(() => {
    if (id) localStorage.setItem(`trip-items-${id}`, JSON.stringify(customItems));
  }, [customItems, id]);

  function toggleChecklist(item) {
    setChecklist((current) => ({ ...current, [item]: !current[item] }));
  }

  function addCustomItem(event) {
    event.preventDefault();
    const label = newItem.trim();
    if (!label) return;
    setCustomItems((items) => [...items, { id: `${Date.now()}-${label}`, label, done: false }]);
    setNewItem("");
  }

  function toggleCustomItem(itemId) {
    setCustomItems((items) => items.map((item) => item.id === itemId ? { ...item, done: !item.done } : item));
  }

  function removeCustomItem(itemId) {
    setCustomItems((items) => items.filter((item) => item.id !== itemId));
  }

  function toggleSaved() {
    const nextSaved = !saved;
    setSaved(nextSaved);
    localStorage.setItem(`saved-trip-${id}`, String(nextSaved));
  }

  async function shareTrip() {
    const shareData = {
      title: trip.title,
      text: `Explore ${trip.title} in ${trip.location}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      } else {
        throw new Error("Sharing is unavailable");
      }
      setShareStatus("Link ready");
      window.setTimeout(() => setShareStatus(""), 2200);
    } catch (shareError) {
      if (shareError.name !== "AbortError") setShareStatus("Try again");
    }
  }

  function saveTripNote() {
    const nextNote = tripNote.trim();
    if (!nextNote) return;
    const note = { id: `${Date.now()}-${nextNote}`, text: nextNote };
    setSavedNotes((notes) => {
      const nextNotes = [...notes, note];
      localStorage.setItem(`trip-notes-${id}`, JSON.stringify(nextNotes));
      return nextNotes;
    });
    setTripNote("");
    setSelectedNoteId(null);
    setNoteStatus("Note saved");
    window.setTimeout(() => setNoteStatus(""), 2200);
  }

  function selectTripNote(note) {
    setTripNote(note.text);
    setSelectedNoteId(note.id);
  }

  function deleteTripNote(noteId) {
    setSavedNotes((notes) => {
      const nextNotes = notes.filter((note) => note.id !== noteId);
      localStorage.setItem(`trip-notes-${id}`, JSON.stringify(nextNotes));
      return nextNotes;
    });
    if (selectedNoteId === noteId) {
      setTripNote("");
      setSelectedNoteId(null);
    }
  }

const handlePayment = async () => {

  try {

    const response = await fetch(
      `${apiUrl}/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: 850
        })
      }
    );


    const data = await response.json();


    if (!data.success) {
      alert("Order creation failed");
      return;
    }


    const options = {

      key: "rzp_test_T8W9DnTQnXnOQf" , 

      amount: data.order.amount,

      currency: "INR",

      name: "Travel Dashboard",

      description: trip.title,

      order_id: data.order.id,


      handler: function (response) {

        console.log("Payment ID:", response.razorpay_payment_id);
        console.log("Order ID:", response.razorpay_order_id);

        alert("Payment Successful 🎉");

      },


      prefill: {
        name: "Bhargav",
        email: "test@gmail.com"
      },


      theme: {
        color: "#2563eb"
      }

    };


    const razorpay = new window.Razorpay(options);

    razorpay.open();


  } catch (error) {

    console.log("Payment Error:", error);

  }

};

  if (loading) {
    return <div className="min-h-screen bg-white p-10 text-center text-gray-500 dark:bg-[#0f172a] dark:text-gray-300">Loading trip...</div>;
  }

  if (!trip) {
    return <div className="min-h-screen bg-white p-10 text-center text-gray-500 dark:bg-[#0f172a] dark:text-gray-300">{error || "Trip not found"}</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-white text-gray-900 dark:bg-[#0f172a] dark:text-white">
      <div className="bg-white dark:bg-[#1e293b] rounded-[40px] overflow-hidden flex">

        <Sidebar />

        <div className="flex-1 p-10">

          <Navbar />

          <button type="button" onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:-translate-x-1 hover:border-blue-500 hover:text-blue-600 dark:border-slate-600 dark:text-slate-200" aria-label="Go back">
            <FaArrowLeft /> Back
          </button>


          <img
            src={trip.image}
            className="w-full h-[400px] object-cover rounded-3xl shadow-lg"
          />

          <div className="mt-8 flex justify-between">

            <div>
              <h1 className="text-5xl font-bold">
                {trip.title}
              </h1>

              <p className="flex items-center gap-2 text-gray-500 mt-2">
                <FaMapMarkerAlt />
                {trip.location}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={toggleSaved} className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold transition ${saved ? "bg-rose-500 text-white" : "bg-white text-slate-800 shadow-sm dark:bg-[#111827] dark:text-slate-200"}`}>
                  {saved ? <FaHeart /> : <FaRegHeart />} {saved ? "Saved trip" : "Save trip"}
                </button>
                <button type="button" onClick={shareTrip} className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-blue-500 hover:text-blue-600 dark:border-slate-600 dark:text-slate-200">
                  <FaShareAlt /> {shareStatus || "Share trip"}
                </button>
              </div>
            </div>


            <div className="bg-blue-600 text-white px-8 py-4 rounded-3xl flex flex-col items-center">
              <h1 className="text-3xl font-bold">{trip.price}</h1>


              <button
                onClick={handlePayment}
                className="mt-4 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-2xl font-bold cursor-pointer"
              >
                Pay ₹850
              </button>
            </div>

          </div>


          <div className="grid grid-cols-3 gap-6 mt-10">

            <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl shadow-md">
              <FaStar className="text-yellow-400 text-2xl" />
              <h1 className="font-bold mt-2">Rating</h1>
              <p>4.9 / 5</p>
            </div>

            <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl shadow-md">
              <FaPlane className="text-blue-600 text-2xl" />
              <h1 className="font-bold mt-2">Flights</h1>
              <p>Direct available</p>
            </div>

            <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl shadow-md">
              <h1 className="font-bold">Best Season</h1>
              <p>Nov - April</p>
            </div>

          </div>

          <section className="mt-10 rounded-3xl border border-slate-700 bg-[#111827] p-6 shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300"><FaCompass /> Trip launchpad</p>
                <h2 className="mt-2 text-2xl font-black">Make this route real.</h2>
                <p className="mt-2 text-sm text-slate-400">Three quick checks, saved automatically for this trip.</p>
              </div>
              <strong className="rounded-full bg-cyan-300/10 px-4 py-2 text-sm text-cyan-300">{Object.values(checklist).filter(Boolean).length}/3 ready</strong>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-700">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500" style={{ width: `${(Object.values(checklist).filter(Boolean).length / 3) * 100}%` }} />
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[{ key: "route", label: "Pick your route" }, { key: "stay", label: "Save a stay" }, { key: "essentials", label: "Pack essentials" }].map((item) => (
                <button key={item.key} type="button" onClick={() => toggleChecklist(item.key)} className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold transition ${checklist[item.key] ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300" : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-300/50 hover:text-white"}`}>
                  <span>{item.label}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-current text-xs">{checklist[item.key] && <FaCheck />}</span>
                </button>
              ))}
            </div>

            <form onSubmit={addCustomItem} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input value={newItem} onChange={(event) => setNewItem(event.target.value)} maxLength={80} placeholder="Add a custom stop or task..." className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/60" />
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-200"><FaPlus /> Add item</button>
            </form>

            {customItems.length > 0 && (
              <div className="mt-4 grid gap-2">
                {customItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <button type="button" onClick={() => toggleCustomItem(item.id)} aria-label={item.done ? `Mark ${item.label} incomplete` : `Mark ${item.label} complete`} className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${item.done ? "border-emerald-400 bg-emerald-400 text-slate-950" : "border-slate-500 text-transparent"}`}><FaCheck /></button>
                    <span className={`flex-1 text-sm ${item.done ? "text-slate-500 line-through" : "text-slate-200"}`}>{item.label}</span>
                    <button type="button" onClick={() => removeCustomItem(item.id)} aria-label={`Delete ${item.label}`} className="p-2 text-slate-500 transition hover:text-rose-300"><FaTrash /></button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-md dark:border-slate-700 dark:bg-[#111827]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-600 dark:text-cyan-300"><FaPen /> Private trip note</p>
                <h2 className="mt-2 text-2xl font-black">Leave yourself a signal.</h2>
              </div>
              <span className="text-xs font-bold text-slate-400">{tripNote.length}/240</span>
            </div>
            <textarea
              value={tripNote}
              maxLength={240}
              onChange={(event) => setTripNote(event.target.value)}
              placeholder="Add a hotel, food spot, or moment to remember..."
              className="mt-5 min-h-28 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">{noteStatus}</span>
              <button type="button" onClick={saveTripNote} className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700">Save note</button>
            </div>
            {savedNotes.length > 0 && (
              <div className="mt-5 rounded-2xl border border-cyan-200 bg-cyan-50 p-5 dark:border-cyan-400/20 dark:bg-cyan-400/10">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-cyan-300">Saved signal</p>
                <div className="mt-3 grid gap-3">
                  {savedNotes.map((note, index) => (
                    <div key={note.id} className="flex items-start gap-3 rounded-2xl border border-cyan-200/70 bg-white/70 p-3 dark:border-cyan-300/10 dark:bg-slate-950/20">
                      <span className="mt-0.5 text-xs font-bold text-cyan-700 dark:text-cyan-300">{String(index + 1).padStart(2, "0")}</span>
                      <p className="flex-1 whitespace-pre-wrap text-sm font-semibold leading-6 text-slate-800 dark:text-slate-100">{note.text}</p>
                      <div className="flex shrink-0 gap-2">
                        <button type="button" onClick={() => selectTripNote(note)} className="rounded-lg bg-cyan-100 px-2.5 py-1.5 text-xs font-bold text-cyan-800 transition hover:bg-cyan-200 dark:bg-cyan-300/10 dark:text-cyan-200">Select</button>
                        <button type="button" onClick={() => deleteTripNote(note.id)} aria-label={`Delete note ${index + 1}`} className="rounded-lg bg-rose-100 px-2.5 py-1.5 text-xs font-bold text-rose-700 transition hover:bg-rose-200 dark:bg-rose-400/10 dark:text-rose-300"><FaTrash /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

        </div>

      </div>
    </div>
  );
}