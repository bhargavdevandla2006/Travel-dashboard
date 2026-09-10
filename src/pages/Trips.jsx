import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TripCard from "../components/TripCard";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { getTrips } from "../services/api";
import { getActiveBudget, getBudgetForTrip } from "../utils/budget";

export default function Trips() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const [trips, setTrips] = useState([]);
    const [activeTrip, setActiveTrip] = useState(0);

    const activeBudget =
        searchParams.get("budget") || getActiveBudget();

    const budgetTrips = trips.filter(
        (trip) => getBudgetForTrip(trip) === activeBudget
    );

  

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await getTrips();

        setTrips(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(
          "Failed to load trips:",
          error
        );

        setTrips([]);
      }
    }

    loadTrips();
  }, []);

  

  function tripsBtn() {
    navigate("/add-trip");
  }

  function removeTrip(tripId) {
    setTrips((current) => {
      const nextTrips = current.filter((trip) => trip.id !== tripId);
      if (activeTrip >= nextTrips.length && activeTrip > 0) {
        setActiveTrip(Math.max(0, activeTrip - 3));
      }
      return nextTrips;
    });
  }

  const visibleTrips = budgetTrips.slice(activeTrip, activeTrip + 3);

  

  return (
    <div
      className="
        trips-page
        bg-white
        dark:bg-[#0f172a]

        min-h-screen

        p-6

        transition
        duration-300
      "
    >
      <div
          className="
          trips-shell
          relative
          z-10
          bg-white
          dark:bg-[#1e293b]

          rounded-[40px]

          overflow-hidden

          flex

          transition
          duration-300
        "
      >
        

        <Sidebar />

        

        <div
          className="
            flex-1
            p-12
          "
        >
          

          <Navbar />

          

          <div
            className="
              flex
              justify-between
              items-center

              mt-14
            "
          >
            <div>
              <h1
                className="
                  text-3xl

                  font-playfair
                  font-bold

                  text-gray-900
                  dark:text-white

                  tracking-tight
                "
              >
                Explore Trips
              </h1>

              <p
                className="
                  text-gray-600
                  dark:text-gray-300

                  mt-3

                  text-lg

                  font-medium
                "
              >
                Discover beautiful destinations
                around the world
              </p>
            </div>

            

            <button
              type="button"
              onClick={tripsBtn}
              className="
                bg-blue-600

                text-white

                px-10
                py-4

                rounded-2xl

                font-bold

                hover:bg-blue-700

                transition

                shadow-lg
                hover:shadow-xl
              "
            >
              + Add New Trip
            </button>
          </div>

          

          <div className="mt-16">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-300">
                {budgetTrips.length ? `${activeTrip + 1}-${Math.min(activeTrip + 3, budgetTrips.length)} of ${budgetTrips.length}` : `No ${activeBudget} trips`}
              </p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setActiveTrip((current) => Math.max(0, current - 3))} disabled={activeTrip === 0} aria-label="Previous trips" className="carousel-arrow rounded-xl bg-gray-200 p-3 text-gray-700 transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/10 dark:text-white"><FaChevronLeft /></button>
                <button type="button" onClick={() => setActiveTrip((current) => Math.min(Math.max(0, budgetTrips.length - 3), current + 3))} disabled={!budgetTrips.length || activeTrip + 3 >= budgetTrips.length} aria-label="Next trips" className="carousel-arrow rounded-xl bg-gray-200 p-3 text-gray-700 transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/10 dark:text-white"><FaChevronRight /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
              {visibleTrips.map((trip) => (
                <TripCard key={trip.id} {...trip} onRemove={removeTrip} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}