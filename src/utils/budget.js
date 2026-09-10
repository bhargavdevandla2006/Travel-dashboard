// ============================================================
// BUDGET TIERS
// ============================================================

export const budgetTiers = [
  "low",
  "high",
  "premium",
];


// ============================================================
// COUNTRIES BY BUDGET
// ============================================================

const countriesByBudget = {
  low: [
    "India",
    "Thailand",
    "Vietnam",
    "Indonesia",
    "Nepal",
    "Turkey",
    "Mexico",
    "Morocco",
    "Philippines",
    "Bali",
  ],

  high: [
    "France",
    "Italy",
    "Japan",
    "United States",
    "Canada",
    "Spain",
    "Australia",
    "Greece",
    "United Kingdom",
    "Germany",
  ],

  premium: [
    "Maldives",
    "Switzerland",
    "Bora Bora",
    "Dubai",
    "Seychelles",
    "Iceland",
    "French Polynesia",
    "Monaco",
    "Bahrain",
    "Santorini",
  ],
};


// ============================================================
// GET ACTIVE BUDGET
// ============================================================

export function getActiveBudget() {
  if (typeof window === "undefined") {
    return "low";
  }

  const savedBudget =
    localStorage.getItem("travelhub-budget");

  return budgetTiers.includes(savedBudget)
    ? savedBudget
    : "low";
}


// ============================================================
// SET ACTIVE BUDGET
// ============================================================

export function setActiveBudget(budget) {
  if (!budgetTiers.includes(budget)) {
    return;
  }

  localStorage.setItem(
    "travelhub-budget",
    budget
  );

  localStorage.setItem(
    "travelhub-premium-tier",
    budget
  );

  // Tell other components that budget changed
  window.dispatchEvent(
    new Event("travelhub-budget-change")
  );
}


// ============================================================
// CLEAR ACTIVE BUDGET
// ============================================================
//
// This is used ONLY when the user clicks X
// on the Low / High / Premium page.
//
// After this:
// localStorage no longer contains the selected budget.
//
// So:
//
// /budget/low
//      ↓ X
// /
//      ↓
// /trips
//
// will show normal/all trips.
//

export function clearActiveBudget() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    "travelhub-budget"
  );

  localStorage.removeItem(
    "travelhub-premium-tier"
  );

  // Tell other components that budget was cleared
  window.dispatchEvent(
    new Event("travelhub-budget-change")
  );
}


// ============================================================
// GET BUDGET FOR COUNTRY
// ============================================================

export function getBudgetForCountry(country) {

  const normalizedCountry =
    String(country || "")
      .trim()
      .toLowerCase();

  const match =
    budgetTiers.find((budget) =>
      countriesByBudget[budget].some(
        (item) =>
          item.toLowerCase() ===
          normalizedCountry
      )
    );

  return match || "low";
}


// ============================================================
// GET BUDGET FOR TRIP
// ============================================================

export function getBudgetForTrip(trip) {

  // ----------------------------------------------------------
  // 1. If trip already has a budget
  // ----------------------------------------------------------

  if (
    trip?.budget &&
    budgetTiers.includes(
      String(trip.budget).toLowerCase()
    )
  ) {
    return String(
      trip.budget
    ).toLowerCase();
  }


  // ----------------------------------------------------------
  // 2. Get budget from price
  // ----------------------------------------------------------

  const price =
    Number.parseInt(
      String(
        trip?.price || "0"
      ).replace(
        /[^0-9]/g,
        ""
      ),
      10
    );


  if (price > 0) {

    // Premium
    if (price >= 6000) {
      return "premium";
    }

    // High
    if (price >= 1500) {
      return "high";
    }

    // Low
    return "low";
  }


  // ----------------------------------------------------------
  // 3. If there is no price,
  //    determine from location/country
  // ----------------------------------------------------------

  return getBudgetForCountry(
    trip?.location ||
    trip?.country
  );
}