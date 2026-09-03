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

  

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [likeStatusResponse, likesCountResponse] =
          await Promise.all([
            fetch(`${apiUrl}/check-like/${id}`, {
              method: "GET",
              credentials: "include",
            }),

            fetch(`${apiUrl}/likes-count/${id}`),
          ]);

        

        if (likeStatusResponse.ok) {
          const likeData =
            await likeStatusResponse.json();

          if (mounted) {
            setLiked(Boolean(likeData.liked));
          }
        } else {
          console.error(
            "Check like failed:",
            likeStatusResponse.status
          );
        }

        

        if (likesCountResponse.ok) {
          const countData =
            await likesCountResponse.json();

          if (mounted) {
            setLikes(
              Number(countData.count || 0)
            );
          }
        } else {
          console.error(
            "Load likes failed:",
            likesCountResponse.status
          );
        }

      } catch (error) {
        console.error(
          "Failed to load like data:",
          error
        );
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

  

  function addToFavorites() {
    try {
      const existing =
        JSON.parse(
          localStorage.getItem("favorites")
        ) || [];

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

  

  function removeFromFavorites() {
    try {
      const existing =
        JSON.parse(
          localStorage.getItem("favorites")
        ) || [];

      const filtered =
        existing.filter(
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

  

  async function handleLikeToggle() {
    if (likeLoading) {
      return;
    }

    setLikeLoading(true);

    try {

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

      const data =
        await response.json();

      

      console.log(
        "LIKE RESPONSE:",
        response.status,
        data
      );

      

      if (!response.ok) {

        console.error(
          "Like toggle failed:",
          data
        );

        return;
      }

      

      setLiked(
        Boolean(data.liked)
      );

      

      setLikes(
        Number(data.count || 0)
      );

      

      if (data.liked) {

        addToFavorites();

      } else {

        removeFromFavorites();

      }

    } catch (error) {

      console.error(
        "Like toggle error:",
        error
      );

    } finally {

      setLikeLoading(false);

    }
  }

  

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

        

        <button
          type="button"

          onClick={handleLikeToggle}

          disabled={likeLoading}

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

      

      <div className="p-6">

        

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

        

        <div
          className="
            flex
            items-center
            justify-between

            mt-5
          "
        >

          

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
              navigate(
                `/hotels/${location}`
              )
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
              navigate(
                `/transport/${location}`
              )
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

        

        <button
          type="button"

          onClick={() =>
            navigate(
              `/trip/${title}`,
              {
                state: {
                  id,
                  title,
                  location,
                  price,
                  image,
                },
              }
            )
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