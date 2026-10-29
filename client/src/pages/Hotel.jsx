import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNearbyPlaces } from "../services/places";
import { useMap } from "../context/useMap";

/* =========================================================
   HOTEL CARD
========================================================= */

function HotelCard({
  hotel,
  index,
  displayLocation,
  navigate,
  unsplashPhoto,
}) {
  const [imageError, setImageError] = useState(false);

  /* =======================================================
     USE UNSPLASH PHOTO FIRST
  ======================================================= */

  const image =
    unsplashPhoto?.url ||
    hotel.photoUrl ||
    hotel.image ||
    hotel.photo ||
    null;

  const rating = hotel.rating;

  const reviewCount =
    hotel.user_ratings_total || 0;

  const googleAttribution =
    hotel.photoAttributions?.[0];

  return (
    <div
      className="group relative overflow-hidden rounded-[30px] border border-white/80 bg-white shadow-[0_15px_50px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_70px_rgba(249,115,22,0.18)]"
      style={{
        animation:
          "hotelCardEnter 0.7s ease-out forwards",
        animationDelay:
          `${index * 100}ms`,
        opacity: 0,
      }}
    >
      {/* =================================================
          IMAGE
      ================================================= */}

      <div className="relative h-[270px] overflow-hidden bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">

        {!imageError && image ? (
          <img
            src={image}
            alt={hotel.name || "Hotel"}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            onError={() => {
              console.error(
                "❌ Hotel image failed:",
                hotel.name,
                image
              );

              setImageError(true);
            }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/70 text-5xl shadow-lg backdrop-blur">
              🏨
            </div>

            <p className="text-sm font-bold text-slate-600">
              Hotel image unavailable
            </p>
          </div>
        )}

        {/* IMAGE OVERLAY */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

        {/* =================================================
            TOP LEFT RATING
        ================================================= */}

        <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full border border-white/50 bg-white/95 px-3.5 py-2 text-sm font-black text-slate-800 shadow-lg backdrop-blur-xl">
          ⭐ {rating || "N/A"}
        </div>

        {/* =================================================
            TOP RIGHT HEART
        ================================================= */}

        <button
          onClick={(event) => {
            event.stopPropagation();
          }}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/90 text-xl text-slate-600 shadow-lg backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:text-red-500 active:scale-95"
        >
          ♡
        </button>

        {/* =================================================
            BOTTOM IMAGE INFO
        ================================================= */}

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center justify-between gap-3">

            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/70">
                Hotel stay
              </p>

              <p className="truncate text-sm font-semibold text-white">
                📍 {displayLocation || "Nearby"}
              </p>
            </div>

            {reviewCount > 0 && (
              <div className="shrink-0 rounded-full bg-black/30 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                {reviewCount.toLocaleString()} reviews
              </div>
            )}

          </div>
        </div>

        {/* =================================================
            UNSPLASH ATTRIBUTION
        ================================================= */}

        {unsplashPhoto && (
          <div className="absolute bottom-1 left-5 right-5 truncate text-[8px] text-white/80">

            Photo by{" "}

            <a
              href={unsplashPhoto.photographerUrl}
              target="_blank"
              rel="noreferrer"
              className="underline"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              {unsplashPhoto.photographerName}
            </a>

            {" "}on{" "}

            <a
              href={unsplashPhoto.unsplashUrl}
              target="_blank"
              rel="noreferrer"
              className="underline"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              Unsplash
            </a>

          </div>
        )}

        {/* =================================================
            GOOGLE PHOTO ATTRIBUTION
        ================================================= */}

        {!unsplashPhoto && googleAttribution && (
          <div className="absolute bottom-1 left-5 max-w-[80%] truncate text-[8px] text-white/60">

            Photo:{" "}

            {googleAttribution.displayName ||
              "Google contributor"}

          </div>
        )}

      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="p-5">

        {/* HOTEL NAME */}

        <h2 className="line-clamp-1 text-xl font-black tracking-tight text-slate-900 transition-colors duration-300 group-hover:text-orange-500">
          {hotel.name || "Hotel"}
        </h2>

        {/* ADDRESS */}

        <p className="mt-2 line-clamp-2 min-h-[42px] text-sm leading-5 text-slate-500">
          {hotel.vicinity ||
            "Beautiful hotel in a great location"}
        </p>

        {/* FEATURES */}

        <div className="mt-4 flex flex-wrap gap-2">

          <span className="rounded-full bg-orange-50 px-3 py-1.5 text-[11px] font-bold text-orange-600">
            🛏️ Comfortable
          </span>

          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600">
            🍳 Breakfast
          </span>

          <span className="rounded-full bg-green-50 px-3 py-1.5 text-[11px] font-bold text-green-600">
            📶 Wi-Fi
          </span>

        </div>

        {/* PRICE */}

        <div className="mt-6 flex items-end justify-between">

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Starting from
            </p>

            <div className="mt-1">
              <span className="text-2xl font-black text-slate-900">
                ₹4,500
              </span>

              <span className="ml-1 text-xs font-medium text-slate-400">
                /night
              </span>
            </div>
          </div>

          <div className="text-right">

            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
              Guest rating
            </p>

            <p className="mt-1 text-sm font-black text-slate-700">
              {rating
                ? `${rating}/5`
                : "N/A"}
            </p>

          </div>

        </div>

        {/* BUTTONS */}

        <div className="mt-5 grid grid-cols-2 gap-3">

          {/* DETAILS */}

          <button
            onClick={() =>
              navigate("/hotel-details", {
                state: {
                  ...hotel,

                  photoUrl:
                    unsplashPhoto?.url ||
                    hotel.photoUrl ||
                    null,

                  photoAttribution:
                    unsplashPhoto
                      ? {
                          photographerName:
                            unsplashPhoto.photographerName,

                          photographerUsername:
                            unsplashPhoto.photographerUsername,

                          photographerUrl:
                            unsplashPhoto.photographerUrl,

                          unsplashUrl:
                            unsplashPhoto.unsplashUrl,
                        }
                      : null,
                },
              })
            }
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-all duration-300 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
          >
            View Details
          </button>

          {/* BOOK */}

          <button
            onClick={() =>
              navigate("/booking", {
                state: {
                  ...hotel,

                  photoUrl:
                    unsplashPhoto?.url ||
                    hotel.photoUrl ||
                    null,

                  photoAttribution:
                    unsplashPhoto
                      ? {
                          photographerName:
                            unsplashPhoto.photographerName,

                          photographerUsername:
                            unsplashPhoto.photographerUsername,

                          photographerUrl:
                            unsplashPhoto.photographerUrl,

                          unsplashUrl:
                            unsplashPhoto.unsplashUrl,
                        }
                      : null,
                },
              })
            }
            className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-300 active:translate-y-0"
          >
            Book Now
          </button>

        </div>

      </div>
    </div>
  );
}


/* =========================================================
   MAIN HOTELS PAGE
========================================================= */

export default function Hotels() {

  const navigate = useNavigate();

  const [hotels, setHotels] = useState([]);
  const [hotelPhotos, setHotelPhotos] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { location: routeLocation } = useParams();
  const { location: mapLocation } = useMap();


  /* =======================================================
     LOAD HOTELS
  ======================================================= */

  /* =======================================================
     GEOCODE LOCATION
  ======================================================= */

  const geocodeLocation = useCallback(async (name) => {

    try {

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          name
        )}&format=json&limit=1`
      );

      if (!response.ok) {
        return null;
      }

      const results = await response.json();

      if (!results.length) {
        return null;
      }

      return {
        lat: parseFloat(results[0].lat),
        lng: parseFloat(results[0].lon),
      };

    } catch (error) {

      console.error(
        "Geocoding error:",
        error
      );

      return null;
    }
  }, []);


  /* =======================================================
     LOAD UNSPLASH HOTEL PHOTOS
  ======================================================= */

  const loadHotelPhotos = useCallback(async (
    city,
    count,
    cancelled = false
  ) => {

    try {

      console.log(
        "📸 Loading Unsplash hotel photos for:",
        city
      );

      const response = await fetch(
        `http://localhost:3000/api/hotel-images?city=${encodeURIComponent(
          city
        )}&count=${count}`
      );

      if (!response.ok) {

        console.error(
          "❌ Hotel photo API failed:",
          response.status
        );

        /*
           IMPORTANT:

           Do NOT clear existing photos here.

           Another request may already have successfully
           loaded photos.
        */

        return;

      }

      const data = await response.json();

      console.log(
        "📸 Unsplash photos:",
        data
      );

      /*
         Ignore this response if the component was
         already replaced by another location request.
      */

      if (cancelled) {
        console.log(
          "⚠️ Ignoring stale Unsplash response"
        );

        return;
      }

      /*
         ONLY update hotelPhotos when we actually
         received photos.

         This prevents:

         Request 1 → photos
         Request 2 → []
         Request 2 overwriting Request 1.
      */

      if (
        data.success &&
        Array.isArray(data.photos) &&
        data.photos.length > 0
      ) {

        console.log(
          `✅ Received ${data.photos.length} Unsplash photos`
        );

        setHotelPhotos(
          data.photos
        );

      } else {

        console.warn(
          "⚠️ Unsplash returned no photos. Keeping existing photos."
        );

      }

    } catch (error) {

      console.error(
        "❌ Hotel photo loading error:",
        error
      );

      /*
         IMPORTANT:

         Do not erase existing photos if a second
         request fails.
      */
    }
  }, []);


  /* =======================================================
     LOAD HOTELS
  ======================================================= */

  const loadHotels = useCallback(async (cancelled = false) => {

    setError(null);
    setLoading(true);

    let coords = mapLocation;

    let cityName =
      routeLocation
        ? decodeURIComponent(routeLocation)
        : mapLocation?.name || "hotel";


    /* =====================================================
       CLEAR PHOTOS WHEN LOCATION ACTUALLY CHANGES
    ===================================================== */

    setHotelPhotos([]);


    /* =====================================================
       GET COORDINATES
    ===================================================== */

    if (routeLocation) {

      const geocoded =
        await geocodeLocation(
          routeLocation
        );

      if (cancelled) {
        return;
      }

      if (!geocoded) {

        setError(
          "Unable to find location for hotels."
        );

        setHotels([]);
        setHotelPhotos([]);
        setLoading(false);

        return;
      }

      coords = geocoded;
    }


    try {

      /* ===================================================
         GET HOTELS FROM GOOGLE PLACES
      =================================================== */

      const data =
        await getNearbyPlaces(
          "lodging",
          coords
        );

      if (cancelled) {
        return;
      }

      console.log(
        "🏨 HOTELS FROM SERVICE:",
        data
      );

      const hotelList =
        Array.isArray(data)
          ? data
          : [];

      setHotels(
        hotelList
      );


      /* ===================================================
         GET UNSPLASH PHOTOS
      =================================================== */

      if (
        hotelList.length > 0 &&
        !cancelled
      ) {

        await loadHotelPhotos(
          cityName,
          hotelList.length,
          cancelled
        );

      } else {

        if (!cancelled) {
          setHotelPhotos([]);
        }

      }

    } catch (error) {

      if (cancelled) {
        return;
      }

      console.error(
        "Hotel load error:",
        error
      );

      setError(
        "Unable to load hotels."
      );

      setHotels([]);

      /*
         Keep existing photos instead of
         unnecessarily destroying them.
      */

    } finally {

      if (!cancelled) {
        setLoading(false);
      }

    }
  }, [geocodeLocation, loadHotelPhotos, mapLocation, routeLocation]);

  useEffect(() => {
    let cancelled = false;
    const request = setTimeout(() => {
      void loadHotels(cancelled);
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(request);
    };
  }, [loadHotels]);


  /* =======================================================
     DISPLAY LOCATION
  ======================================================= */

  const displayLocation =
    routeLocation
      ? decodeURIComponent(routeLocation)
      : mapLocation?.name;


  return (

    <div className="min-h-screen bg-[#f8fafc]">

      {/* =================================================
          HERO HEADER
      ================================================= */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">

        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">

          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">

            <div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                ✦ Premium stays
              </div>

              <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">

                Find your

                <span className="block bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
                  perfect stay
                </span>

              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
                Discover hotels near your destination,
                explore their locations and choose a
                comfortable stay for your journey.
              </p>

            </div>

            {!loading &&
              hotels.length > 0 && (

                <div className="rounded-3xl border border-orange-100 bg-white px-6 py-5 shadow-xl shadow-orange-100/50">

                  <p className="text-3xl font-black text-orange-500">
                    {hotels.length}
                  </p>

                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Hotels found
                  </p>

                </div>

              )}

          </div>


          {/* LOCATION CHIP */}

          {displayLocation && (

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2.5 text-sm font-semibold text-slate-600">

              📍

              <span>
                Hotels near {displayLocation}
              </span>

            </div>

          )}

        </div>

      </section>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="mx-auto max-w-7xl px-5 pt-8 md:px-8">

          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-600">
            {error}
          </div>

        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (

        <div className="mx-auto grid max-w-7xl gap-7 px-5 py-10 sm:grid-cols-2 lg:grid-cols-3 md:px-8">

          {[1, 2, 3, 4, 5, 6].map(
            (item) => (

              <div
                key={item}
                className="overflow-hidden rounded-[30px] bg-white shadow-sm"
              >

                <div className="h-[270px] animate-pulse bg-slate-200" />

                <div className="space-y-4 p-5">

                  <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200" />

                  <div className="h-4 w-full animate-pulse rounded bg-slate-200" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />

                  <div className="flex gap-2">

                    <div className="h-7 w-24 animate-pulse rounded-full bg-slate-200" />

                    <div className="h-7 w-20 animate-pulse rounded-full bg-slate-200" />

                  </div>

                  <div className="flex justify-between pt-2">

                    <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />

                    <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-200" />

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}


      {/* =================================================
          HOTEL GRID
      ================================================= */}

      {!loading &&
        hotels.length > 0 && (

          <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">

            <div className="mb-7 flex items-center justify-between">

              <div>

                <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                  Explore
                </p>

                <h2 className="mt-1 text-2xl font-black text-slate-900">
                  Available stays
                </h2>

              </div>

              <div className="hidden rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-400 shadow-sm md:block">
                Updated just now
              </div>

            </div>


            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

              {hotels.map(
                (hotel, index) => (

                  <HotelCard
                    key={
                      hotel.place_id ||
                      hotel.id ||
                      index
                    }

                    hotel={hotel}

                    index={index}

                    displayLocation={
                      displayLocation
                    }

                    navigate={navigate}

                    unsplashPhoto={
                      hotelPhotos[index] ||
                      null
                    }
                  />

                )
              )}

            </div>

          </main>

        )}


      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        !error &&
        hotels.length === 0 && (

          <div className="mx-auto max-w-xl px-5 py-20">

            <div className="rounded-[35px] border border-slate-200 bg-white p-12 text-center shadow-xl">

              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-orange-50 text-6xl">
                🏨
              </div>

              <h2 className="mt-6 text-2xl font-black text-slate-900">
                No hotels found
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Try searching another location
                or changing your destination.
              </p>

            </div>

          </div>

        )}


      {/* =================================================
          ANIMATION
      ================================================= */}

      <style>
        {`
          @keyframes hotelCardEnter {

            0% {
              opacity: 0;
              transform: translateY(30px) scale(0.97);
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }

          }
        `}
      </style>

    </div>
  );
}