const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

/* =========================================================
   GET USER LOCATION
========================================================= */

export function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  });
}

/* =========================================================
   OPENSTREETMAP FALLBACK
========================================================= */

async function fetchFallbackPlaces(query, latitude, longitude) {
  const delta = 0.05;

  const viewbox =
    `${longitude - delta},${latitude + delta},` +
    `${longitude + delta},${latitude - delta}`;

  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?format=json` +
    `&limit=15` +
    `&q=${encodeURIComponent(query)}` +
    `&viewbox=${viewbox}` +
    `&bounded=1`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    return data.map((item) => ({
      place_id: item.place_id?.toString(),

      name:
        item.display_name?.split(",")[0] ||
        "Hotel",

      vicinity:
        item.display_name ||
        "Address unavailable",

      rating: null,

      user_ratings_total: 0,

      /*
         Images are handled by Unsplash.
         We intentionally do not use Google photos here.
      */

      photoUrl: null,

      image: null,

      photo: null,

      photos: [],

      photoAttributions: [],

      geometry: {
        location: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon),
        },
      },
    }));
  } catch (error) {
    console.error(
      "OpenStreetMap fallback error:",
      error
    );

    return [];
  }
}

/* =========================================================
   GET NEARBY HOTELS
========================================================= */

export async function getNearbyPlaces(type, coords) {
  let latitude;
  let longitude;

  /* =======================================================
     USE PROVIDED COORDINATES
  ======================================================= */

  if (
    coords &&
    typeof coords.lat === "number" &&
    typeof coords.lng === "number"
  ) {
    latitude = coords.lat;
    longitude = coords.lng;
  } else {
    /* =====================================================
       GET CURRENT LOCATION
    ===================================================== */

    try {
      const position = await getLocation();

      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
    } catch (error) {
      console.error(
        "Unable to get current location:",
        error
      );

      throw new Error(
        "Unable to get your location.",
        { cause: error }
      );
    }
  }

  /* =======================================================
     GOOGLE NEARBY SEARCH
  ======================================================= */

  const url =
    "https://places.googleapis.com/v1/places:searchNearby";

  let googleType = type;

  if (type === "lodging") {
    googleType = "lodging";
  }

  if (type === "taxi_stand") {
    googleType = "taxi_stand";
  }

  const requestBody = {
    includedTypes: [
      googleType,
    ],

    maxResultCount: 15,

    locationRestriction: {
      circle: {
        center: {
          latitude,
          longitude,
        },

        radius: 5000,
      },
    },

    rankPreference: "POPULARITY",
  };

  try {
    console.log(
      "📍 Searching Google hotels near:",
      latitude,
      longitude
    );

    /* =====================================================
       FIELD MASK

       IMPORTANT:
       We still request places.photos here because Nearby
       Search can provide them, but we DO NOT perform any
       extra Text Search requests.

       Unsplash is responsible for final hotel images.
    ===================================================== */

    const fieldMask = [
      "places.id",
      "places.name",
      "places.displayName",
      "places.formattedAddress",
      "places.location",
      "places.rating",
      "places.userRatingCount",
      "places.photos",
      "places.types",
    ].join(",");

    /* =====================================================
       GOOGLE REQUEST
    ===================================================== */

    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        "X-Goog-Api-Key":
          API_KEY,

        "X-Goog-FieldMask":
          fieldMask,
      },

      body: JSON.stringify(
        requestBody
      ),
    });

    /* =====================================================
       HANDLE GOOGLE ERROR
    ===================================================== */

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "❌ Google Places API error:",
        response.status,
        errorText
      );

      throw new Error(
        `Google Places API error: ${response.status}`
      );
    }

    /* =====================================================
       GOOGLE RESPONSE
    ===================================================== */

    const data =
      await response.json();

    console.log(
      "🔥 COMPLETE GOOGLE RESPONSE:",
      data
    );

    /* =====================================================
       FIRST HOTEL DEBUG
    ===================================================== */

    console.log(
      "🔍 FIRST HOTEL FULL DATA:",
      JSON.stringify(
        data.places?.[0],
        null,
        2
      )
    );

    const googleResults =
      data.places || [];

    console.log(
      "🏨 Google hotels found:",
      googleResults.length
    );

    /* =====================================================
       CREATE HOTEL DATA
    ===================================================== */

    const hotels =
      googleResults.map(
        (place, index) => {

          /* ---------------------------------------------
             HOTEL NAME
          --------------------------------------------- */

          const name =
            place.displayName?.text ||
            "Hotel";

          /* ---------------------------------------------
             ADDRESS
          --------------------------------------------- */

          const vicinity =
            place.formattedAddress ||
            "Address unavailable";

          /* ---------------------------------------------
             RATING
          --------------------------------------------- */

          const rating =
            typeof place.rating ===
            "number"
              ? place.rating
              : null;

          /* ---------------------------------------------
             TOTAL RATINGS
          --------------------------------------------- */

          const userRatingsTotal =
            typeof place.userRatingCount ===
            "number"
              ? place.userRatingCount
              : 0;

          /* ---------------------------------------------
             LOCATION
          --------------------------------------------- */

          const lat =
            place.location?.latitude;

          const lng =
            place.location?.longitude;

          /* ---------------------------------------------
             GOOGLE PHOTOS

             We are NOT using these as the final image.

             Unsplash handles hotel images in Hotel.jsx.
          --------------------------------------------- */

          const googlePhotos =
            Array.isArray(place.photos)
              ? place.photos
              : [];

          /* ---------------------------------------------
             DEBUG
          --------------------------------------------- */

          console.log(
            `🏨 Hotel ${index + 1}:`,
            name
          );

          console.log(
            "⭐ Rating:",
            rating
          );

          console.log(
            "📸 Google photos available:",
            googlePhotos.length
          );

          console.log(
            "🖼️ Image source: Unsplash"
          );

          /* ---------------------------------------------
             RETURN HOTEL
          --------------------------------------------- */

          return {
            place_id:
              place.id,

            id:
              place.id,

            name,

            vicinity,

            rating,

            user_ratings_total:
              userRatingsTotal,

            /*
               IMPORTANT:
               Keep these null/empty.

               Hotel.jsx will replace them with
               Unsplash images.
            */

            photoUrl: null,

            image: null,

            photo: null,

            photos: [],

            photoAttributions: [],

            types:
              place.types || [],

            geometry: {
              location: {
                lat,
                lng,
              },
            },
          };
        }
      );

    /* =====================================================
       FINAL HOTEL DATA
    ===================================================== */

    console.log(
      "🏨 FINAL HOTEL DATA:",
      hotels
    );

    /* =====================================================
       GOOGLE FOUND HOTELS
    ===================================================== */

    if (hotels.length > 0) {
      return hotels;
    }

    /* =====================================================
       GOOGLE FOUND NOTHING
    ===================================================== */

    console.warn(
      "⚠️ Google returned no hotels."
    );

    const fallbackQuery =
      type === "lodging"
        ? "hotel"
        : type === "taxi_stand"
        ? "taxi stand"
        : type;

    return await fetchFallbackPlaces(
      fallbackQuery,
      latitude,
      longitude
    );

  } catch (error) {

    /* =====================================================
       GOOGLE REQUEST FAILED
    ===================================================== */

    console.error(
      "❌ Google Places request failed:",
      error
    );

    /* =====================================================
       OPENSTREETMAP FALLBACK
    ===================================================== */

    const fallbackQuery =
      type === "lodging"
        ? "hotel"
        : type === "taxi_stand"
        ? "taxi stand"
        : type;

    return await fetchFallbackPlaces(
      fallbackQuery,
      latitude,
      longitude
    );
  }
}