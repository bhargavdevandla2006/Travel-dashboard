const highlightsByRegion = {
  "united states": [
    "Statue of Liberty",
    "Grand Canyon",
    "Yellowstone National Park",
    "Golden Gate Bridge",
    "Times Square",
    "White House",
    "Yosemite National Park",
    "Niagara Falls",
  ],
  america: [
    "Statue of Liberty",
    "Grand Canyon",
    "Yellowstone National Park",
    "Golden Gate Bridge",
    "Times Square",
    "White House",
    "Yosemite National Park",
    "Niagara Falls",
  ],
  usa: [
    "Statue of Liberty",
    "Grand Canyon",
    "Yellowstone National Park",
    "Golden Gate Bridge",
    "Times Square",
    "White House",
    "Yosemite National Park",
    "Niagara Falls",
  ],
  "united states of america": [
    "Statue of Liberty",
    "Grand Canyon",
    "Yellowstone National Park",
    "Golden Gate Bridge",
    "Times Square",
    "White House",
    "Yosemite National Park",
    "Niagara Falls",
  ],
  france: [
    "Eiffel Tower",
    "Louvre",
    "Palace of Versailles",
    "Mont-Saint-Michel",
    "Arc de Triomphe",
    "French Riviera",
  ],
  japan: [
    "Mount Fuji",
    "Fushimi Inari-taisha",
    "Tokyo Tower",
    "Kinkaku-ji",
    "Hiroshima Peace Memorial",
    "Osaka Castle",
  ],
  india: [
    "Taj Mahal",
    "Jaipur City Palace",
    "Gateway of India",
    "Kerala backwaters",
    "Qutb Minar",
    "Hawa Mahal",
  ],
  italy: [
    "Colosseum",
    "Grand Canal",
    "Leaning Tower of Pisa",
    "Pompeii",
    "Trevi Fountain",
    "Florence Cathedral",
  ],
  spain: [
    "Sagrada Família",
    "Alhambra",
    "Park Güell",
    "Royal Palace of Madrid",
    "Plaza de España",
  ],
  canada: [
    "Banff National Park",
    "CN Tower",
    "Niagara Falls",
    "Old Quebec",
    "Jasper National Park",
  ],
  australia: [
    "Sydney Opera House",
    "Great Barrier Reef",
    "Uluru",
    "Sydney Harbour Bridge",
    "Great Ocean Road",
  ],
  "united kingdom": [
    "Big Ben",
    "Tower of London",
    "Stonehenge",
    "Buckingham Palace",
    "Edinburgh Castle",
  ],
  thailand: [
    "Grand Palace",
    "Wat Arun",
    "Wat Phra That Doi Suthep",
    "Phi Phi Islands",
    "Ayutthaya Historical Park",
  ],
  indonesia: [
    "Borobudur",
    "Prambanan",
    "Uluwatu Temple",
    "Mount Bromo",
    "Komodo National Park",
  ],
  mexico: [
    "Chichen Itza",
    "Teotihuacan",
    "Tulum",
    "Palacio de Bellas Artes",
    "Copper Canyon",
  ],
  germany: [
    "Brandenburg Gate",
    "Neuschwanstein Castle",
    "Cologne Cathedral",
    "Berlin Wall",
    "Black Forest",
  ],
  greece: [
    "Acropolis of Athens",
    "Parthenon",
    "Meteora",
    "Palace of Knossos",
    "Navagio Beach",
  ],
  "united arab emirates": [
    "Burj Khalifa",
    "Sheikh Zayed Grand Mosque",
    "Louvre Abu Dhabi",
    "Palm Jumeirah",
    "Dubai Mall",
  ],
  uae: [
    "Burj Khalifa",
    "Sheikh Zayed Grand Mosque",
    "Louvre Abu Dhabi",
    "Palm Jumeirah",
    "Dubai Mall",
  ],
  dubai: [
    "Burj Khalifa",
    "Dubai Mall",
    "Palm Jumeirah",
    "Burj Al Arab",
    "Dubai Fountain",
    "Museum of the Future",
    "Dubai Marina",
    "Dubai Frame",
  ],
  nepal: [
    "Mount Everest",
    "Boudhanath",
    "Pashupatinath Temple",
    "Pokhara",
    "Chitwan National Park",
  ],
  switzerland: [
    "Matterhorn",
    "Jungfraujoch",
    "Chapel Bridge",
    "Lake Geneva",
    "Chillon Castle",
  ],
  telangana: [
    "Charminar",
    "Golconda Fort",
    "Ramappa Temple",
    "Thousand Pillar Temple",
    "Warangal Fort",
    "Bhongir Fort",
    "Yadadri Temple",
    "Nagarjuna Sagar Dam",
    "Bogatha Falls",
    "Laknavaram Lake",
    "Medak Cathedral",
    "Basara Saraswathi Temple",
  ],
};

const highlightsByState = {
  arizona: ["Grand Canyon", "Antelope Canyon", "Monument Valley"],
  california: ["Golden Gate Bridge", "Yosemite National Park", "Alcatraz Island", "Hollywood Sign"],
  florida: ["Walt Disney World", "Everglades National Park", "South Beach"],
  hawaii: ["Hawaiʻi Volcanoes National Park", "Waikiki", "Nā Pali Coast"],
  "new york": ["Statue of Liberty", "Times Square", "Central Park", "Empire State Building"],
  texas: ["The Alamo", "Big Bend National Park", "San Antonio River Walk"],
};

export function getRegionalHighlights(region) {
  const normalized = String(region || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  return highlightsByRegion[normalized] || highlightsByState[normalized] || [];
}

export function isSpecificTouristPlace(title, region) {
  const normalizedTitle = String(title || "").trim();
  const normalizedRegion = String(region || "").trim().toLowerCase();
  if (
    normalizedTitle.length < 3 ||
    normalizedTitle.toLowerCase() === normalizedRegion ||
    /^tourist attractions?$/i.test(normalizedTitle) ||
    /^(list of|tourism in|tourist attraction(s)? in|landmarks? in|category:)/i.test(normalizedTitle) ||
    /\b(tourist attractions|tourism|landmarks|list of|in the united states|carriage)\b/i.test(normalizedTitle) ||
    /^(economy|culture|demographics|history|politics|geography|transport|education|health|media|sports|outline) of\b/i.test(normalizedTitle) ||
    /^\d+\s+in\b/i.test(normalizedTitle) ||
    /\([^)]*,[^)]*\)/.test(normalizedTitle) ||
    (/\bpass$/i.test(normalizedTitle) &&
      !normalizedTitle.toLocaleLowerCase().includes(normalizedRegion) &&
      !/^khyber pass$/i.test(normalizedTitle)) ||
    /\b(expressway|highway|railway station|district|election|politician|population)\b/i.test(normalizedTitle)
  ) {
    return false;
  }

  return true;
}
