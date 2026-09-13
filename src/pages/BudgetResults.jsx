import { useEffect, useMemo, useState } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  getTrips,
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

        const data = await getTrips();

        console.log(
          "Trips received from API:",
          data
        );


        if (Array.isArray(data)) {

          setTrips(data);

        } else {

          setTrips([]);

        }

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

      } finally {

        setLoading(false);

      }
    }


    loadTrips();

  }, []);



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
        Number(
          trip.price ||
          trip.amount ||
          trip.cost ||
          0
        );


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

        budget:
          trip.budget ||
          getBudgetForTrip({
            ...trip,
            price,
          }),

      };

    });

  }, [trips]);



  // ==========================================================
  // FILTER + SORT
  // ==========================================================

  const filteredResults = useMemo(() => {

    // --------------------------------------------------------
    // 1. FILTER BY BUDGET
    // --------------------------------------------------------

    const budgetResults =
      formattedTrips.filter(
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

    return [...categoryResults].sort(
      (a, b) => {

        if (sortBy === "price-low") {

          return a.price - b.price;

        }


        if (sortBy === "price-high") {

          return b.price - a.price;

        }


        if (sortBy === "rating") {

          return b.rating - a.rating;

        }


        return a.name.localeCompare(
          b.name
        );

      }
    );

  }, [
    formattedTrips,
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
          bg-[#020b1f]
          shadow-[0_40px_90px_rgba(2,12,31,0.8)]
        "
      >

        <div
          className="
            flex
            min-h-[calc(100vh-3rem)]
            flex-col
            xl:flex-row
          "
        >

          {/* =================================================
              SIDEBAR
          ================================================= */}

          <Sidebar
            onNavigate={(path) =>
              navigateWithBudget(path)
            }
          />


          {/* =================================================
              MAIN
          ================================================= */}

          <main
            className="
              flex-1
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
                rounded-[30px]
                border
                border-white/10
                bg-[#03162d]
                p-6
                shadow-[0_30px_80px_rgba(14,36,56,0.5)]
              "
            >

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
                        px-4
                        py-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.18em]
                        transition

                        ${
                          safeBudget === key
                            ? `
                              bg-cyan-500
                              text-slate-950
                            `
                            : `
                              bg-slate-800
                              text-slate-200
                              hover:bg-slate-700
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
                            bg-[#061a2d]
                            shadow-[0_20px_40px_rgba(10,20,38,0.35)]
                            transition
                            duration-300
                            hover:-translate-y-1
                            hover:border-cyan-400/40
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
                                  Price
                                </p>

                                <p
                                  className="
                                    mt-1
                                    text-xl
                                    font-black
                                    text-cyan-300
                                  "
                                >
                                  ₹{item.price}
                                </p>

                              </div>


                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/budget/${safeBudget}`
                                  )
                                }
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
                                View Details
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