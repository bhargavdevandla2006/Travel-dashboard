import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Comments from "./Comments";
import apiUrl from "../services/api";

export default function TripCard({
  id,
  image,
  title,
  location,
  price,
}) {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likeLoading, setLikeLoading] = useState(false);

  /*
  =========================================================
  LOAD LIKE STATUS + LIKE COUNT
  =========================================================
  */

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        await Promise.all([
          checkLike(mounted),
          loadLikes(mounted),
        ]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, [id]);

  /*
  =========================================================
  CHECK WHETHER CURRENT USER LIKED THIS TRIP
  =========================================================
  */

  async function checkLike() {
    try {
      const response = await fetch(
        `${apiUrl}/check-like/${id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setLiked(Boolean(data.liked));
    } catch (error) {
      console.error("Check like error:", error);
    }
  }

  /*
  =========================================================
  LOAD TOTAL LIKES
  =========================================================
  */

  async function loadLikes() {
    try {
      const response = await fetch(
        `${apiUrl}/likes-count/${id}`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setLikes(Number(data.count || 0));
    } catch (error) {
      console.error("Load likes error:", error);
    }
  }

  /*
  =========================================================
  ADD TO FAVORITES
  =========================================================
  */

  function addToFavorites() {
    try {
      const existing =
        JSON.parse(localStorage.getItem("favorites")) || [];

      const place = {
        name: title,
        country: location,
        image,
      };

      const found = existing.find(
        (p) =>
          p.name === place.name &&
          p.country === place.country
      );

      if (!found) {
        existing.push(place);

        localStorage.setItem(
          "favorites",
          JSON.stringify(existing)
        );
      }
    } catch (error) {
      console.error(
        "Failed to add favorite:",
        error
      );
    }
  }

  /*
  =========================================================
  REMOVE FROM FAVORITES
  =========================================================
  */

  function removeFromFavorites() {
    try {
      const existing =
        JSON.parse(localStorage.getItem("favorites")) || [];

      const filtered = existing.filter(
        (p) =>
          !(
            p.name === title &&
            p.country === location
          )
      );

      localStorage.setItem(
        "favorites",
        JSON.stringify(filtered)
      );
    } catch (error) {
      console.error(
        "Failed to remove favorite:",
        error
      );
    }
  }

  /*
  =========================================================
  LIKE / UNLIKE TOGGLE
  =========================================================
  */

  async function handleLikeToggle() {
    // Prevent multiple clicks while request is running
    if (likeLoading) {
      return;
    }

    setLikeLoading(true);

    try {
      /*
      =======================================================
      IF ALREADY LIKED
      -> UNLIKE
      =======================================================
      */

      if (liked) {
        const response = await fetch(
          `${apiUrl}/unlike/${id}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!response.ok) {
          console.error(
            "Unlike failed:",
            response.status
          );

          return;
        }

        await response.json();

        // Update UI immediately
        setLiked(false);

        // Remove from favorites
        removeFromFavorites();

        // Get latest count from backend
        await loadLikes();
      }

      /*
      =======================================================
      IF NOT LIKED
      -> LIKE
      =======================================================
      */

      else {
        const response = await fetch(
          `${apiUrl}/like/${id}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error(
            "Like failed:",
            response.status
          );

          return;
        }

        await response.json();

        // Update UI immediately
        setLiked(true);

        // Add to favorites
        addToFavorites();

        // Get latest count from backend
        await loadLikes();
      }
    } catch (error) {
      console.error(
        "Like / Unlike error:",
        error
      );
    } finally {
      setLikeLoading(false);
    }
  }

  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (
    <div
      className="
        group
        bg-white
        dark:bg-gray-900

        rounded-3xl
        overflow-hidden

        border
        border-gray-200
        dark:border-gray-700

        shadow-lg
        hover:shadow-2xl

        transition-all
        duration-500

        hover:-translate-y-2
      "
    >
      {/* =================================================
          IMAGE SECTION
      ================================================= */}

      <div
        className="
          group
          relative

          bg-white
          dark:bg-gray-900

          border
          border-gray-200
          dark:border-gray-700

          rounded-3xl
          overflow-hidden

          shadow-md
          hover:shadow-xl

          transition-all
          duration-300
        "
      >
        <img
          src={image}
          alt={title}
          className="
            w-full
            h-56
            object-cover

            group-hover:scale-110

            transition
            duration-700
          "
        />

        {/* Rating */}

        <div
          className="
            absolute
            top-4
            left-4

            bg-white
            dark:bg-gray-800

            rounded-full

            px-3
            py-1

            flex
            items-center
            gap-2

            shadow-lg
          "
        >
          <span className="text-yellow-500">
            ⭐
          </span>

          <span
            className="
              font-semibold
              text-sm

              text-gray-800
              dark:text-white
            "
          >
            4.8
          </span>
        </div>

        {/* =================================================
            LIKE BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={handleLikeToggle}
          disabled={likeLoading || loading}
          aria-label={
            liked
              ? "Unlike this trip"
              : "Like this trip"
          }
          className={`
            absolute
            top-4
            right-4

            w-12
            h-12

            rounded-full

            flex
            items-center
            justify-center

            shadow-lg

            transition-all
            duration-200

            ${
              liked
                ? "bg-red-500 text-white scale-105"
                : "bg-white text-gray-700 hover:bg-red-500 hover:text-white"
            }

            ${
              likeLoading
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer"
            }
          `}
        >
          {liked ? "❤️" : "🤍"}
        </button>
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="p-6">
        {/* Title */}

        <h2
          className="
            text-2xl
            font-bold

            text-gray-900
            dark:text-white
          "
        >
          {title}
        </h2>

        {/* Location */}

        <p
          className="
            flex
            items-center
            gap-2

            text-gray-500
            dark:text-gray-300

            mt-3
          "
        >
          📍 {location}
        </p>

        {/* =================================================
            PRICE + LIKES
        ================================================= */}

        <div
          className="
            flex
            items-center
            justify-between

            mt-5
          "
        >
          {/* Price */}

          <div>
            <p
              className="
                text-sm
                text-gray-400
                dark:text-gray-500
              "
            >
              Starting From
            </p>

            <h2
              className="
                text-3xl
                font-extrabold
                text-blue-600
              "
            >
              ₹{price}
            </h2>
          </div>

          {/* Likes */}

          <div className="text-right">
            <p
              className="
                text-red-500
                font-bold
                text-lg
              "
            >
              ❤️ {likes}
            </p>

            <p
              className="
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              Total Likes
            </p>
          </div>
        </div>

        {/* =================================================
            HOTELS + TRANSPORT
        ================================================= */}

        <div
          className="
            grid
            grid-cols-2
            gap-3

            mt-6
          "
        >
          <button
            type="button"
            onClick={() =>
              navigate(`/hotels/${location}`)
            }
            className="
              bg-green-100
              dark:bg-green-900/40

              text-green-700
              dark:text-green-300

              py-3

              rounded-xl

              font-semibold

              hover:bg-green-600
              hover:text-white

              transition
            "
          >
            🏨 Hotels
          </button>

          <button
            type="button"
            onClick={() =>
              navigate(`/transport/${location}`)
            }
            className="
              bg-orange-100
              dark:bg-orange-900/40

              text-orange-700
              dark:text-orange-300

              py-3

              rounded-xl

              font-semibold

              hover:bg-orange-600
              hover:text-white

              transition
            "
          >
            🚖 Transport
          </button>
        </div>

        {/* =================================================
            BOOK NOW
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            navigate(`/trip/${title}`, {
              state: {
                id,
                title,
                location,
                price,
                image,
              },
            })
          }
          className="
            w-full
            mt-5

            bg-gradient-to-r
            from-blue-600
            to-indigo-600

            text-white

            py-3

            rounded-2xl

            font-bold

            hover:shadow-xl
            hover:scale-[1.02]

            transition-all
          "
        >
          Book Now →
        </button>

        {/* =================================================
            COMMENTS
        ================================================= */}

        <div
          className="
            mt-6

            border-t
            border-gray-200
            dark:border-gray-700

            pt-5
          "
        >
          <Comments tripId={id} />
        </div>
      </div>
    </div>
  );
}