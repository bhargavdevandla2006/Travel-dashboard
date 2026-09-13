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

  // ============================================================
  // STATE
  // ============================================================

  // ALL trips are stored here
  const [trips, setTrips] = useState([]);

  // Which slide are we currently viewing?
  // 0 = first slide
  // 1 = second slide
  // 2 = third slide
  const [activeSlide, setActiveSlide] = useState(0);

  // ============================================================
  // ACTIVE BUDGET
  // ============================================================

  const activeBudget =
    searchParams.get("budget") || getActiveBudget();

  // ============================================================
  // FILTER TRIPS BY BUDGET
  // ============================================================

  const budgetTrips = trips.filter(
    (trip) => getBudgetForTrip(trip) === activeBudget
  );

  // ============================================================
  // LOAD ALL TRIPS
  // ============================================================

  useEffect(() => {
    async function loadTrips() {
      try {
        const data = await getTrips();

        // Keep ALL trips
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

  // ============================================================
  // RESET SLIDE WHEN BUDGET CHANGES
  // ============================================================

  useEffect(() => {
    setActiveSlide(0);
  }, [activeBudget]);

  // ============================================================
  // TOTAL NUMBER OF SLIDES
  // ============================================================

  // 3 trips per slide
  //
  // Example:
  // 3 trips  = 1 slide
  // 4 trips  = 2 slides
  // 6 trips  = 2 slides
  // 7 trips  = 3 slides
  // 10 trips = 4 slides

  const totalSlides = Math.ceil(
    budgetTrips.length / 3
  );

  // ============================================================
  // CURRENT SLIDE START INDEX
  // ============================================================

  // Slide 0 → starts at 0
  // Slide 1 → starts at 3
  // Slide 2 → starts at 6
  // Slide 3 → starts at 9

  const startIndex = activeSlide * 3;

  // ============================================================
  // SHOW ONLY 3 TRIPS
  // ============================================================

  const visibleTrips = budgetTrips.slice(
    startIndex,
    startIndex + 3
  );

  // ============================================================
  // ADD NEW TRIP BUTTON
  // ============================================================

  function tripsBtn() {
    navigate("/add-trip");
  }

  // ============================================================
  // REMOVE TRIP
  // ============================================================

  function removeTrip(tripId) {
    setTrips((currentTrips) => {
      const nextTrips = currentTrips.filter(
        (trip) => trip.id !== tripId
      );

      return nextTrips;
    });
  }

  // ============================================================
  // NEXT SLIDE
  // ============================================================

  function nextSlide() {
    setActiveSlide((current) => {
      if (current < totalSlides - 1) {
        return current + 1;
      }

      return current;
    });
  }

  // ============================================================
  // PREVIOUS SLIDE
  // ============================================================

  function previousSlide() {
    setActiveSlide((current) => {
      if (current > 0) {
        return current - 1;
      }

      return current;
    });
  }

  // ============================================================
  // RENDER
  // ============================================================

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
        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <Sidebar />

        {/* =====================================================
            MAIN CONTENT
        ===================================================== */}

        <div
          className="
            flex-1
            p-12
          "
        >
          {/* ===================================================
              NAVBAR
          =================================================== */}

          <Navbar />

          {/* ===================================================
              PAGE HEADER
          =================================================== */}

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

            {/* =================================================
                ADD NEW TRIP
            ================================================= */}

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

          {/* ===================================================
              TRIPS SECTION
          =================================================== */}

          <div className="mt-16">

            {/* =================================================
                COUNTER + ARROWS
            ================================================= */}

            <div
              className="
                mb-5
                flex
                items-center
                justify-between
              "
            >
              {/* =================================================
                  TRIP COUNTER
              ================================================= */}

              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-500
                  dark:text-gray-300
                "
              >
                {budgetTrips.length > 0
                  ? `${startIndex + 1}-${Math.min(
                      startIndex + 3,
                      budgetTrips.length
                    )} of ${budgetTrips.length}`
                  : `No ${activeBudget} trips`}
              </p>

              {/* =================================================
                  ARROWS
              ================================================= */}

              <div className="flex gap-2">

                {/* PREVIOUS */}

                <button
                  type="button"
                  onClick={previousSlide}
                  disabled={activeSlide === 0}
                  aria-label="Previous trips"
                  className="
                    carousel-arrow

                    rounded-xl

                    bg-gray-200

                    p-3

                    text-gray-700

                    transition

                    hover:bg-blue-600
                    hover:text-white

                    disabled:cursor-not-allowed
                    disabled:opacity-40

                    dark:bg-white/10
                    dark:text-white
                  "
                >
                  <FaChevronLeft />
                </button>

                {/* NEXT */}

                <button
                  type="button"
                  onClick={nextSlide}
                  disabled={
                    budgetTrips.length === 0 ||
                    activeSlide >= totalSlides - 1
                  }
                  aria-label="Next trips"
                  className="
                    carousel-arrow

                    rounded-xl

                    bg-gray-200

                    p-3

                    text-gray-700

                    transition

                    hover:bg-blue-600
                    hover:text-white

                    disabled:cursor-not-allowed
                    disabled:opacity-40

                    dark:bg-white/10
                    dark:text-white
                  "
                >
                  <FaChevronRight />
                </button>

              </div>
            </div>

            {/* =================================================
                TRIP CARDS
            ================================================= */}

            <div
              className="
                grid
                grid-cols-1
                gap-8
                md:grid-cols-2
                xl:grid-cols-3
              "
            >
              {visibleTrips.map((trip) => (
                <TripCard
                  key={trip.id}
                  {...trip}
                  onRemove={removeTrip}
                />
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}