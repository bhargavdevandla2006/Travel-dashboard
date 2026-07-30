import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Comments from "./Comments";

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

        await loadLikes();

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

        await loadLikes();

      }

    } catch (err) {

      console.log(err);

    }

  }

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">

      {/* Image */}
      <div className="relative overflow-hidden">

        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover group-hover:scale-110 transition duration-700"
        />

        <div className="absolute top-4 left-4 bg-white rounded-full px-3 py-1 flex items-center gap-2 shadow-lg">

          <span className="text-yellow-500">⭐</span>

          <span className="font-semibold text-sm">
            4.8
          </span>

        </div>

        <button
          onClick={liked ? handleUnlike : handleLike}
          className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition
        ${liked
              ? "bg-red-500 text-white"
              : "bg-white text-gray-700 hover:bg-red-500 hover:text-white"
            }`}
        >
          ❤️
        </button>

      </div>



      <div className="p-6">

        <h2 className="text-2xl font-bold text-gray-900">
          {title}
        </h2>

        <p className="flex items-center gap-2 text-gray-500 mt-3">

          📍 {location}

        </p>

        <div className="flex items-center justify-between mt-5">

          <div>

            <p className="text-sm text-gray-400">
              Starting From
            </p>

            <h2 className="text-3xl font-extrabold text-blue-600">
              ₹{price}
            </h2>

          </div>

          <div className="text-right">

            <p className="text-red-500 font-bold text-lg">
              ❤️ {likes}
            </p>

            <p className="text-xs text-gray-500">
              Total Likes
            </p>

          </div>

        </div>

        {/* Buttons */}

        <div className="grid grid-cols-2 gap-3 mt-6">

          <button
            onClick={() => navigate(`/hotels/${location}`)}
            className="bg-green-100 text-green-700 py-3 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition"
          >
            🏨 Hotels
          </button>

          <button
            onClick={() => navigate(`/transport/${location}`)}
            className="bg-orange-100 text-orange-700 py-3 rounded-xl font-semibold hover:bg-orange-600 hover:text-white transition"
          >
            🚖 Transport
          </button>

        </div>

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
          className="w-full mt-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-2xl font-bold hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          Book Now →
        </button>

        <div className="mt-6 border-t pt-5">

          <Comments tripId={id} />

        </div>

      </div>

    </div>
  );
}