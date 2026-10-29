import test from "node:test";
import assert from "node:assert/strict";

import {
  getRegionalHighlights,
  isSpecificTouristPlace,
} from "./regionalHighlights.js";

test("America returns real United States landmarks", () => {
  assert.deepEqual(getRegionalHighlights("America").slice(0, 3), [
    "Statue of Liberty",
    "Grand Canyon",
    "Yellowstone National Park",
  ]);
});

test("region lookup includes known countries and states", () => {
  assert.ok(getRegionalHighlights("Japan").includes("Mount Fuji"));
  assert.ok(getRegionalHighlights("California").includes("Alcatraz Island"));
  assert.ok(getRegionalHighlights("Telangana").includes("Charminar"));
  assert.ok(getRegionalHighlights("Telangana").includes("Ramappa Temple"));
});

test("generic Wikipedia overview and list pages are not destinations", () => {
  assert.equal(
    isSpecificTouristPlace("Tourist attractions in the United States", "United States"),
    false
  );
  assert.equal(isSpecificTouristPlace("Tourist attraction", "America"), false);
  assert.equal(isSpecificTouristPlace("Lists of tourist attractions", "America"), false);
  assert.equal(isSpecificTouristPlace("Economy of Telangana", "Telangana"), false);
  assert.equal(isSpecificTouristPlace("Hyderabad–Indore Expressway", "Telangana"), false);
  assert.equal(isSpecificTouristPlace("Cultural tourism", "Paris"), false);
  assert.equal(isSpecificTouristPlace("Eiffel Tower (Paris, Tennessee)", "Paris"), false);
  assert.equal(isSpecificTouristPlace("London Pass", "Paris"), false);
});

test("specific places remain valid destination results", () => {
  assert.equal(isSpecificTouristPlace("Statue of Liberty", "United States"), true);
  assert.equal(isSpecificTouristPlace("Mount Fuji", "Japan"), true);
  assert.equal(isSpecificTouristPlace("Khyber Pass", "Pakistan"), true);
});
