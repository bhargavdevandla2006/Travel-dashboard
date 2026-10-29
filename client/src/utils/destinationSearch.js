function normalizeSearchText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function isCloseMatch(first, second) {
  if (first === second) return true;
  if (Math.abs(first.length - second.length) > 1) return false;

  let firstIndex = 0;
  let secondIndex = 0;
  let edits = 0;

  while (firstIndex < first.length && secondIndex < second.length) {
    if (first[firstIndex] === second[secondIndex]) {
      firstIndex += 1;
      secondIndex += 1;
      continue;
    }

    edits += 1;
    if (edits > 1) return false;

    if (first.length > second.length) {
      firstIndex += 1;
    } else if (second.length > first.length) {
      secondIndex += 1;
    } else {
      firstIndex += 1;
      secondIndex += 1;
    }
  }

  return edits + Number(firstIndex < first.length || secondIndex < second.length) <= 1;
}

export function matchesDestinationSearch(place, query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const placeWords = normalizeSearchText(
    `${place.name || ""} ${place.country || ""}`
  ).split(" ");

  if (placeWords.join(" ").includes(normalizedQuery)) return true;
  if (normalizedQuery.length < 4) return false;

  return normalizedQuery.split(" ").every((queryWord) =>
    placeWords.some(
      (placeWord) =>
        placeWord.includes(queryWord) ||
        (queryWord.length >= 4 && isCloseMatch(placeWord, queryWord))
    )
  );
}
