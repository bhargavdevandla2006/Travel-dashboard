import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";


export default function TripCard({ id, image, title, location, price, }) {

  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadData() {

      await checkLike();

      await loadLikes();

      setLoading(false);

    }

    loadData();

  }, [id]);

  async function checkLike() {

    try {

      const response = await fetch(
        `https://travel-dashboard-backend-2.onrender.com/check-like/${id}`,
        {
          credentials: "include"
        }
      );

      if (response.ok) {

        const data = await response.json();

        setLiked(data.liked);

      }
    } catch (err) {

      console.log(err);

    }

  }
  async function loadLikes() {

    try {

      const response = await fetch(
        `https://travel-dashboard-backend-2.onrender.com/likes-count/${id}`
      );

      if (response.ok) {

        const data = await response.json();

        setLikes(data.count);

      }

    } catch (err) {

      console.log(err);

    }

  }

  async function handleLike() {

    try {

      const response = await fetch(
        `https://travel-dashboard-backend-2.onrender.com/like/${id}`,
        {
          method: "POST",
          credentials: "include"
        }
      );

      if (response.ok) {

        await response.json();

        setLiked(true);

        setLikes(prev => prev + 1);

      }

    } catch (err) {

      console.log(err);

    }

  }

  async function handleUnlike() {

    try {

      const response = await fetch(
        `https://travel-dashboard-backend-2.onrender.com/unlike/${id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      if (response.ok) {

        await response.json();

        setLiked(false);

        setLikes(prev => prev - 1);

      }

    } catch (err) {

      console.log(err);

    }

  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">

      <img src={image} className="h-24 w-full object-cover" />

      <div className="p-3">

        <h2 className="text-lg font-bold text-black-900">
          {title}
        </h2>

        <p className="text-sm font-semibold text-gray-600 mt-1">
          {location}
        </p>

        <h2 className="text-base text-blue-600 font-bold mt-2">
          ₹{price}
        </h2>

        <div className="mt-3 flex items-center justify-between">

          <button
            onClick={liked ? handleUnlike : handleLike}
            className={`px-4 py-2 rounded-xl font-semibold transition ${liked
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            {loading
              ? "Loading..."
              : liked
                ? "❤️ Liked"
                : "🤍 Like"}
          </button>

          <span className="text-sm font-semibold text-gray-600">
            ❤️ {likes}
          </span>

        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <button onClick={() => navigate(`/hotels/${location}`)}
            className="bg-green-100 text-green-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
          >Hotels</button>

          <button onClick={() => navigate(`/transport/${location}`)} className="bg-orange-100 text-orange-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold">Transport</button>

          <button
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
            className="mt-3 bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}