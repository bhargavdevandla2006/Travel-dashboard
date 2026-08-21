import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaBookmark,
  FaRegBookmark,
  FaPlay,
  FaTimes,
  FaUser,
  FaPlus,
  FaVideo,
} from "react-icons/fa";

import apiUrl from "../services/apiUrl";

export default function ReelsSection({
  userId,
  currentUserId,
  isOwnProfile = false,
}) {
  const navigate = useNavigate();

  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedReel, setSelectedReel] = useState(null);

  const [likedReels, setLikedReels] = useState([]);
  const [savedReels, setSavedReels] = useState([]);

  const [highlights, setHighlights] = useState([]);
  const [showHighlightModal, setShowHighlightModal] =
    useState(false);

  const [highlightTitle, setHighlightTitle] = useState("");

  /* =====================================================
     LOAD REELS
  ===================================================== */

  useEffect(() => {
    loadReels();

    if (currentUserId) {
      loadLikedReels();
      loadSavedReels();
    }

    if (isOwnProfile) {
      loadHighlights();
    }
  }, [userId, currentUserId, isOwnProfile]);

  /* =====================================================
     GET USER REELS
  ===================================================== */

  const loadReels = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${apiUrl}/users/${userId}/reels`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setReels(Array.isArray(data) ? data : []);
      } else {
        setReels([]);
      }
    } catch (error) {
      console.error("Failed to load reels:", error);
      setReels([]);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD LIKED REELS
  ===================================================== */

  const loadLikedReels = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/liked-reels`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setLikedReels(
          data.map((reel) => reel.id)
        );
      }
    } catch (error) {
      console.error(
        "Failed to load liked reels:",
        error
      );
    }
  };

  /* =====================================================
     LOAD SAVED REELS
  ===================================================== */

  const loadSavedReels = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/saved-reels`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setSavedReels(
          data.map((reel) => reel.id)
        );
      }
    } catch (error) {
      console.error(
        "Failed to load saved reels:",
        error
      );
    }
  };

  /* =====================================================
     LOAD HIGHLIGHTS
  ===================================================== */

  const loadHighlights = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/highlights`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setHighlights(
          Array.isArray(data) ? data : []
        );
      }
    } catch (error) {
      console.error(
        "Failed to load highlights:",
        error
      );
    }
  };

  /* =====================================================
     LIKE / UNLIKE
  ===================================================== */

  const handleLike = async (
    reel,
    event
  ) => {
    event.stopPropagation();

    const alreadyLiked =
      likedReels.includes(reel.id);

    try {
      const endpoint = alreadyLiked
        ? `${apiUrl}/reels/${reel.id}/unlike`
        : `${apiUrl}/reels/${reel.id}/like`;

      const method = alreadyLiked
        ? "DELETE"
        : "POST";

      const response = await fetch(
        endpoint,
        {
          method,
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Something went wrong"
        );
        return;
      }

      if (alreadyLiked) {
        setLikedReels((prev) =>
          prev.filter(
            (id) => id !== reel.id
          )
        );
      } else {
        setLikedReels((prev) => [
          ...prev,
          reel.id,
        ]);
      }
    } catch (error) {
      console.error(
        "Like error:",
        error
      );
    }
  };

  /* =====================================================
     SAVE / UNSAVE
  ===================================================== */

  const handleSave = async (
    reel,
    event
  ) => {
    event.stopPropagation();

    const alreadySaved =
      savedReels.includes(reel.id);

    try {
      const endpoint = alreadySaved
        ? `${apiUrl}/reels/${reel.id}/unsave`
        : `${apiUrl}/reels/${reel.id}/save`;

      const method = alreadySaved
        ? "DELETE"
        : "POST";

      const response = await fetch(
        endpoint,
        {
          method,
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to save reel"
        );
        return;
      }

      if (alreadySaved) {
        setSavedReels((prev) =>
          prev.filter(
            (id) => id !== reel.id
          )
        );
      } else {
        setSavedReels((prev) => [
          ...prev,
          reel.id,
        ]);
      }
    } catch (error) {
      console.error(
        "Save error:",
        error
      );
    }
  };

  /* =====================================================
     OPEN REEL
  ===================================================== */

  const openReel = (reel) => {
    setSelectedReel(reel);
  };

  /* =====================================================
     CLOSE REEL
  ===================================================== */

  const closeReel = () => {
    setSelectedReel(null);
  };

  /* =====================================================
     CREATE HIGHLIGHT
  ===================================================== */

  const createHighlight = async () => {
    if (!highlightTitle.trim()) {
      alert("Enter highlight name brooo");
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/highlights`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            title: highlightTitle,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to create highlight"
        );
        return;
      }

      setHighlightTitle("");

      setShowHighlightModal(false);

      loadHighlights();
    } catch (error) {
      console.error(
        "Create highlight error:",
        error
      );
    }
  };

  /* =====================================================
     ADD REEL TO HIGHLIGHT
  ===================================================== */

  const addReelToHighlight = async (
    highlightId,
    reelId
  ) => {
    try {
      const response = await fetch(
        `${apiUrl}/highlights/${highlightId}/reels`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            reel_id: reelId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Unable to add reel"
        );
        return;
      }

      alert("Reel added to highlight 🔥");

      setShowHighlightModal(false);
    } catch (error) {
      console.error(
        "Highlight reel error:",
        error
      );
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

        Loading reels...
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="w-full">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <FaVideo />

            Travel Reels
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Moments, memories and adventures 🎬
          </p>
        </div>

        {isOwnProfile && (
          <div className="flex gap-3">

            <button
              onClick={() =>
                navigate("/create-reel")
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:scale-105 hover:bg-gray-800"
            >
              <FaPlus />

              Create Reel
            </button>

          </div>
        )}

      </div>

      {/* =========================================
          HIGHLIGHTS
      ========================================= */}

      {isOwnProfile && (
        <div className="mb-8">

          <div className="mb-4 flex items-center justify-between">

            <h3 className="text-lg font-bold">
              Highlights
            </h3>

            <button
              onClick={() =>
                setShowHighlightModal(true)
              }
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold transition hover:bg-gray-100"
            >
              + New Highlight
            </button>

          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">

            {highlights.map(
              (highlight) => (
                <button
                  key={highlight.id}
                  onClick={() =>
                    navigate(
                      `/highlight/${highlight.id}`
                    )
                  }
                  className="flex min-w-[85px] flex-col items-center gap-2"
                >

                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-gray-100">

                    {highlight.cover_image ? (
                      <img
                        src={
                          highlight.cover_image
                        }
                        alt={
                          highlight.title
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaVideo className="text-xl text-gray-600" />
                    )}

                  </div>

                  <span className="max-w-[90px] truncate text-xs font-medium">
                    {highlight.title}
                  </span>

                </button>
              )
            )}

            {highlights.length === 0 && (
              <p className="text-sm text-gray-400">
                Create your first highlight ⭐
              </p>
            )}

          </div>

        </div>
      )}

      {/* =========================================
          NO REELS
      ========================================= */}

      {reels.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">

          <FaVideo className="mx-auto mb-4 text-5xl text-gray-300" />

          <h3 className="text-xl font-bold">
            No reels yet
          </h3>

          <p className="mt-2 text-gray-500">
            Start sharing your travel stories 🎥
          </p>

          {isOwnProfile && (
            <button
              onClick={() =>
                navigate("/create-reel")
              }
              className="mt-5 rounded-xl bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Create Your First Reel
            </button>
          )}

        </div>
      ) : (

        /* =========================================
            REELS GRID
        ========================================= */

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">

          {reels.map((reel) => {

            const isLiked =
              likedReels.includes(reel.id);

            const isSaved =
              savedReels.includes(reel.id);

            return (
              <div
                key={reel.id}
                onClick={() =>
                  openReel(reel)
                }
                className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-2xl bg-black shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >

                {/* Thumbnail */}

                {reel.thumbnail ? (
                  <img
                    src={reel.thumbnail}
                    alt={
                      reel.title ||
                      "Travel reel"
                    }
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                ) : reel.video_url ? (
                  <video
                    src={reel.video_url}
                    className="h-full w-full object-cover"
                    muted
                    preload="metadata"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-white">
                    <FaVideo className="text-4xl" />
                  </div>
                )}

                {/* Overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Play */}

                <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black shadow-lg transition group-hover:scale-110">
                  <FaPlay className="ml-1" />
                </div>

                {/* Bottom */}

                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">

                  <h3 className="truncate text-sm font-bold">
                    {reel.title ||
                      "Untitled Reel"}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs text-gray-300">
                    {reel.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between">

                    <button
                      onClick={(event) =>
                        handleLike(
                          reel,
                          event
                        )
                      }
                      className="flex items-center gap-1 text-sm transition hover:scale-110"
                    >
                      {isLiked ? (
                        <FaHeart className="text-red-500" />
                      ) : (
                        <FaRegHeart />
                      )}

                      <span>
                        {reel.likes_count ||
                          0}
                      </span>
                    </button>

                    <button
                      onClick={(event) =>
                        handleSave(
                          reel,
                          event
                        )
                      }
                      className="transition hover:scale-110"
                    >
                      {isSaved ? (
                        <FaBookmark />
                      ) : (
                        <FaRegBookmark />
                      )}
                    </button>

                  </div>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {/* =========================================
          REEL MODAL
      ========================================= */}

      {selectedReel && (
        <div
          onClick={closeReel}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >

          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="relative flex max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
          >

            {/* Close */}

            <button
              onClick={closeReel}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black"
            >
              <FaTimes />
            </button>

            {/* Video */}

            <div className="flex min-h-[500px] flex-1 items-center justify-center bg-black">

              {selectedReel.video_url ? (
                <video
                  src={
                    selectedReel.video_url
                  }
                  controls
                  autoPlay
                  className="max-h-[85vh] w-full"
                />
              ) : selectedReel.thumbnail ? (
                <img
                  src={
                    selectedReel.thumbnail
                  }
                  alt={
                    selectedReel.title
                  }
                  className="max-h-[85vh] w-full object-contain"
                />
              ) : (
                <FaVideo className="text-6xl text-white" />
              )}

            </div>

            {/* Desktop Details */}

            <div className="hidden w-80 flex-col border-l p-6 md:flex">

              <button
                onClick={() => {
                  if (
                    selectedReel.user_id
                  ) {
                    navigate(
                      `/profile/${selectedReel.user_id}`
                    );
                  }
                }}
                className="mb-6 flex items-center gap-3 text-left"
              >

                {selectedReel.user_photo ? (
                  <img
                    src={
                      selectedReel.user_photo
                    }
                    alt={
                      selectedReel.user_name
                    }
                    className="h-11 w-11 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-200">
                    <FaUser />
                  </div>
                )}

                <div>

                  <p className="font-bold">
                    {selectedReel.user_name ||
                      "Traveler"}
                  </p>

                  <p className="text-xs text-gray-500">
                    View profile
                  </p>

                </div>

              </button>

              <h2 className="text-xl font-bold">
                {selectedReel.title ||
                  "Travel Reel"}
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {
                  selectedReel.description
                }
              </p>

              <div className="mt-auto flex items-center justify-between border-t pt-5">

                <button
                  onClick={(event) =>
                    handleLike(
                      selectedReel,
                      event
                    )
                  }
                  className="flex items-center gap-2 text-lg"
                >

                  {likedReels.includes(
                    selectedReel.id
                  ) ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart />
                  )}

                  Like

                </button>

                <button
                  onClick={(event) =>
                    handleSave(
                      selectedReel,
                      event
                    )
                  }
                  className="text-xl"
                >

                  {savedReels.includes(
                    selectedReel.id
                  ) ? (
                    <FaBookmark />
                  ) : (
                    <FaRegBookmark />
                  )}

                </button>

              </div>

              {/* Add To Highlight */}

              {isOwnProfile && (
                <div className="mt-5">

                  <p className="mb-3 text-sm font-semibold">
                    Add to Highlight
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {highlights.map(
                      (highlight) => (
                        <button
                          key={
                            highlight.id
                          }
                          onClick={() =>
                            addReelToHighlight(
                              highlight.id,
                              selectedReel.id
                            )
                          }
                          className="rounded-lg border px-3 py-2 text-xs font-semibold transition hover:bg-gray-100"
                        >
                          {highlight.title}
                        </button>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* =========================================
          CREATE HIGHLIGHT MODAL
      ========================================= */}

      {showHighlightModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">

          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">

            <div className="mb-5 flex items-center justify-between">

              <h2 className="text-xl font-bold">
                Create Highlight ⭐
              </h2>

              <button
                onClick={() =>
                  setShowHighlightModal(false)
                }
                className="text-xl"
              >
                <FaTimes />
              </button>

            </div>

            <input
              type="text"
              value={highlightTitle}
              onChange={(event) =>
                setHighlightTitle(
                  event.target.value
                )
              }
              placeholder="Example: Goa Memories"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-black"
            />

            <div className="mt-5 flex gap-3">

              <button
                onClick={createHighlight}
                className="flex-1 rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-gray-800"
              >
                Create
              </button>

              <button
                onClick={() =>
                  setShowHighlightModal(false)
                }
                className="rounded-xl border px-5 py-3 font-semibold"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}