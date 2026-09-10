import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  setActiveBudget,
  clearActiveBudget,
} from "../utils/budget";


// ============================================================
// TRAVEL DATA
// ============================================================

const travelData = [
  {
    id: 1,
    type: "Trip",
    name: "Bali Escape",
    location: "Bali, Indonesia",
    rating: 4.7,
    price: 850,
    description:
      "Beach stays, temple tours, and laid-back island vibes.",
    category: "Trips",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80",
    budget: "low",
  },

  {
    id: 2,
    type: "Destination",
    name: "Kerala Backwaters",
    location: "Kochi, India",
    rating: 4.5,
    price: 620,
    description:
      "Nature trails, houseboats, and scenic village stays.",
    category: "Destinations",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
    budget: "low",
  },

  {
    id: 3,
    type: "Hotel",
    name: "Cove Stay",
    location: "Goa, India",
    rating: 4.4,
    price: 1100,
    description:
      "Modern rooms with breakfast and beach access.",
    category: "Hotels",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
    budget: "low",
  },

  {
    id: 4,
    type: "Room",
    name: "Budget Studio Cabin",
    location: "Hanoi, Vietnam",
    rating: 4.3,
    price: 450,
    description:
      "Compact, clean and centrally located for city explorers.",
    category: "Rooms",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    budget: "low",
  },

  {
    id: 5,
    type: "Activity",
    name: "Island Snorkeling",
    location: "Phuket, Thailand",
    rating: 4.6,
    price: 990,
    description:
      "A short guided snorkeling experience with reef spotting.",
    category: "Activities",
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80",
    budget: "low",
  },

  {
    id: 6,
    type: "Trip",
    name: "Swiss Alps Retreat",
    location: "Interlaken, Switzerland",
    rating: 4.9,
    price: 2400,
    description:
      "Mountain train rides, luxury lodges, and alpine views.",
    category: "Trips",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
    budget: "high",
  },

  {
    id: 7,
    type: "Destination",
    name: "Santorini Coast",
    location: "Greece",
    rating: 4.8,
    price: 3200,
    description:
      "Whitewashed villages, sunset terraces and cliffside stays.",
    category: "Destinations",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
    budget: "high",
  },

  {
    id: 8,
    type: "Hotel",
    name: "Azure Horizon Hotel",
    location: "Dubai, UAE",
    rating: 4.9,
    price: 4100,
    description:
      "Designer suites and panoramic city views.",
    category: "Hotels",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=900&q=80",
    budget: "high",
  },

  {
    id: 9,
    type: "Room",
    name: "Skyline Executive Suite",
    location: "Tokyo, Japan",
    rating: 4.8,
    price: 2800,
    description:
      "Premium room with city skyline and concierge access.",
    category: "Rooms",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    budget: "high",
  },

  {
    id: 10,
    type: "Activity",
    name: "Private Yacht Ride",
    location: "Maldives",
    rating: 5.0,
    price: 5000,
    description:
      "Sunset cruise with dinner and premium island stops.",
    category: "Activities",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    budget: "high",
  },

  {
    id: 11,
    type: "Trip",
    name: "Bespoke Luxury Maldives",
    location: "Maldives",
    rating: 5.0,
    price: 7800,
    description:
      "Overwater villa, spa rituals and private transfers.",
    category: "Trips",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80",
    budget: "premium",
  },

  {
    id: 12,
    type: "Destination",
    name: "Bora Bora Bliss",
    location: "French Polynesia",
    rating: 5.0,
    price: 9200,
    description:
      "Lagoon villas, crystal waters, and private island experiences.",
    category: "Destinations",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=900&q=80",
    budget: "premium",
  },

  {
    id: 13,
    type: "Hotel",
    name: "The Crown Grand",
    location: "Paris, France",
    rating: 5.0,
    price: 10500,
    description:
      "Luxury suites, rooftop dining, and concierge-led stays.",
    category: "Hotels",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=900&q=80",
    budget: "premium",
  },

  {
    id: 14,
    type: "Room",
    name: "Presidential Ocean Suite",
    location: "Bali, Indonesia",
    rating: 4.9,
    price: 6800,
    description:
      "Private pool villa suite with premium amenities.",
    category: "Rooms",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    budget: "premium",
  },

  {
    id: 15,
    type: "Activity",
    name: "Private Helicopter Tour",
    location: "Aspen, USA",
    rating: 5.0,
    price: 8600,
    description:
      "A premium aerial journey over alpine scenery.",
    category: "Activities",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80",
    budget: "premium",
  },
];


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

  const [category, setCategory] = useState("All");

  const [sortBy, setSortBy] =
    useState("price-low");


  // ==========================================================
  // VALIDATE BUDGET
  // ==========================================================

  const safeBudget =
    budget &&
    ["low", "high", "premium"].includes(budget)
      ? budget
      : "low";


  // ==========================================================
  // SAVE ACTIVE BUDGET
  // ==========================================================

  useEffect(() => {
    setActiveBudget(safeBudget);
  }, [safeBudget]);


  // ==========================================================
  // NAVIGATION
  // ==========================================================
  //
  // IMPORTANT:
  //
  // We keep the budget in the URL.
  //
  // LOW:
  // /trips?budget=low
  //
  // HIGH:
  // /trips?budget=high
  //
  // PREMIUM:
  // /trips?budget=premium
  //
  // So the next page knows which budget is active.
  //
  // ==========================================================

  function navigateWithBudget(path) {
    navigate(
      `${path}?budget=${safeBudget}`
    );
  }


  // ==========================================================
  // CLOSE BUDGET PAGE
  // ==========================================================
  //
  // ONLY X clears the active budget.
  //
  // ==========================================================

  function handleCloseBudget() {
    clearActiveBudget();

    navigate("/");
  }


  // ==========================================================
  // FILTER RESULTS
  // ==========================================================

  const filteredResults = useMemo(() => {

    // First filter by budget
    const items = travelData.filter(
      (item) =>
        item.budget === safeBudget
    );


    // Then filter by category
    const byCategory =
      category === "All"
        ? items
        : items.filter(
            (item) =>
              item.category === category
          );


    // Sort
    return [...byCategory].sort(
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
    category,
    safeBudget,
    sortBy,
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
                  X BUTTON
                  ================================================= */}

              <button
                type="button"
                onClick={
                  handleCloseBudget
                }
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
                  hover:shadow-red-500/30
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
                              shadow-[0_0_0_1px_rgba(34,211,238,0.4)]
                            `
                            : `
                              bg-slate-800
                              text-slate-200
                              hover:bg-slate-700
                            `
                        }
                      `}
                    >

                      {
                        key === "low"
                          ? "Low"
                          : key === "high"
                            ? "High"
                            : "Premium"
                      }

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
                  RESULT CARDS
                  ================================================= */}

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
                    No results found for
                    this budget and filter
                    set.
                  </div>

                )}

              </div>

            </div>

          </main>

        </div>

      </div>

    </div>
  );
}