import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function HotelDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [activeImage, setActiveImage] =
    useState(0);

  const [imageErrors, setImageErrors] =
    useState({});

  if (!state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">

        <div className="w-full max-w-md rounded-[35px] bg-white p-10 text-center shadow-xl">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-orange-50 text-6xl">
            🏨
          </div>

          <h1 className="mt-6 text-2xl font-black text-slate-900">
            No Hotel Selected
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Please select a hotel first.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-2xl bg-orange-500 px-7 py-3 font-bold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
          >
            ← Go Back
          </button>

        </div>

      </div>
    );
  }

  /* =======================================================
     BUILD GOOGLE PHOTO URLS
  ======================================================= */

  const API_KEY =
    import.meta.env
      .VITE_GOOGLE_MAPS_API_KEY;

  const googlePhotos =
    Array.isArray(state.photos)
      ? state.photos
      : [];

  const photoUrls =
    googlePhotos
      .filter(
        (photo) =>
          photo &&
          photo.name
      )
      .map(
        (photo) =>
          `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=1600&maxHeightPx=1000&key=${API_KEY}`
      );

  /* =======================================================
     FALLBACK PHOTO
  ======================================================= */

  if (
    photoUrls.length === 0 &&
    state.photoUrl
  ) {
    photoUrls.push(
      state.photoUrl
    );
  }

  if (
    photoUrls.length === 0 &&
    state.image
  ) {
    photoUrls.push(
      state.image
    );
  }

  if (
    photoUrls.length === 0 &&
    state.photo
  ) {
    photoUrls.push(
      state.photo
    );
  }

  const rating = state.rating || null;

  const reviewCount =
    state.user_ratings_total || 0;

  const currentImage =
    photoUrls[activeImage] ||
    null;

  const attribution =
    state.photoAttributions?.[0];

  /* =======================================================
     IMAGE ERROR
  ======================================================= */

  function handleImageError(index) {
    setImageErrors((previous) => ({
      ...previous,
      [index]: true,
    }));
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* =================================================
          TOP NAV
      ================================================= */}

      <div className="absolute left-0 right-0 top-0 z-30">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">

          <button
            onClick={() => navigate(-1)}
            className="rounded-full border border-white/20 bg-black/30 px-5 py-3 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white hover:text-slate-900"
          >
            ← Back
          </button>

          <button
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/30 text-2xl text-white backdrop-blur-xl transition hover:scale-110 hover:bg-white hover:text-red-500"
          >
            ♡
          </button>

        </div>

      </div>

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative h-[520px] overflow-hidden bg-slate-200 md:h-[650px]">

        {currentImage &&
        !imageErrors[activeImage] ? (
          <img
            src={currentImage}
            alt={state.name || "Hotel"}
            className="h-full w-full object-cover"
            onError={() =>
              handleImageError(
                activeImage
              )
            }
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400">

            <div className="flex h-28 w-28 items-center justify-center rounded-[35px] bg-white/70 text-7xl shadow-xl backdrop-blur">
              🏨
            </div>

            <p className="mt-5 font-bold text-slate-600">
              Hotel image unavailable
            </p>

          </div>
        )}

        {/* OVERLAY */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        {/* HERO CONTENT */}

        <div className="absolute bottom-0 left-0 right-0">

          <div className="mx-auto max-w-7xl px-5 pb-10 md:px-8">

            <div className="max-w-4xl">

              {/* RATING */}

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur-xl">

                ⭐

                <span>
                  {rating || "N/A"}
                </span>

                {reviewCount > 0 && (
                  <span className="text-white/70">
                    · {reviewCount.toLocaleString()} reviews
                  </span>
                )}

              </div>

              {/* NAME */}

              <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-lg md:text-6xl">
                {state.name ||
                  "Hotel"}
              </h1>

              {/* LOCATION */}

              <p className="mt-4 text-sm font-medium text-white/85 md:text-base">
                📍{" "}
                {state.vicinity ||
                  "Location unavailable"}
              </p>

              {/* ATTRIBUTION */}

              {attribution && (
                <p className="mt-2 text-[10px] text-white/60">
                  Photo:{" "}
                  {attribution.displayName ||
                    "Google contributor"}
                </p>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          GALLERY
      ================================================= */}

      {photoUrls.length > 1 && (
        <section className="mx-auto max-w-7xl px-5 pt-6 md:px-8">

          <div className="flex gap-3 overflow-x-auto pb-2">

            {photoUrls
              .slice(0, 8)
              .map(
                (photo, index) => (
                  <button
                    key={`${photo}-${index}`}
                    onClick={() =>
                      setActiveImage(
                        index
                      )
                    }
                    className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                      activeImage ===
                      index
                        ? "border-orange-500 shadow-lg shadow-orange-100"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >

                    {!imageErrors[index] ? (
                      <img
                        src={photo}
                        alt={`${state.name || "Hotel"} ${index + 1}`}
                        className="h-full w-full object-cover"
                        onError={() =>
                          handleImageError(
                            index
                          )
                        }
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-200 text-2xl">
                        🏨
                      </div>
                    )}

                  </button>
                )
              )}

          </div>

        </section>
      )}

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="mx-auto max-w-7xl px-5 py-10 md:px-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <div>

            {/* ABOUT */}

            <section className="rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm md:p-8">

              <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">
                About this stay
              </p>

              <h2 className="mt-2 text-3xl font-black text-slate-900">
                A comfortable stay awaits
              </h2>

              <p className="mt-4 max-w-3xl leading-7 text-slate-500">
                Enjoy a comfortable stay in
                a beautiful location. Explore
                nearby attractions, relax in
                comfortable rooms and make
                your journey memorable.
              </p>

              {/* FEATURES */}

              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <Feature
                  icon="🛏️"
                  title="Comfortable rooms"
                  description="Relax after your journey"
                  className="bg-orange-50"
                />

                <Feature
                  icon="🍳"
                  title="Breakfast"
                  description="Start your day right"
                  className="bg-blue-50"
                />

                <Feature
                  icon="📶"
                  title="Free Wi-Fi"
                  description="Stay connected"
                  className="bg-green-50"
                />

                <Feature
                  icon="🅿️"
                  title="Parking"
                  description="Convenient parking"
                  className="bg-purple-50"
                />

              </div>

            </section>

            {/* LOCATION */}

            <section className="mt-8 rounded-[30px] border border-slate-200 bg-white p-7 shadow-sm md:p-8">

              <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">
                Location
              </p>

              <h2 className="mt-2 text-2xl font-black text-slate-900">
                Around the hotel
              </h2>

              <div className="mt-5 rounded-3xl bg-slate-100 p-6">

                <div className="flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
                    📍
                  </div>

                  <div>

                    <p className="font-bold text-slate-800">
                      {state.name}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                      {state.vicinity ||
                        "Location unavailable"}
                    </p>

                  </div>

                </div>

              </div>

            </section>

            {/* REVIEWS */}

            <section className="mt-8">

              <div className="flex items-end justify-between">

                <div>

                  <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-500">
                    Guest experiences
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-slate-900">
                    What guests say
                  </h2>

                </div>

                <div className="rounded-2xl bg-orange-50 px-5 py-4 text-center">

                  <p className="text-2xl font-black text-orange-500">
                    {rating ||
                      "N/A"}
                  </p>

                  <p className="text-xs font-semibold text-slate-500">
                    Google rating
                  </p>

                </div>

              </div>

              {/* NOTE:
                  These are UI placeholder reviews.
                  They are NOT claimed to be Google reviews.
              */}

              <div className="mt-5 grid gap-4 md:grid-cols-3">

                <ReviewCard
                  stars="⭐⭐⭐⭐⭐"
                  text="Amazing stay and beautiful rooms."
                />

                <ReviewCard
                  stars="⭐⭐⭐⭐⭐"
                  text="Great location and very comfortable."
                />

                <ReviewCard
                  stars="⭐⭐⭐⭐"
                  text="Clean rooms and friendly service."
                />

              </div>

            </section>

          </div>

          {/* =================================================
              BOOKING CARD
          ================================================= */}

          <aside>

            <div className="sticky top-6 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)]">

              <div className="flex items-center justify-between">

                <p className="text-sm font-semibold text-slate-400">
                  Your stay
                </p>

                <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                  ● Available
                </div>

              </div>

              <div className="mt-3 flex items-end gap-2">

                <h2 className="text-4xl font-black text-orange-500">
                  ₹4,500
                </h2>

                <span className="pb-1 text-sm text-slate-400">
                  / night
                </span>

              </div>

              <div className="my-6 h-px bg-slate-100" />

              <div className="space-y-5">

                <DetailRow
                  label="Hotel"
                  value={
                    state.name ||
                    "Hotel"
                  }
                />

                <DetailRow
                  label="Rating"
                  value={
                    rating
                      ? `⭐ ${rating}/5`
                      : "N/A"
                  }
                />

                <DetailRow
                  label="Reviews"
                  value={
                    reviewCount
                      ? reviewCount.toLocaleString()
                      : "N/A"
                  }
                />

                <DetailRow
                  label="Location"
                  value={
                    state.vicinity ||
                    "Nearby"
                  }
                />

              </div>

              {/* BOOK */}

              <button
                onClick={() =>
                  navigate(
                    "/booking",
                    {
                      state: state,
                    }
                  )
                }
                className="group relative mt-8 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 font-black text-white shadow-xl shadow-orange-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-300 active:translate-y-0"
              >

                <span className="relative z-10">
                  Book This Hotel →
                </span>

                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              </button>

              <p className="mt-4 text-center text-xs text-slate-400">
                🔒 Secure booking · No hidden charges
              </p>

            </div>

          </aside>

        </div>

      </main>

      {/* =================================================
          ANIMATION
      ================================================= */}

      <style>
        {`
          @keyframes hotelZoom {
            from {
              transform: scale(1);
            }

            to {
              transform: scale(1.06);
            }
          }
        `}
      </style>

    </div>
  );
}

/* =========================================================
   FEATURE COMPONENT
========================================================= */

function Feature({
  icon,
  title,
  description,
  className,
}) {
  return (
    <div
      className={`rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${className}`}
    >
      <div className="text-2xl">
        {icon}
      </div>

      <p className="mt-2 font-black text-slate-800">
        {title}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   REVIEW CARD
========================================================= */

function ReviewCard({
  stars,
  text,
}) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="text-orange-400">
        {stars}
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-600">
        "{text}"
      </p>

      <p className="mt-5 text-xs font-black uppercase tracking-wider text-slate-400">
        Guest experience
      </p>

    </div>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
}) {
  return (
    <div className="flex items-start justify-between gap-5">

      <span className="shrink-0 text-sm text-slate-400">
        {label}
      </span>

      <span className="max-w-[210px] text-right text-sm font-bold text-slate-800">
        {value}
      </span>

    </div>
  );
}