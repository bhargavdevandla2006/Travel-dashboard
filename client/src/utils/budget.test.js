import test from "node:test";
import assert from "node:assert/strict";

import { getBudgetForCountry, getBudgetForTrip } from "./budget.js";

test("country mapping resolves to one budget tier", () => {
  assert.equal(getBudgetForCountry("Morocco"), "low");
  assert.equal(getBudgetForCountry("France"), "high");
  assert.equal(getBudgetForCountry("Maldives"), "premium");
});

test("pictured destinations have one stable tier", () => {
  assert.equal(getBudgetForCountry("Marrakesh"), "low");
  assert.equal(getBudgetForCountry("Seoul"), "high");
  assert.equal(getBudgetForCountry("Oslo"), "high");
  assert.equal(getBudgetForCountry("Golconda"), "high");
  assert.equal(getBudgetForCountry("Hampi"), "high");
  assert.equal(getBudgetForCountry("Bali"), "low");
});

test("price thresholds assign trips to exactly one tier", () => {
  assert.equal(getBudgetForTrip({ name: "Unknown place", price: 999 }), "low");
  assert.equal(getBudgetForTrip({ name: "Unknown place", price: 1000 }), "high");
  assert.equal(getBudgetForTrip({ name: "Unknown place", price: 6999 }), "high");
  assert.equal(getBudgetForTrip({ name: "Unknown place", price: 7000 }), "premium");
  assert.equal(getBudgetForTrip({ name: "Unknown place", price: 100001 }), "premium");
});

test("known destination determines tier and unknown places use trip price", () => {
  assert.equal(
    getBudgetForTrip({
      name: "Marrakech",
      location: "Marrakech",
      country: "Morocco",
      price: 7000,
    }),
    "low"
  );

  assert.equal(
    getBudgetForTrip({
      name: "Paris",
      location: "Paris",
      country: "France",
      price: 900,
    }),
    "high"
  );

  assert.equal(
    getBudgetForTrip({
      name: "Maldives",
      location: "Maldives",
      country: "Maldives",
      price: 1200,
    }),
    "premium"
  );

  assert.equal(
    getBudgetForTrip({
      name: "Dubai",
      country: "UAE",
      price: 700,
    }),
    "premium"
  );

  assert.equal(
    getBudgetForTrip({
      name: "Seoul",
      country: "Unknown",
      price: 7000,
    }),
    "high"
  );

  assert.equal(
    getBudgetForTrip({
      name: "Dubai",
      country: "Explore",
    }),
    "premium"
  );

  assert.equal(
    getBudgetForTrip({
      title: "Paris",
      location: "Bali",
      price: 5000,
    }),
    "low"
  );
});

test("America resolves to the United States high-cost tier", () => {
  assert.equal(getBudgetForCountry("America"), "high");
  assert.equal(getBudgetForCountry("United States of America"), "high");
});

test("explicit trip budget takes priority over destination defaults", () => {
  assert.equal(
    getBudgetForTrip({
      name: "Bali",
      budget: "premium",
      price: 700,
    }),
    "premium"
  );
});
