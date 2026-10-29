import test from "node:test";
import assert from "node:assert/strict";

import { matchesDestinationSearch } from "./destinationSearch.js";

test("destination search tolerates a one-character typo", () => {
  assert.equal(
    matchesDestinationSearch({ name: "Dubai", country: "UAE" }, "debai"),
    true
  );
});

test("destination search still filters unrelated places", () => {
  assert.equal(
    matchesDestinationSearch({ name: "Dubai", country: "UAE" }, "paris"),
    false
  );
});
