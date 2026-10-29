import { useEffect, useMemo, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  getTrips,
  getDestinations,
} from "../services/api";

import {
  setActiveBudget,
  clearActiveBudget,
  getBudgetForTrip,
} from "../utils/budget";


// ============================================================
// BUDGET META
// ============================================================

const budgetMeta = {
  low: {
    label: "Low Budget Options",
    description:
      "Affordable, value-packed travel ideas",
  },

  high: {
    label: "High Budget Options",
    description:
      "Comfortable and elevated travel experiences",
  },

  premium: {
    label: "Premium Options",
    description:
      "Luxury, exclusive, high-end experiences",
  },
};


// ============================================================
// CATEGORY OPTIONS
// ============================================================

const categoryOptions = [
  "All",
  "Trips",
  "Destinations",
  "Hotels",
  "Rooms",
  "Activities",
];


// ============================================================
// COMPONENT
// ============================================================

export default function BudgetResults() {

  const { budget = "low" } = useParams();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const section = searchParams.get("section");


  // ==========================================================
  // STATE
  // ==========================================================

  const [trips, setTrips] = useState([]);

  const [destinations, setDestinations] = useState([]);

  const [category, setCategory] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("price-low");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");



  // ==========================================================
  // ACTIVE BUDGET
  // ==========================================================

  const safeBudget =
    budget &&
    ["low", "high", "premium"].includes(budget)
      ? budget
      : "low";



  // ==========================================================
  // LOAD TRIPS FROM API
  // ==========================================================

  useEffect(() => {

    async function loadTrips() {

      try {

        setLoading(true);
        setError("");

        const [tripData, destinationData] = await Promise.all([
          getTrips(),
          getDestinations(),
        ]);

        if (!Array.isArray(tripData)) {
          throw new Error("Trips data is unavailable.");
        }

        if (!Array.isArray(destinationData)) {
          throw new Error("Destination data is unavailable.");
        }

        const savedDiscoveries = JSON.parse(
          localStorage.getItem("destination_discoveries") || "[]"
        );

        setTrips(tripData);
        setDestinations([
          ...destinationData,
          ...(Array.isArray(savedDiscoveries) ? savedDiscoveries : []),
        ]);

      } catch (err) {

        console.error(
          "Failed to load trips:",
          err
        );

        setError(
          err.message ||
          "Failed to load trips."
        );

        setTrips([]);
        setDestinations([]);

      } finally {

        setLoading(false);

      }
    }

    const refreshDestinations = () => {
      loadTrips();
    };

    loadTrips();

    window.addEventListener(
      "travelhub-destination-change",
      refreshDestinations
    );
    window.addEventListener("storage", refreshDestinations);

    return () => {
      window.removeEventListener(
        "travelhub-destination-change",
        refreshDestinations
      );
      window.removeEventListener("storage", refreshDestinations);
    };

  }, [safeBudget]);



  // ==========================================================
  // SAVE ACTIVE BUDGET
  // ==========================================================

  useEffect(() => {

    setActiveBudget(safeBudget);

  }, [safeBudget]);



  // ==========================================================
  // NAVIGATION
  // ==========================================================

  function navigateWithBudget(path) {

    navigate(
      `${path}?budget=${safeBudget}`
    );

  }



  // ==========================================================
  // CLOSE BUDGET PAGE
  // ==========================================================

  function handleCloseBudget() {

    clearActiveBudget();

    navigate("/");

  }



  // ==========================================================
  // CONVERT API DATA INTO CARD DATA
  // ==========================================================

  const formattedTrips = useMemo(() => {

    return trips.map((trip, index) => {

      const price =
        Number.parseInt(
          String(
            trip.price ||
            trip.amount ||
            trip.cost ||
            "0"
          ).replace(/[^0-9]/g, ""),
          10
        ) || 0;


      return {

        id:
          trip.id ??
          trip._id ??
          `trip-${index}`,

        type:
          trip.type ||
          "Trip",

        name:
          trip.name ||
          trip.title ||
          trip.destination ||
          trip.location ||
          "Unknown Destination",

        location:
          trip.location ||
          trip.destination ||
          trip.title ||
          "Unknown Location",

        rating:
          Number(
            trip.rating ||
            trip.ratings ||
            4.5
          ),

        price,

        description:
          trip.description ||
          "Explore this beautiful destination and create your next travel experience.",

        category:
          trip.category ||
          (
            trip.type === "Destination"
              ? "Destinations"
              : "Trips"
          ),

        image:
          trip.image ||
          trip.thumbnail ||
          trip.photo ||
          "https://via.placeholder.com/900x500",

        budget: getBudgetForTrip({
          ...trip,
          price,
        }),

        tripData: trip,

        placeKey:
          trip.location ||
          trip.destination ||
          trip.name ||
          trip.title,

      };

    });

  }, [trips]);

  const curatedDestinations = useMemo(
    () =>
      destinations
        .filter((destination) => destination.name)
        .map((destination, index) => ({
          id: `destination-${destination.id ?? index}`,
          destinationId: destination.id,
          type: "Destination",
          name: destination.name,
          location: destination.country || destination.name,
          placeKey: destination.name,
          rating: null,
          price: null,
          description: `Discover ${destination.name} and plan your next travel experience.`,
          category: "Destinations",
          image:
            destination.image ||
            "https://via.placeholder.com/900x500",
          budget: getBudgetForTrip(destination),
          isCurated: true,
        })),
    [destinations]
  );


  const canonicalTrips = useMemo(() => {
    const uniqueMap = new Map();

    for (const item of [...formattedTrips, ...curatedDestinations]) {
      const anchor =
        item.placeKey ||
        item.name ||
        item.location ||
        "unknown-place";

      const key = String(anchor)
        .trim()
        .toLowerCase();

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          ...item,
          budget: getBudgetForTrip(item),
        });
      }
    }

    return [...uniqueMap.values()];
  }, [formattedTrips, curatedDestinations]);



  // ==========================================================
  // FILTER + SORT
  // ==========================================================

  const filteredResults = useMemo(() => {

    // --------------------------------------------------------
    // 1. FILTER BY BUDGET
    // --------------------------------------------------------

    const budgetResults =
      canonicalTrips.filter(
        (item) =>
          item.budget === safeBudget
      );


    // --------------------------------------------------------
    // 2. FILTER BY SIDEBAR SECTION
    // --------------------------------------------------------

    let sectionResults =
      budgetResults;


    if (section) {

      const sectionName =
        section.charAt(0).toUpperCase() +
        section.slice(1);


      sectionResults =
        budgetResults.filter(
          (item) =>
            item.category === sectionName
        );

    }


    // --------------------------------------------------------
    // 3. FILTER BY CATEGORY
    // --------------------------------------------------------

    const categoryResults =
      category === "All"
        ? sectionResults
        : sectionResults.filter(
            (item) =>
              item.category === category
          );


    // --------------------------------------------------------
    // 4. SORT
    // --------------------------------------------------------

    const sortedResults = [...categoryResults].sort(
      (a, b) => {

        if (sortBy === "price-low") {

          if (!Number.isFinite(a.price)) {
            return Number.isFinite(b.price) ? 1 : 0;
          }

          if (!Number.isFinite(b.price)) {
            return -1;
          }

          return a.price - b.price;

        }


        if (sortBy === "price-high") {

          if (!Number.isFinite(a.price)) {
            return Number.isFinite(b.price) ? 1 : 0;
          }

          if (!Number.isFinite(b.price)) {
            return -1;
          }

          return b.price - a.price;

        }


        if (sortBy === "rating") {

          if (!Number.isFinite(a.rating)) {
            return Number.isFinite(b.rating) ? 1 : 0;
          }

          if (!Number.isFinite(b.rating)) {
            return -1;
          }

          return b.rating - a.rating;

        }


        return a.name.localeCompare(
          b.name
        );

      }
    );


    return sortedResults;

  }, [
    canonicalTrips,
    safeBudget,
    category,
    sortBy,
    section,
  ]);



  // ==========================================================
  // PAGE TITLE
  // ==========================================================

  const title =
    budgetMeta[safeBudget]?.label ||
    "Travel Options";

  const budgetGradient =
    safeBudget === "premium"
      ? "from-pink-500 via-fuchsia-500 to-violet-500"
      : safeBudget === "high"
        ? "from-amber-400 via-orange-500 to-rose-500"
        : "from-cyan-400 via-blue-500 to-indigo-500";

  const budgetBadge =
    safeBudget === "premium"
      ? "Curated luxury"
      : safeBudget === "high"
        ? "Elevated stays"
        : "Smart value";



  // ==========================================================
  // RENDER
  // ==========================================================

  return (

    <div
      className={`
        budget-results-page
        budget-theme-${safeBudget}
        min-h-screen
        p-6
        text-white
      `}
    >

      <div
        className="
          mx-auto
          max-w-[1600px]
          overflow-hidden
          rounded-[36px]
          border
          border-white/10
          bg-[#020b1f]/90
          shadow-[0_40px_90px_rgba(2,12,31,0.8)]
          ring-1
          ring-white/5
        "
      >

        <div
          className="
            min-h-[calc(100vh-3rem)]
          "
        >

          {/* =================================================
              MAIN
          ================================================= */}

          <main
            className="
              w-full
              bg-[#020b1f]
              p-6
              lg:p-8
            "
          >

            <Navbar
              onNavigate={(path) =>
                navigateWithBudget(path)
              }
            />


            {/* =================================================
                BUDGET PANEL
            ================================================= */}

            <div
              className="
                budget-panel
                relative
                mt-8
                overflow-hidden
                rounded-[32px]
                border
                border-white/10
                bg-[#03162d]/90
                p-6
                shadow-[0_30px_80px_rgba(14,36,56,0.5)]
              "
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.02),transparent_55%)]" />

              <div className="relative z-10 mb-6 overflow-hidden rounded-[26px] border border-white/10 bg-slate-950/20 p-4 sm:p-5">
                <div className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r ${budgetGradient} opacity-25 blur-3xl`} />

                <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-cyan-300/90">
                      TravelHub Explore
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
                      {title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 backdrop-blur-sm">
                    <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${budgetGradient}`} />
                    {budgetBadge}
                  </div>
                </div>
              </div>

              {/* =================================================
                  CLOSE BUTTON
              ================================================= */}

              <button
                type="button"
                onClick={handleCloseBudget}
                aria-label="Close budget results"
                title="Close budget results"
                className="
                  absolute
                  right-5
                  top-5
                  z-10
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-red-400/50
                  bg-red-500
                  text-xl
                  font-bold
                  leading-none
                  text-white
                  shadow-lg
                  shadow-red-950/40
                  transition
                  hover:bg-red-600
                "
              >
                ×
              </button>


              {/* =================================================
                  HEADER
              ================================================= */}

              <div
                className="
                  relative
                  z-10
                  mb-6
                  flex
                  flex-col
                  gap-3
                  md:flex-row
                  md:items-end
                  md:justify-between
                "
              >

                <div>

                  <p
                    className="
                      text-xs
                      font-bold
                      uppercase
                      tracking-[0.28em]
                      text-cyan-300
                    "
                  >
                    TravelHub Explore
                  </p>

                  <h1
                    className="
                      mt-3
                      text-3xl
                      font-black
                      tracking-tight
                      text-white
                      md:text-4xl
                    "
                  >
                    {title}
                  </h1>

                  <p
                    className="
                      mt-2
                      text-sm
                      text-slate-300
                    "
                  >
                    {
                      budgetMeta[
                        safeBudget
                      ]?.description
                    }
                  </p>

                </div>


                {/* =================================================
                    BUDGET SWITCH
                ================================================= */}

                <div
                  className="
                    flex
                    flex-wrap
                    gap-2
                    pr-12
                  "
                >

                  {Object.keys(
                    budgetMeta
                  ).map((key) => (

                    <button
                      key={key}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/budget/${key}`
                        )
                      }
                      className={`
                        rounded-full
                        border
                        px-4
                        py-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        transition-all
                        duration-300

                        ${
                          safeBudget === key
                            ? `
                              border-white/15
                              bg-gradient-to-r ${
                                key === "premium"
                                  ? "from-pink-500 to-violet-500"
                                  : key === "high"
                                    ? "from-amber-400 to-orange-500"
                                    : "from-cyan-400 to-blue-500"
                              }
                              text-slate-950
                              shadow-lg
                              shadow-cyan-500/20
                            `
                            : `
                              border-white/10
                              bg-slate-900/70
                              text-slate-200
                              hover:bg-slate-800
                            `
                        }
                      `}
                    >

                      {key === "low"
                        ? "Low"
                        : key === "high"
                          ? "High"
                          : "Premium"}

                    </button>

                  ))}

                </div>

              </div>


              {/* =================================================
                  FILTER
              ================================================= */}

              <div
                className="
                  budget-filter
                  rounded-[24px]
                  border
                  border-white/10
                  bg-[#061a2d]
                  p-4
                "
              >

                <div
                  className="
                    mb-4
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.25em]
                    text-cyan-300
                  "
                >
                  Filter Results
                </div>


                <div
                  className="
                    flex
                    flex-col
                    gap-4
                    md:flex-row
                    md:items-center
                  "
                >

                  {/* CATEGORY */}

                  <label
                    className="
                      flex
                      flex-col
                      gap-2
                      text-sm
                      text-slate-300
                      md:w-56
                    "
                  >

                    <span>
                      Category
                    </span>

                    <select
                      value={category}
                      onChange={(event) =>
                        setCategory(
                          event.target.value
                        )
                      }
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-[#0b1f33]
                        px-3
                        py-3
                        text-sm
                        text-white
                        outline-none
                      "
                    >

                      {categoryOptions.map(
                        (option) => (

                          <option
                            key={option}
                            value={option}
                          >
                            {option}
                          </option>

                        )
                      )}

                    </select>

                  </label>


                  {/* SORT */}

                  <label
                    className="
                      flex
                      flex-col
                      gap-2
                      text-sm
                      text-slate-300
                      md:w-72
                    "
                  >

                    <span>
                      Sort
                    </span>

                    <select
                      value={sortBy}
                      onChange={(event) =>
                        setSortBy(
                          event.target.value
                        )
                      }
                      className="
                        rounded-xl
                        border
                        border-white/10
                        bg-[#0b1f33]
                        px-3
                        py-3
                        text-sm
                        text-white
                        outline-none
                      "
                    >

                      <option value="price-low">
                        Price: Low → High
                      </option>

                      <option value="price-high">
                        Price: High → Low
                      </option>

                      <option value="rating">
                        Rating
                      </option>

                    </select>

                  </label>

                </div>

              </div>


              {/* =================================================
                  LOADING
              ================================================= */}

              {loading && (

                <div
                  className="
                    mt-8
                    rounded-[24px]
                    border
                    border-white/10
                    bg-[#061a2d]
                    p-10
                    text-center
                    text-slate-300
                  "
                >
                  Loading trips...
                </div>

              )}


              {/* =================================================
                  ERROR
              ================================================= */}

              {!loading && error && (

                <div
                  className="
                    mt-8
                    rounded-[24px]
                    border
                    border-red-500/30
                    bg-red-500/10
                    p-10
                    text-center
                    text-red-300
                  "
                >
                  {error}
                </div>

              )}


              {/* =================================================
                  RESULT CARDS
              ================================================= */}

              {!loading &&
                !error && (

                  <div
                    className="
                      mt-6
                      grid
                      gap-5
                      md:grid-cols-2
                      xl:grid-cols-3
                    "
                  >

                    {filteredResults.map(
                      (item) => (

                        <article
                          key={item.id}
                          className="
                            budget-card
                            overflow-hidden
                            rounded-[26px]
                            border
                            border-white/10
                            bg-[#061a2d]/90
                            shadow-[0_20px_40px_rgba(10,20,38,0.35)]
                            transition
                            duration-300
                            hover:-translate-y-1
                            hover:border-cyan-400/40
                            hover:shadow-[0_24px_50px_rgba(34,211,238,0.12)]
                          "
                        >

                          {/* IMAGE */}

                          <div
                            className="
                              relative
                            "
                          >

                            <img
                              src={item.image}
                              alt={item.name}
                              className="
                                h-52
                                w-full
                                object-cover
                              "
                            />

                            <span
                              className="
                                absolute
                                left-3
                                top-3
                                rounded-full
                                bg-slate-900/70
                                px-2.5
                                py-1
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.2em]
                                text-cyan-300
                              "
                            >
                              {item.type}
                            </span>

                          </div>


                          {/* CONTENT */}

                          <div className="p-5">

                            <div
                              className="
                                flex
                                items-start
                                justify-between
                                gap-3
                              "
                            >

                              <div>

                                <h2
                                  className="
                                    text-xl
                                    font-bold
                                    text-white
                                  "
                                >
                                  {item.name}
                                </h2>

                                <p
                                  className="
                                    mt-1
                                    text-sm
                                    text-slate-300
                                  "
                                >
                                  {item.location}
                                </p>

                              </div>


                              {Number.isFinite(item.rating) && (
                                <div
                                  className="
                                    rounded-full
                                    bg-cyan-500/10
                                    px-2
                                    py-1
                                    text-xs
                                    font-bold
                                    text-cyan-300
                                  "
                                >
                                  ★{" "}
                                  {item.rating.toFixed(1)}
                                </div>
                              )}

                            </div>


                            <p
                              className="
                                mt-4
                                text-sm
                                leading-6
                                text-slate-300
                              "
                            >
                              {item.description}
                            </p>


                            {/* PRICE */}

                            <div
                              className="
                                mt-5
                                flex
                                items-center
                                justify-between
                                border-t
                                border-white/10
                                pt-4
                              "
                            >

                              <div>

                                <p
                                  className="
                                    text-[11px]
                                    uppercase
                                    tracking-[0.2em]
                                    text-slate-400
                                  "
                                >
                                  {item.isCurated ? "Destination" : "Price"}
                                </p>

                                <p
                                  className="
                                    mt-1
                                    text-xl
                                    font-black
                                    text-cyan-300
                                  "
                                >
                                  {item.isCurated
                                    ? item.location
                                    : `₹${item.price}`}
                                </p>

                              </div>


                              <button
                                type="button"
                                onClick={() => {
                                  if (item.isCurated) {
                                    navigate(
                                      item.destinationId
                                        ? `/destinations/${item.destinationId}`
                                        : `/destinations?search=${encodeURIComponent(item.name)}`
                                    );
                                    return;
                                  }

                                  navigate(`/trip/${item.id}`, {
                                    state: item.tripData || item,
                                  });
                                }}
                                className="
                                  rounded-xl
                                  bg-cyan-500
                                  px-4
                                  py-2
                                  text-sm
                                  font-bold
                                  text-slate-950
                                  transition
                                  hover:bg-cyan-400
                                "
                              >
                                {item.isCurated
                                  ? "Explore Destination"
                                  : "View Details"}
                              </button>

                            </div>

                          </div>

                        </article>

                      )
                    )}


                    {/* =================================================
                        NO RESULTS
                    ================================================= */}

                    {filteredResults.length === 0 && (

                      <div
                        className="
                          rounded-[24px]
                          border
                          border-dashed
                          border-slate-600
                          bg-[#061a2d]
                          p-10
                          text-center
                          text-slate-300
                          md:col-span-2
                          xl:col-span-3
                        "
                      >
                        No trips found for
                        this budget and filter.
                      </div>

                    )}

                  </div>

                )}

            </div>

          </main>

        </div>

      </div>

    </div>
  );
}