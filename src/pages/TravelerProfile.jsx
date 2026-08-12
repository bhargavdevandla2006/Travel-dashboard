import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiUrl from "../services/api";

import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPlane,
  FaHeart,
  FaMoneyBillWave,
  FaUserPlus,
  FaUserCheck,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaGlobe,
  FaShareAlt,
  FaCopy,
  FaCheck,
  FaArrowLeft,
  FaPaperPlane,
} from "react-icons/fa";

export default function TravelerProfile() {
  const { id } = useParams();

  const [user, setUser] = useState(null);

  const [following, setFollowing] = useState(false);

  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [followers, setFollowers] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(false);
  const [tripsError, setTripsError] = useState("");

  const [copied, setCopied] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    loadEverything();
  }, [id]);

  // =========================================================
  // LOAD EVERYTHING
  // =========================================================

  async function loadEverything() {
    setProfileLoading(true);
    setError("");

    await Promise.all([
      loadUser(),
      loadCurrentUser(),
      loadFollowers(),
      loadFollowing(),
      loadTrips(),
    ]);

    setProfileLoading(false);
  }

  // =========================================================
  // LOAD USER
  // =========================================================

  async function loadUser() {
    try {
      const response = await fetch(`${apiUrl}/users/${id}`);

      if (!response.ok) {
        throw new Error("Failed to load traveler");
      }

      const data = await response.json();

      setUser(data);
    } catch (err) {
      console.error("Load user error:", err);

      setError("Unable to load this traveler.");
    }
  }

  // =========================================================
  // LOAD CURRENT LOGGED-IN USER
  // =========================================================

  async function loadCurrentUser() {
    try {
      const response = await fetch(`${apiUrl}/profile`, {
        credentials: "include",
      });

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const currentUser = await response.json();

      const self =
        String(currentUser.id) === String(id);

      setIsOwnProfile(self);

      if (!self) {
        await checkStatus();
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Current user error:", err);

      setLoading(false);
    }
  }

  // =========================================================
  // CHECK FOLLOW STATUS
  // =========================================================

  async function checkStatus() {
    try {
      const response = await fetch(
        `${apiUrl}/follow-status/${id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to check follow status");
      }

      const data = await response.json();

      setFollowing(Boolean(data.following));
    } catch (err) {
      console.error("Follow status error:", err);
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // LOAD FOLLOWERS
  // =========================================================

  async function loadFollowers() {
    try {
      const response = await fetch(
        `${apiUrl}/followers-count/${id}`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setFollowers(Number(data.count) || 0);
    } catch (err) {
      console.error("Followers error:", err);
    }
  }

  // =========================================================
  // LOAD FOLLOWING
  // =========================================================

  async function loadFollowing() {
    try {
      const response = await fetch(
        `${apiUrl}/following-count/${id}`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      setFollowingCount(Number(data.count) || 0);
    } catch (err) {
      console.error("Following error:", err);
    }
  }

  // =========================================================
  // LOAD TRIPS
  // =========================================================

  async function loadTrips() {
    setTripsLoading(true);
    setTripsError("");

    try {
      const response = await fetch(
        `${apiUrl}/users/${id}/trips`
      );

      if (!response.ok) {
        // Do not attempt to parse JSON from a 500 HTML response
        setTrips([]);
        setTripsError(`Unable to load trips (status ${response.status})`);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setTrips(data);
      } else {
        setTrips([]);
        setTripsError("Unexpected trips response");
      }
    } catch (err) {
      console.error("Trips error:", err);

      setTrips([]);
      setTripsError("Network error loading trips");
    } finally {
      setTripsLoading(false);
    }
  }

  // =========================================================
  // FOLLOW
  // =========================================================

  async function handleFollow() {
    if (isOwnProfile || followLoading) {
      return;
    }

    try {
      setFollowLoading(true);

      const response = await fetch(
        `${apiUrl}/follow/${id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to follow user"
        );
      }

      setFollowing(true);

      // Immediately update UI
      setFollowers((prev) => prev + 1);

      await loadFollowers();
      await loadFollowing();
    } catch (err) {
      console.error("Follow error:", err);

      alert(err.message || "Unable to follow this traveler.");
    } finally {
      setFollowLoading(false);
    }
  }

  // =========================================================
  // UNFOLLOW
  // =========================================================

  async function handleUnfollow() {
    if (isOwnProfile || followLoading) {
      return;
    }

    try {
      setFollowLoading(true);

      const response = await fetch(
        `${apiUrl}/unfollow/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to unfollow user"
        );
      }

      setFollowing(false);

      setFollowers((prev) =>
        Math.max(0, prev - 1)
      );

      await loadFollowers();
      await loadFollowing();
    } catch (err) {
      console.error("Unfollow error:", err);

      alert(
        err.message ||
          "Unable to unfollow this traveler."
      );
    } finally {
      setFollowLoading(false);
    }
  }

  // =========================================================
  // SHARE PROFILE
  // =========================================================

  async function handleShare() {
    const profileUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user?.name || "Traveler"} | TravelHub`,
          text: `Check out ${user?.name}'s TravelHub profile.`,
          url: profileUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(profileUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Share error:", err);
    }
  }

  // =========================================================
  // COPY PROFILE LINK
  // =========================================================

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy error:", err);
    }
  }

  // =========================================================
  // SOCIAL URL BUILDER
  // =========================================================

  function getSocialUrl(platform, value) {
    if (!value) {
      return null;
    }

    let username = String(value).trim();

    if (!username) {
      return null;
    }

    // Already a full URL
    if (
      username.startsWith("http://") ||
      username.startsWith("https://")
    ) {
      return username;
    }

    // Remove @ if user saved @username
    username = username.replace(/^@/, "");

    switch (platform) {
      case "instagram":
        return `https://instagram.com/${username}`;

      case "facebook":
        return `https://facebook.com/${username}`;

      case "twitter":
        return `https://x.com/${username}`;

      case "linkedin":
        return `https://linkedin.com/in/${username}`;

      case "youtube":
        return `https://youtube.com/@${username}`;

      case "tiktok":
        return `https://tiktok.com/@${username}`;

      case "website":
        return `https://${username}`;

      default:
        return username;
    }
  }

  // =========================================================
  // OPEN SOCIAL
  // =========================================================

  function openSocial(platform, value) {
    const url = getSocialUrl(platform, value);

    if (!url) {
      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  // =========================================================
  // SOCIAL BUTTON
  // =========================================================

  function SocialButton({
    platform,
    value,
    icon,
    label,
    className,
  }) {
    if (!value) {
      return null;
    }

    return (
      <button
        type="button"
        onClick={() =>
          openSocial(platform, value)
        }
        title={`Open ${label}`}
        aria-label={`Open ${label}`}
        className={`
          ${className}
          group
          relative
          w-11
          h-11
          rounded-full
          flex
          items-center
          justify-center
          text-white
          text-lg
          shadow-lg
          hover:scale-110
          hover:-translate-y-1
          active:scale-95
          transition-all
          duration-200
        `}
      >
        {icon}

        <span
          className="
            pointer-events-none
            absolute
            -bottom-9
            left-1/2
            -translate-x-1/2
            whitespace-nowrap
            rounded-lg
            bg-black
            px-2
            py-1
            text-[10px]
            text-white
            opacity-0
            group-hover:opacity-100
            transition
            z-50
          "
        >
          {label}
        </span>
      </button>
    );
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (profileLoading || !user) {
    return (
      <div
        className="
          min-h-screen
          bg-[#f8fafc]
          dark:bg-[#020617]
          flex
          items-center
          justify-center
        "
      >
        <div className="text-center">
          <div
            className="
              w-16
              h-16
              rounded-full
              border-4
              border-blue-200
              border-t-blue-600
              animate-spin
              mx-auto
            "
          />

          <p
            className="
              mt-5
              text-gray-600
              dark:text-gray-300
              font-medium
            "
          >
            Loading traveler profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error && !user) {
    return (
      <div
        className="
          min-h-screen
          bg-[#f8fafc]
          dark:bg-[#020617]
          flex
          items-center
          justify-center
          p-6
        "
      >
        <div
          className="
            max-w-md
            w-full
            bg-white
            dark:bg-[#0f172a]
            rounded-3xl
            shadow-xl
            p-10
            text-center
          "
        >
          <div className="text-5xl mb-5">
            😕
          </div>

          <h1 className="text-2xl font-bold">
            Traveler not found
          </h1>

          <p className="text-gray-500 mt-3">
            We couldn't load this traveler's profile.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // DATA
  // =========================================================

  const displayPhoto =
    user.photo ||
    "https://i.pravatar.cc/500";

  const coverPhoto =
    user.coverPhoto ||
    user.cover_image ||
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80";

  const location = [
    user.city,
    user.state,
    user.country,
  ]
    .filter(Boolean)
    .join(", ");

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div
      className="
        min-h-screen
        bg-[#f6f8fc]
        dark:bg-[#020617]
        text-gray-900
        dark:text-white
      "
    >
      <div className="flex min-h-screen">

        {/* =====================================================
            SIDEBAR
        ====================================================== */}

        <Sidebar />

        {/* =====================================================
            MAIN
        ====================================================== */}

        <main className="flex-1 min-w-0">

          <div className="p-4 lg:p-6">

            <Navbar />

            {/* =================================================
                BACK BUTTON
            ================================================== */}

            <div className="mt-5">
              <button
                type="button"
                onClick={() =>
                  window.history.back()
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-semibold
                  text-gray-500
                  hover:text-blue-600
                  dark:text-gray-400
                  dark:hover:text-blue-400
                  transition
                "
              >
                <FaArrowLeft />

                Back
              </button>
            </div>

            {/* =================================================
                HERO PROFILE
            ================================================== */}

            <section
              className="
                relative
                overflow-hidden
                rounded-[32px]
                mt-5
                min-h-[330px]
                shadow-2xl
                group
              "
            >

              {/* COVER IMAGE */}

              <img
                src={coverPhoto}
                alt="Travel cover"
                className="
                  absolute
                  inset-0
                  w-full
                  h-full
                  object-cover
                  transition-transform
                  duration-700
                  group-hover:scale-105
                "
              />

              {/* DARK GRADIENT */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-[#020617]/95
                  via-[#1e1b4b]/75
                  to-[#7c3aed]/30
                "
              />

              {/* COLOR GLOW */}

              <div
                className="
                  absolute
                  -right-20
                  -top-20
                  w-72
                  h-72
                  rounded-full
                  bg-purple-500/30
                  blur-3xl
                "
              />

              <div
                className="
                  absolute
                  -left-20
                  -bottom-20
                  w-72
                  h-72
                  rounded-full
                  bg-blue-500/30
                  blur-3xl
                "
              />

              {/* CONTENT */}

              <div
                className="
                  relative
                  z-10
                  min-h-[330px]
                  p-6
                  lg:p-10
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-center
                  justify-between
                  gap-8
                "
              >

                {/* PROFILE INFO */}

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    items-start
                    sm:items-center
                    gap-6
                  "
                >

                  {/* PROFILE PHOTO */}

                  <div className="relative shrink-0">

                    <div
                      className="
                        absolute
                        -inset-1
                        rounded-full
                        bg-gradient-to-r
                        from-cyan-400
                        via-blue-500
                        to-purple-600
                        blur-sm
                      "
                    />

                    <img
                      src={displayPhoto}
                      alt={user.name || "Traveler"}
                      className="
                        relative
                        w-32
                        h-32
                        lg:w-40
                        lg:h-40
                        rounded-full
                        object-cover
                        border-4
                        border-white
                        shadow-2xl
                      "
                    />

                    {/* ONLINE DOT */}

                    <span
                      className="
                        absolute
                        right-3
                        bottom-3
                        w-5
                        h-5
                        rounded-full
                        bg-emerald-500
                        border-4
                        border-white
                      "
                    />

                  </div>

                  {/* INFORMATION */}

                  <div className="text-white">

                    <div className="flex items-center gap-3">

                      <h1
                        className="
                          text-3xl
                          lg:text-4xl
                          font-black
                          tracking-tight
                        "
                      >
                        {user.name}
                      </h1>

                      <span
                        className="
                          w-6
                          h-6
                          rounded-full
                          bg-blue-500
                          flex
                          items-center
                          justify-center
                          text-xs
                          font-bold
                          shadow-lg
                        "
                        title="Verified traveler"
                      >
                        ✓
                      </span>

                    </div>

                    <p
                      className="
                        mt-2
                        text-white/80
                        font-medium
                      "
                    >
                      Explorer • Traveler •
                      Adventure Lover ✈️
                    </p>

                    {/* EMAIL */}

                    <p
                      className="
                        mt-5
                        flex
                        items-center
                        gap-2
                        text-sm
                        text-white/90
                      "
                    >
                      <FaEnvelope />

                      {user.email}
                    </p>

                    {/* LOCATION */}

                    {location && (
                      <p
                        className="
                          mt-2
                          flex
                          items-center
                          gap-2
                          text-sm
                          text-white/90
                        "
                      >
                        <FaMapMarkerAlt />

                        {location}
                      </p>
                    )}

                    {/* SOCIAL MEDIA */}

                    <div
                      className="
                        mt-6
                        flex
                        flex-wrap
                        items-center
                        gap-3
                      "
                    >

                      <SocialButton
                        platform="instagram"
                        value={user.instagram}
                        label="Instagram"
                        icon={<FaInstagram />}
                        className="
                          bg-gradient-to-tr
                          from-yellow-400
                          via-pink-500
                          to-purple-600
                        "
                      />

                      <SocialButton
                        platform="facebook"
                        value={user.facebook}
                        label="Facebook"
                        icon={<FaFacebook />}
                        className="bg-[#1877F2]"
                      />

                      <SocialButton
                        platform="twitter"
                        value={
                          user.twitter ||
                          user.x ||
                          user.twitter_url
                        }
                        label="X / Twitter"
                        icon={<FaTwitter />}
                        className="bg-black"
                      />

                      <SocialButton
                        platform="linkedin"
                        value={user.linkedin}
                        label="LinkedIn"
                        icon={<FaLinkedin />}
                        className="bg-[#0A66C2]"
                      />

                      <SocialButton
                        platform="youtube"
                        value={user.youtube}
                        label="YouTube"
                        icon={<FaYoutube />}
                        className="bg-[#FF0000]"
                      />

                      <SocialButton
                        platform="tiktok"
                        value={user.tiktok}
                        label="TikTok"
                        icon={<FaTiktok />}
                        className="bg-black"
                      />

                      <SocialButton
                        platform="website"
                        value={
                          user.website ||
                          user.website_url
                        }
                        label="Website"
                        icon={<FaGlobe />}
                        className="bg-indigo-600"
                      />

                    </div>

                  </div>
                </div>

                {/* ACTIONS */}

                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-3
                  "
                >

                  {/* SHARE */}

                  <button
                    type="button"
                    onClick={handleShare}
                    className="
                      h-12
                      px-5
                      rounded-2xl
                      bg-white/15
                      backdrop-blur-xl
                      border
                      border-white/20
                      text-white
                      font-semibold
                      flex
                      items-center
                      gap-2
                      hover:bg-white/25
                      transition
                    "
                  >
                    {copied ? (
                      <FaCheck />
                    ) : (
                      <FaShareAlt />
                    )}

                    {copied
                      ? "Copied!"
                      : "Share"}
                  </button>

                  {/* COPY */}

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="
                      w-12
                      h-12
                      rounded-2xl
                      bg-white/15
                      backdrop-blur-xl
                      border
                      border-white/20
                      text-white
                      flex
                      items-center
                      justify-center
                      hover:bg-white/25
                      transition
                    "
                    title="Copy profile link"
                  >
                    <FaCopy />
                  </button>

                  {/* FOLLOW */}

                  {!isOwnProfile && (
                    <button
                      type="button"
                      onClick={
                        following
                          ? handleUnfollow
                          : handleFollow
                      }
                      disabled={followLoading}
                      className={`
                        h-12
                        px-6
                        rounded-2xl
                        font-bold
                        flex
                        items-center
                        gap-2
                        shadow-xl
                        transition-all
                        duration-200

                        ${
                          following
                            ? `
                              bg-white
                              text-gray-800
                              hover:bg-red-50
                              hover:text-red-600
                            `
                            : `
                              bg-blue-600
                              text-white
                              hover:bg-blue-500
                              hover:scale-105
                            `
                        }

                        ${
                          followLoading
                            ? "opacity-60 cursor-not-allowed"
                            : ""
                        }
                      `}
                    >

                      {following ? (
                        <FaUserCheck />
                      ) : (
                        <FaUserPlus />
                      )}

                      {followLoading
                        ? "Please wait..."
                        : following
                          ? "Following"
                          : "Follow"}

                    </button>
                  )}

                  {/* OWN PROFILE */}

                  {isOwnProfile && (
                    <div
                      className="
                        h-12
                        px-6
                        rounded-2xl
                        bg-white/20
                        backdrop-blur-xl
                        border
                        border-white/20
                        text-white
                        font-semibold
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <FaUserCheck />

                      Your Profile
                    </div>
                  )}

                </div>

              </div>

            </section>

            {/* =================================================
                STATS
            ================================================== */}

            <section
              className="
                grid
                grid-cols-2
                lg:grid-cols-4
                gap-4
                lg:gap-6
                mt-6
              "
            >

              {/* FOLLOWERS */}

              <div
                className="
                  bg-white
                  dark:bg-[#0f172a]
                  rounded-3xl
                  p-6
                  shadow-lg
                  border
                  border-gray-100
                  dark:border-gray-800
                  hover:-translate-y-1
                  transition
                "
              >
                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-blue-50
                    dark:bg-blue-500/10
                    flex
                    items-center
                    justify-center
                    text-blue-600
                    text-xl
                  "
                >
                  <FaPlane />
                </div>

                <h2
                  className="
                    text-3xl
                    font-black
                    mt-4
                  "
                >
                  {followers}
                </h2>

                <p className="text-gray-500 mt-1">
                  Followers
                </p>
              </div>

              {/* FOLLOWING */}

              <div
                className="
                  bg-white
                  dark:bg-[#0f172a]
                  rounded-3xl
                  p-6
                  shadow-lg
                  border
                  border-gray-100
                  dark:border-gray-800
                  hover:-translate-y-1
                  transition
                "
              >
                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-red-50
                    dark:bg-red-500/10
                    flex
                    items-center
                    justify-center
                    text-red-500
                    text-xl
                  "
                >
                  <FaHeart />
                </div>

                <h2
                  className="
                    text-3xl
                    font-black
                    mt-4
                  "
                >
                  {followingCount}
                </h2>

                <p className="text-gray-500 mt-1">
                  Following
                </p>
              </div>

              {/* SPENDING */}

              <div
                className="
                  bg-white
                  dark:bg-[#0f172a]
                  rounded-3xl
                  p-6
                  shadow-lg
                  border
                  border-gray-100
                  dark:border-gray-800
                  hover:-translate-y-1
                  transition
                "
              >
                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-green-50
                    dark:bg-green-500/10
                    flex
                    items-center
                    justify-center
                    text-green-600
                    text-xl
                  "
                >
                  <FaMoneyBillWave />
                </div>

                <h2
                  className="
                    text-3xl
                    font-black
                    mt-4
                  "
                >
                  {user.spending ||
                    user.total_spending ||
                    "₹52K"}
                </h2>

                <p className="text-gray-500 mt-1">
                  Travel Spending
                </p>
              </div>

              {/* COUNTRIES */}

              <div
                className="
                  bg-white
                  dark:bg-[#0f172a]
                  rounded-3xl
                  p-6
                  shadow-lg
                  border
                  border-gray-100
                  dark:border-gray-800
                  hover:-translate-y-1
                  transition
                "
              >
                <div
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-purple-50
                    dark:bg-purple-500/10
                    flex
                    items-center
                    justify-center
                    text-xl
                  "
                >
                  🌍
                </div>

                <h2
                  className="
                    text-3xl
                    font-black
                    mt-4
                  "
                >
                  {user.countries ||
                    user.countries_visited ||
                    7}
                </h2>

                <p className="text-gray-500 mt-1">
                  Countries
                </p>
              </div>

            </section>

            {/* =================================================
                ABOUT
            ================================================== */}

            <section
              className="
                mt-6
                bg-white
                dark:bg-[#0f172a]
                rounded-3xl
                p-7
                lg:p-8
                shadow-lg
                border
                border-gray-100
                dark:border-gray-800
              "
            >

              <div className="flex items-center gap-3">

                <div
                  className="
                    w-11
                    h-11
                    rounded-2xl
                    bg-gradient-to-br
                    from-blue-500
                    to-purple-600
                    flex
                    items-center
                    justify-center
                    text-white
                    font-bold
                  "
                >
                  ✨
                </div>

                <h2
                  className="
                    text-2xl
                    font-black
                  "
                >
                  About Traveler
                </h2>

              </div>

              <p
                className="
                  mt-5
                  text-gray-600
                  dark:text-gray-300
                  leading-8
                "
              >
                {user.bio ||
                  user.about ||
                  "Passionate traveler who loves exploring new cultures, mountains, beaches and food around the world."}
              </p>

            </section>

            {/* =================================================
                CONTACT / MESSAGE
            ================================================== */}

            <section
              className="
                mt-6
                rounded-3xl
                p-6
                bg-gradient-to-r
                from-blue-600
                to-purple-600
                text-white
                shadow-xl
                flex
                flex-col
                md:flex-row
                md:items-center
                justify-between
                gap-5
              "
            >

              <div>

                <h2 className="text-xl font-bold">
                  Want to connect with {user.name}?
                </h2>

                <p className="text-white/75 mt-1">
                  Start a conversation and plan
                  your next adventure.
                </p>

              </div>

              <a
                href={`mailto:${user.email}?subject=TravelHub%20Connection`}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-6
                  py-3
                  rounded-2xl
                  bg-white
                  text-blue-700
                  font-bold
                  hover:scale-105
                  transition
                  shadow-lg
                "
              >
                <FaPaperPlane />

                Message
              </a>

            </section>

            {/* =================================================
                TRIPS
            ================================================== */}

            <section className="mt-8">

              <div
                className="
                  flex
                  items-end
                  justify-between
                  gap-4
                  mb-5
                "
              >

                <div>

                  <p
                    className="
                      text-sm
                      text-blue-600
                      font-bold
                      uppercase
                      tracking-widest
                    "
                  >
                    Travel Journal
                  </p>

                  <h2
                    className="
                      text-3xl
                      font-black
                      mt-1
                    "
                  >
                    Trips by {user.name}
                  </h2>

                </div>

                <span
                  className="
                    hidden
                    sm:block
                    text-sm
                    text-gray-500
                  "
                >
                  {trips.length}{" "}
                  {trips.length === 1
                    ? "trip"
                    : "trips"}
                </span>

              </div>

              {trips.length === 0 ? (

                <div
                  className="
                    bg-white
                    dark:bg-[#0f172a]
                    rounded-3xl
                    border
                    border-dashed
                    border-gray-300
                    dark:border-gray-700
                    p-12
                    text-center
                  "
                >

                  <div className="text-6xl">
                    🧳
                  </div>

                  <h3
                    className="
                      text-xl
                      font-bold
                      mt-4
                    "
                  >
                    No trips yet
                  </h3>

                  <p
                    className="
                      text-gray-500
                      dark:text-gray-400
                      mt-2
                    "
                  >
                    {user.name} hasn't shared
                    any trips yet.
                  </p>

                </div>

              ) : (

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-6
                  "
                >

                  {trips.map((trip) => (

                    <article
                      key={trip.id}
                      className="
                        group
                        bg-white
                        dark:bg-[#0f172a]
                        rounded-3xl
                        overflow-hidden
                        shadow-lg
                        border
                        border-gray-100
                        dark:border-gray-800
                        hover:-translate-y-2
                        transition-all
                        duration-300
                      "
                    >

                      {/* TRIP IMAGE */}

                      <div
                        className="
                          relative
                          h-56
                          overflow-hidden
                        "
                      >

                        <img
                          src={
                            trip.image ||
                            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80"
                          }
                          alt={trip.title || "Trip"}
                          className="
                            w-full
                            h-full
                            object-cover
                            group-hover:scale-110
                            transition-transform
                            duration-700
                          "
                        />

                        <div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-black/60
                            to-transparent
                          "
                        />

                        <div
                          className="
                            absolute
                            bottom-4
                            left-4
                            right-4
                            text-white
                          "
                        >

                          <p
                            className="
                              text-xs
                              uppercase
                              tracking-widest
                              text-white/70
                            "
                          >
                            Adventure
                          </p>

                          <h3
                            className="
                              text-xl
                              font-black
                              mt-1
                            "
                          >
                            {trip.title}
                          </h3>

                        </div>

                      </div>

                      {/* TRIP DETAILS */}

                      <div className="p-5">

                        <p
                          className="
                            text-gray-600
                            dark:text-gray-300
                            flex
                            items-center
                            gap-2
                          "
                        >
                          <FaMapMarkerAlt
                            className="text-blue-500"
                          />

                          {trip.location ||
                            "Unknown location"}
                        </p>

                        {trip.price && (
                          <div
                            className="
                              mt-4
                              flex
                              items-center
                              justify-between
                            "
                          >

                            <span
                              className="
                                text-xs
                                uppercase
                                tracking-wider
                                text-gray-400
                              "
                            >
                              Trip Cost
                            </span>

                            <span
                              className="
                                text-lg
                                font-black
                                text-blue-600
                              "
                            >
                              ₹ {trip.price}
                            </span>

                          </div>
                        )}

                      </div>

                    </article>

                  ))}

                </div>

              )}

            </section>


            <div className="h-10" />

          </div>

        </main>

      </div>
    </div>
  );
}