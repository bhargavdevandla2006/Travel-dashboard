
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaPlus,
  FaPlay,
} from "react-icons/fa";

import { apiUrl } from "../services/api";

export default function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadReels();
  }, []);

  const loadReels = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${apiUrl}/reels`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      setReels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load reels:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (
    event,
    reelId,
    liked
  ) => {
    event.stopPropagation();

    try {
      const url = liked
        ? `${apiUrl}/reels/${reelId}/unlike`
        : `${apiUrl}/reels/${reelId}/like`;

      const method = liked
        ? "DELETE"
        : "POST";

      await fetch(url, {
        method,
        credentials: "include",
      });

      loadReels();
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  const toggleSave = async (
    event,
    reelId,
    saved
  ) => {
    event.stopPropagation();

    try {
      const url = saved
        ? `${apiUrl}/reels/${reelId}/unsave`
        : `${apiUrl}/reels/${reelId}/save`;

      const method = saved
        ? "DELETE"
        : "POST";

      await fetch(url, {
        method,
        credentials: "include",
      });

      loadReels();
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Loading amazing reels...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      

      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">

        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              Travel Reels 🎬
            </h1>

            <p className="text-gray-500 mt-1">
              Discover amazing travel moments
            </p>

          </div>

          <button
            onClick={() =>
              navigate("/create-reel")
            }
            className="
              flex
              items-center
              gap-2
              bg-black
              text-white
              px-5
              py-3
              rounded-xl
              font-semibold
              hover:bg-gray-800
              hover:scale-105
              transition
              shadow-lg
            "
          >
            <FaPlus />

            Create Reel

          </button>

        </div>

      </div>


      

      <div className="max-w-7xl mx-auto px-6 py-10">

        {reels.length > 0 ? (

          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-7
            "
          >

            {reels.map((reel) => (

              <div
                key={reel.id}
                onClick={() =>
                  navigate(`/reel/${reel.id}`)
                }
                className="
                  group
                  bg-white
                  rounded-3xl
                  overflow-hidden
                  border
                  border-gray-200
                  shadow-sm
                  hover:shadow-2xl
                  hover:-translate-y-2
                  transition-all
                  duration-300
                  cursor-pointer
                "
              >

                

                <div className="relative h-[360px] overflow-hidden bg-gray-900">

                  {reel.thumbnail ? (

                    <img
                      src={reel.thumbnail}
                      alt={reel.title}
                      className="
                        w-full
                        h-full
                        object-cover
                        group-hover:scale-110
                        transition
                        duration-500
                      "
                    />

                  ) : (

                    <video
                      src={reel.video_url}
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />

                  )}


                  

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/70
                      via-transparent
                      to-transparent
                    "
                  />


                  

                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                    "
                  >

                    <div
                      className="
                        w-16
                        h-16
                        rounded-full
                        bg-white/90
                        flex
                        items-center
                        justify-center
                        text-black
                        shadow-xl
                        group-hover:scale-110
                        transition
                      "
                    >

                      <FaPlay className="ml-1" />

                    </div>

                  </div>


                  

                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">

                    <h2 className="font-bold text-xl line-clamp-1">

                      {reel.title}

                    </h2>

                  </div>

                </div>


                

                <div className="p-5">

                  <p className="text-gray-500 text-sm line-clamp-2 min-h-[40px]">

                    {reel.description ||
                      "No description added"}

                  </p>


                  

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      mt-5
                      pt-4
                      border-t
                      border-gray-100
                    "
                  >

                    

                    <button
                      onClick={(event) =>
                        toggleLike(
                          event,
                          reel.id,
                          reel.liked
                        )
                      }
                      className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-2
                        rounded-xl
                        hover:bg-red-50
                        transition
                      "
                    >

                      {reel.liked ? (

                        <FaHeart className="text-red-500 text-xl" />

                      ) : (

                        <FaRegHeart className="text-gray-600 text-xl" />

                      )}

                      <span className="text-sm font-medium">

                        {reel.likes_count || 0}

                      </span>

                    </button>


                    

                    <button
                      onClick={(event) =>
                        toggleSave(
                          event,
                          reel.id,
                          reel.saved
                        )
                      }
                      className="
                        flex
                        items-center
                        justify-center
                        w-11
                        h-11
                        rounded-xl
                        hover:bg-gray-100
                        transition
                      "
                    >

                      {reel.saved ? (

                        <FaBookmark className="text-xl text-black" />

                      ) : (

                        <FaRegBookmark className="text-xl text-gray-600" />

                      )}

                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        ) : (

          

          <div
            className="
              min-h-[500px]
              flex
              flex-col
              items-center
              justify-center
              text-center
            "
          >

            <div className="text-7xl mb-6">

              🎬

            </div>

            <h2 className="text-3xl font-bold text-gray-900">

              No reels yet

            </h2>

            <p className="text-gray-500 mt-3 max-w-md">

              Your travel community is waiting.
              Create the first reel and share
              your amazing journey.

            </p>

            <button
              onClick={() =>
                navigate("/create-reel")
              }
              className="
                mt-7
                bg-black
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                hover:bg-gray-800
                hover:scale-105
                transition
              "
            >

              <span className="flex items-center gap-2">

                <FaPlus />

                Create Your First Reel

              </span>

            </button>

          </div>

        )}

      </div>

    </div>
  );
}