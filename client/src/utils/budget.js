// ============================================================
// BUDGET TIERS
// ============================================================

export const budgetTiers = [
  "low",
  "high",
  "premium",
];


const destinationBudgetMap = {
  low: [
    "marrakesh",
    "marrakech",
    "morocco",
    "bali",
    "indonesia",
    "india",
    "thailand",
    "vietnam",
    "nepal",
    "turkey",
    "mexico",
    "philippines",
    "goa",
    "hanoi",
    "chiang mai",
    "krabi",
  ],

  high: [
    "france",
    "paris",
    "italy",
    "japan",
    "tokyo",
    "seoul",
    "oslo",
    "south korea",
    "united states",
    "united states of america",
    "america",
    "usa",
    "us",
    "canada",
    "spain",
    "australia",
    "greece",
    "united kingdom",
    "germany",
    "norway",
    "golconda",
    "hampi",
    "oslo",
    "norway",
  ],

  premium: [
    "maldives",
    "switzerland",
    "dubai",
    "uae",
    "seychelles",
    "iceland",
    "french polynesia",
    "monaco",
    "bahrain",
    "santorini",
    "bora bora",
  ],
};


function normalizeText(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}


function findKnownBudgetForLocation(value) {
  const normalized = normalizeText(value);
  if (!normalized) {
    return null;
  }

  for (const budget of budgetTiers) {
    if (
      destinationBudgetMap[budget].some(
        (item) => new RegExp(`\\b${item}\\b`).test(normalized)
      )
    ) {
      return budget;
    }
  }

  return null;
}


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
    "United States of America",
    "America",
    "USA",
    "US",
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
    normalizeText(country);

  const match =
    budgetTiers.find((budget) =>
      countriesByBudget[budget].some(
        (item) =>
          normalizeText(item) ===
          normalizedCountry
      )
    );

  if (match) {
    return match;
  }

  return findKnownBudgetForLocation(country) || "low";
}


// ============================================================
// GET BUDGET FOR TRIP
// ============================================================

export function getBudgetForTrip(trip) {
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

  const destinationFields = [
    trip?.city,
    trip?.place,
    trip?.location,
    trip?.destination,
    trip?.name,
    trip?.title,
  ];

  for (const field of destinationFields) {
    const matchedBudget = findKnownBudgetForLocation(field);
    if (matchedBudget) {
      return matchedBudget;
    }
  }

  const countryBudget =
    findKnownBudgetForLocation(trip?.country);

  if (countryBudget) {
    return countryBudget;
  }

  const price =
    Number.parseInt(
      String(
        trip?.price ??
        trip?.amount ??
        trip?.cost ??
        "0"
      ).replace(/[^0-9]/g, ""),
      10
    );

  if (price > 0) {
    if (price < 1000) {
      return "low";
    }

    if (price < 7000) {
      return "high";
    }

    return "premium";
  }

  return "low";
}