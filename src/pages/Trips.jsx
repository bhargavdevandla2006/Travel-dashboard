import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TripCard from "../components/TripCard";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { getTrips } from "../services/api";

export default function Trips() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);

  /*
  =========================================================
  LOAD TRIPS
  =========================================================
  */

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

  /*
  =========================================================
  ADD NEW TRIP
  =========================================================
  */

  function tripsBtn() {
    navigate("/add-trip");
  }

  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (
    <div
      className="
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
          bg-white
          dark:bg-[#1e293b]

          rounded-[40px]

          overflow-hidden

          flex

          transition
          duration-300
        "
      >
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <Sidebar />

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div
          className="
            flex-1
            p-12
          "
        >
          {/* Navbar */}

          <Navbar />

          {/* =================================================
              PAGE HEADER
          ================================================= */}

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

            {/* Add Trip */}

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

          {/* =================================================
              TRIPS GRID
          ================================================= */}

          <div
            className="
              grid

              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3

              gap-10

              mt-16
            "
          >
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                id={trip.id}
                title={trip.title}
                location={trip.location}
                price={trip.price}
                image={trip.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}