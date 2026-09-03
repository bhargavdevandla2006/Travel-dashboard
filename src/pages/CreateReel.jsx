import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaVideo,
  FaImage,
  FaGlobe,
  FaUsers,
  FaUserFriends,
  FaPaperPlane,
} from "react-icons/fa";

import { apiUrl } from "../services/api";

export default function CreateReel() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [visibility, setVisibility] = useState("public");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");

    if (!title.trim()) {
      setMessage("Please enter a reel title 🎬");
      return;
    }

    if (!videoUrl.trim()) {
      setMessage("Please enter a video URL 🎥");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${apiUrl}/reels`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            title,
            description,
            video_url: videoUrl,
            thumbnail,
            visibility,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create reel"
        );
      }

      setMessage("Reel created successfully 🎉");

      setTimeout(() => {
        navigate("/reels");
      }, 1000);

    } catch (error) {
      console.error("Create reel error:", error);

      setMessage(
        error.message ||
          "Something went wrong while creating the reel"
      );
    } finally {
      setLoading(false);
    }
  };

  const visibilityOptions = [
    {
      value: "public",
      title: "Public",
      description:
        "Anyone using TravelHub can view this reel.",
      icon: FaGlobe,
    },
    {
      value: "followers",
      title: "Followers",
      description:
        "Only your followers can view this reel.",
      icon: FaUsers,
    },
    {
      value: "close_friends",
      title: "Close Friends",
      description:
        "Only people in your Close Friends list can view it.",
      icon: FaUserFriends,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">

      

      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">

        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">

          <button
            onClick={() => navigate(-1)}
            className="
              flex items-center gap-2
              rounded-xl
              border border-gray-200
              bg-white
              px-4 py-2.5
              font-medium
              text-gray-700
              transition
              hover:bg-gray-100
              active:scale-95
            "
          >
            <FaArrowLeft />

            <span className="hidden sm:inline">
              Back
            </span>
          </button>

          <div className="text-center">

            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Create Reel 🎬
            </h1>

            <p className="hidden text-sm text-gray-500 sm:block">
              Share your next travel memory
            </p>

          </div>

          <div className="w-12 sm:w-24" />

        </div>

      </div>


      

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">

        <form
          onSubmit={handleSubmit}
          className="
            grid
            gap-8
            lg:grid-cols-[1fr_1.2fr]
          "
        >

          

          <div>

            <div
              className="
                sticky
                top-28
                overflow-hidden
                rounded-3xl
                border border-gray-200
                bg-gray-900
                shadow-xl
              "
            >

              <div className="relative aspect-[9/16] max-h-[650px]">

                {thumbnail ? (

                  <img
                    src={thumbnail}
                    alt="Reel preview"
                    className="
                      absolute inset-0
                      h-full w-full
                      object-cover
                    "
                    onError={(event) => {
                      event.currentTarget.style.display =
                        "none";
                    }}
                  />

                ) : videoUrl ? (

                  <video
                    src={videoUrl}
                    controls
                    className="
                      absolute inset-0
                      h-full w-full
                      object-cover
                    "
                  />

                ) : (

                  <div
                    className="
                      absolute inset-0
                      flex flex-col
                      items-center
                      justify-center
                      px-8
                      text-center
                      text-white
                    "
                  >

                    <div
                      className="
                        mb-5
                        flex h-20 w-20
                        items-center
                        justify-center
                        rounded-full
                        bg-white/10
                        text-3xl
                        backdrop-blur
                      "
                    >
                      <FaVideo />
                    </div>

                    <h2 className="text-xl font-bold">
                      Your Reel Preview
                    </h2>

                    <p className="mt-2 text-sm text-gray-300">
                      Add a video URL or thumbnail to
                      preview your reel.
                    </p>

                  </div>

                )}


                

                {(thumbnail || videoUrl) && (

                  <div
                    className="
                      pointer-events-none
                      absolute inset-x-0 bottom-0
                      bg-gradient-to-t
                      from-black/80
                      via-black/20
                      to-transparent
                      p-6
                    "
                  >

                    <p className="text-xs font-medium uppercase tracking-widest text-gray-300">
                      Travel Reel
                    </p>

                    <h2 className="mt-2 text-2xl font-bold text-white">
                      {title || "Your Reel Title"}
                    </h2>

                    {description && (

                      <p className="mt-2 line-clamp-3 text-sm text-gray-200">
                        {description}
                      </p>

                    )}

                  </div>

                )}

              </div>

            </div>

          </div>


          

          <div
            className="
              rounded-3xl
              border border-gray-200
              bg-white
              p-5
              shadow-sm
              sm:p-8
            "
          >

            <div className="mb-8">

              <h2 className="text-2xl font-bold text-gray-900">
                Reel Details
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Create something your followers will
                remember.
              </p>

            </div>


            

            <div className="mb-6">

              <label className="mb-2 block font-semibold text-gray-800">
                Reel Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Sunset in Bali 🌅"
                maxLength={100}
                className="
                  w-full
                  rounded-xl
                  border border-gray-300
                  px-4 py-3
                  outline-none
                  transition
                  focus:border-black
                  focus:ring-2
                  focus:ring-black/10
                "
              />

              <div className="mt-2 text-right text-xs text-gray-400">
                {title.length}/100
              </div>

            </div>


            

            <div className="mb-6">

              <label className="mb-2 block font-semibold text-gray-800">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Tell everyone about this amazing moment..."
                rows="5"
                maxLength={500}
                className="
                  w-full
                  resize-none
                  rounded-xl
                  border border-gray-300
                  px-4 py-3
                  outline-none
                  transition
                  focus:border-black
                  focus:ring-2
                  focus:ring-black/10
                "
              />

              <div className="mt-2 text-right text-xs text-gray-400">
                {description.length}/500
              </div>

            </div>


            

            <div className="mb-6">

              <label className="mb-2 flex items-center gap-2 font-semibold text-gray-800">
                <FaVideo />

                Video URL
              </label>

              <input
                type="url"
                value={videoUrl}
                onChange={(event) =>
                  setVideoUrl(event.target.value)
                }
                placeholder="https://example.com/video.mp4"
                className="
                  w-full
                  rounded-xl
                  border border-gray-300
                  px-4 py-3
                  outline-none
                  transition
                  focus:border-black
                  focus:ring-2
                  focus:ring-black/10
                "
              />

              <p className="mt-2 text-xs text-gray-500">
                Paste a direct video URL ending in .mp4,
                .webm, etc.
              </p>

            </div>


            

            <div className="mb-8">

              <label className="mb-2 flex items-center gap-2 font-semibold text-gray-800">
                <FaImage />

                Thumbnail URL
              </label>

              <input
                type="url"
                value={thumbnail}
                onChange={(event) =>
                  setThumbnail(event.target.value)
                }
                placeholder="https://example.com/travel-photo.jpg"
                className="
                  w-full
                  rounded-xl
                  border border-gray-300
                  px-4 py-3
                  outline-none
                  transition
                  focus:border-black
                  focus:ring-2
                  focus:ring-black/10
                "
              />

              <p className="mt-2 text-xs text-gray-500">
                Optional. Add an image that represents
                your reel.
              </p>

            </div>


            

            <div className="mb-8">

              <h3 className="mb-4 text-lg font-bold text-gray-900">
                Who can see this reel?
              </h3>

              <div className="space-y-3">

                {visibilityOptions.map((option) => {

                  const Icon = option.icon;

                  const selected =
                    visibility === option.value;

                  return (

                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        setVisibility(option.value)
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        gap-4
                        rounded-2xl
                        border
                        p-4
                        text-left
                        transition-all
                        ${
                          selected
                            ? "border-black bg-gray-50 ring-2 ring-black/10"
                            : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                        }
                      `}
                    >

                      <div
                        className={`
                          flex
                          h-11
                          w-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          ${
                            selected
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-600"
                          }
                        `}
                      >
                        <Icon />
                      </div>

                      <div className="flex-1">

                        <h4 className="font-semibold text-gray-900">
                          {option.title}
                        </h4>

                        <p className="mt-1 text-sm text-gray-500">
                          {option.description}
                        </p>

                      </div>

                      <div
                        className={`
                          flex
                          h-5
                          w-5
                          items-center
                          justify-center
                          rounded-full
                          border-2
                          ${
                            selected
                              ? "border-black"
                              : "border-gray-300"
                          }
                        `}
                      >

                        {selected && (

                          <div className="h-2.5 w-2.5 rounded-full bg-black" />

                        )}

                      </div>

                    </button>

                  );

                })}

              </div>

            </div>


            

            {message && (

              <div
                className={`
                  mb-6
                  rounded-xl
                  border
                  px-4
                  py-3
                  text-sm
                  ${
                    message.includes("success")
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-red-200 bg-red-50 text-red-700"
                  }
                `}
              >
                {message}
              </div>

            )}


            

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-xl
                bg-black
                px-5
                py-4
                font-bold
                text-white
                transition
                hover:bg-gray-800
                hover:shadow-lg
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {loading ? (

                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                  Creating Reel...

                </>

              ) : (

                <>
                  <FaPaperPlane />

                  Publish Reel

                </>

              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}