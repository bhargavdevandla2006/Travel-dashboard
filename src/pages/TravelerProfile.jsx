import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

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
  FaWhatsapp,
  FaGlobe,
  FaShareAlt,
  FaCopy,
  FaCheck,
  FaArrowLeft,
  FaPaperPlane,
  FaLink,
} from "react-icons/fa";

/* =========================================================
   SOCIAL URL BUILDER
========================================================= */

function getSocialUrl(platform, value) {
  if (!value) return null;

  let username = String(value).trim();

  if (!username) return null;

  // Already a complete URL
  if (
    username.startsWith("http://") ||
    username.startsWith("https://")
  ) {
    return username;
  }

  // Remove @ if entered
  username = username.replace(/^@/, "");

  switch (platform) {
    case "instagram":
      return `https://www.instagram.com/${username}/`;

    case "facebook":
      return `https://www.facebook.com/${username}`;

    case "twitter":
      return `https://x.com/${username}`;

    case "linkedin":
      return `https://www.linkedin.com/in/${username}`;

    case "youtube":
      return `https://www.youtube.com/@${username}`;

    case "tiktok":
      return `https://www.tiktok.com/@${username}`;

    case "whatsapp":
      // If only a phone number is stored
      return `https://wa.me/${username.replace(/[^\d]/g, "")}`;

    case "website":
      return `https://${username}`;

    default:
      return null;
  }
}

/* =========================================================
   SOCIAL BUTTON
========================================================= */

function SocialButton({
  platform,
  value,
  icon,
  label,
  className = "",
}) {
  if (!value) return null;

  function handleClick() {
    const url = getSocialUrl(platform, value);

    if (!url) return;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={`Open ${label}`}
      aria-label={`Open ${label}`}
      className={`
        group
        relative
        w-10
        h-10
        rounded-xl
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
        ${className}
      `}
    >
      {icon}

      <span
        className="
          pointer-events-none
          absolute
          -bottom-8
          left-1/2
          -translate-x-1/2
          whitespace-nowrap
          rounded-md
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

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function TravelerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [following, setFollowing] = useState(false);

  const [profileLoading, setProfileLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);

  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [followers, setFollowers] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [trips, setTrips] = useState([]);
  const [tripsLoading, setTripsLoading] = useState(false);

  const [copied, setCopied] = useState(false);

  const [error, setError] = useState("");

  /* =========================================================
     LOAD
  ========================================================= */

  useEffect(() => {
    if (!id) return;

    loadEverything();
  }, [id]);

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

  /* =========================================================
     LOAD USER
  ========================================================= */

  async function loadUser() {
    try {
      const response = await fetch(
        `${apiUrl}/users/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to load traveler");
      }

      const data = await response.json();

      setUser(data);
    } catch (err) {
      console.error("Load user error:", err);

      setError(
        "Unable to load this traveler."
      );
    }
  }

  /* =========================================================
     CURRENT USER
  ========================================================= */

  async function loadCurrentUser() {
    try {
      const response = await fetch(
        `${apiUrl}/profile`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        return;
      }

      const currentUser =
        await response.json();

      const self =
        String(currentUser.id) ===
        String(id);

      setIsOwnProfile(self);

      if (!self) {
        await checkStatus();
      }
    } catch (err) {
      console.error(
        "Current user error:",
        err
      );
    }
  }

  /* =========================================================
     FOLLOW STATUS
  ========================================================= */

  async function checkStatus() {
    try {
      const response = await fetch(
        `${apiUrl}/follow-status/${id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) return;

      const data =
        await response.json();

      setFollowing(
        Boolean(data.following)
      );
    } catch (err) {
      console.error(
        "Follow status error:",
        err
      );
    }
  }

  /* =========================================================
     FOLLOWERS
  ========================================================= */

  async function loadFollowers() {
    try {
      const response = await fetch(
        `${apiUrl}/followers-count/${id}`
      );

      if (!response.ok) return;

      const data =
        await response.json();

      setFollowers(
        Number(data.count) || 0
      );
    } catch (err) {
      console.error(
        "Followers error:",
        err
      );
    }
  }

  /* =========================================================
     FOLLOWING
  ========================================================= */

  async function loadFollowing() {
    try {
      const response = await fetch(
        `${apiUrl}/following-count/${id}`
      );

      if (!response.ok) return;

      const data =
        await response.json();

      setFollowingCount(
        Number(data.count) || 0
      );
    } catch (err) {
      console.error(
        "Following error:",
        err
      );
    }
  }

  /* =========================================================
     TRIPS
  ========================================================= */

  async function loadTrips() {
    setTripsLoading(true);

    try {
      const response = await fetch(
        `${apiUrl}/users/${id}/trips`
      );

      if (!response.ok) {
        setTrips([]);
        return;
      }

      const data =
        await response.json();

      if (Array.isArray(data)) {
        setTrips(data);
      } else {
        setTrips([]);
      }
    } catch (err) {
      console.error(
        "Trips error:",
        err
      );

      setTrips([]);
    } finally {
      setTripsLoading(false);
    }
  }

  /* =========================================================
     FOLLOW
  ========================================================= */

  async function handleFollow() {
    if (
      isOwnProfile ||
      followLoading
    ) {
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

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to follow user"
        );
      }

      setFollowing(true);

      setFollowers(
        (prev) => prev + 1
      );

      await loadFollowers();
      await loadFollowing();
    } catch (err) {
      console.error(
        "Follow error:",
        err
      );

      alert(
        err.message ||
          "Unable to follow this traveler."
      );
    } finally {
      setFollowLoading(false);
    }
  }

  /* =========================================================
     UNFOLLOW
  ========================================================= */

  async function handleUnfollow() {
    if (
      isOwnProfile ||
      followLoading
    ) {
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

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to unfollow user"
        );
      }

      setFollowing(false);

      setFollowers(
        (prev) =>
          Math.max(0, prev - 1)
      );

      await loadFollowers();
      await loadFollowing();
    } catch (err) {
      console.error(
        "Unfollow error:",
        err
      );

      alert(
        err.message ||
          "Unable to unfollow this traveler."
      );
    } finally {
      setFollowLoading(false);
    }
  }

  /* =========================================================
     PROFILE URL
  ========================================================= */

  function getProfileUrl() {
    if (!user?.id) return "";

    return `${window.location.origin}/traveler/${user.id}`;
  }

  /* =========================================================
     SHARE PROFILE
  ========================================================= */

  async function handleShare() {
    const profileUrl =
      getProfileUrl();

    if (!profileUrl) return;

    try {
      if (
        navigator.share
      ) {
        await navigator.share({
          title: `${user.name} | TravelHub`,
          text: `Check out ${user.name}'s TravelHub profile.`,
          url: profileUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(
        profileUrl
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      console.error(
        "Share error:",
        err
      );
    }
  }

  /* =========================================================
     COPY PROFILE LINK
  ========================================================= */

  async function handleCopyLink() {
    const profileUrl =
      getProfileUrl();

    if (!profileUrl) return;

    try {
      await navigator.clipboard.writeText(
        profileUrl
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      console.error(
        "Copy error:",
        err
      );
    }
  }

  /* =========================================================
     MESSAGE
  ========================================================= */

  function handleMessage() {
    if (
      !id ||
      isOwnProfile
    ) {
      return;
    }

    // If you already have an internal
    // Messages page, this will open it.
    navigate(`/messages/${id}`);
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (profileLoading) {
    return (
      <div
        className="
          min-h-screen
          bg-[#f6f8fc]
          dark:bg-[#020617]
          flex
          items-center
          justify-center
        "
      >
        <div className="text-center">

          <div
            className="
              w-14
              h-14
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
              font-semibold
              text-gray-600
              dark:text-gray-300
            "
          >
            Loading traveler profile...
          </p>

        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error && !user) {
    return (
      <div
        className="
          min-h-screen
          bg-[#f6f8fc]
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
          <div className="text-5xl">
            😕
          </div>

          <h1
            className="
              text-2xl
              font-black
              mt-5
            "
          >
            Traveler not found
          </h1>

          <p
            className="
              text-gray-500
              mt-3
            "
          >
            We couldn't load this
            traveler's profile.
          </p>

          <button
            onClick={() =>
              navigate(-1)
            }
            className="
              mt-6
              px-5
              py-3
              rounded-xl
              bg-blue-600
              text-white
              font-bold
              hover:bg-blue-700
            "
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* =========================================================
     DATA
  ========================================================= */

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

  /* =========================================================
     RETURN
  ========================================================= */

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

            {/* BACK */}

            <div className="mt-5">

              <button
                type="button"
                onClick={() =>
                  navigate(-1)
                }
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-sm
                  font-bold
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
                HERO
            ================================================== */}

            <section
              className="
                relative
                mt-5
                overflow-hidden
                rounded-[32px]
                min-h-[360px]
                shadow-2xl
                border
                border-white/10
                group
              "
            >

              {/* COVER */}

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

              {/* OVERLAY */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-[#020617]/95
                  via-[#111827]/80
                  to-purple-900/40
                "
              />

              {/* GLOW */}

              <div
                className="
                  absolute
                  -right-24
                  -top-24
                  w-80
                  h-80
                  rounded-full
                  bg-purple-500/30
                  blur-3xl
                "
              />

              <div
                className="
                  absolute
                  -left-24
                  -bottom-24
                  w-80
                  h-80
                  rounded-full
                  bg-blue-500/20
                  blur-3xl
                "
              />

              {/* HERO CONTENT */}

              <div
                className="
                  relative
                  z-10
                  min-h-[360px]
                  p-6
                  lg:p-10
                  flex
                  flex-col
                  lg:flex-row
                  lg:items-center
                  justify-between
                  gap-10
                "
              >

                {/* PROFILE */}

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    items-start
                    sm:items-center
                    gap-7
                  "
                >

                  {/* PHOTO */}

                  <div className="relative shrink-0">

                    <div
                      className="
                        absolute
                        -inset-1.5
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
                      alt={
                        user.name ||
                        "Traveler"
                      }
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

                    {/* ONLINE */}

                    <span
                      className="
                        absolute
                        right-2
                        bottom-2
                        w-6
                        h-6
                        rounded-full
                        bg-emerald-500
                        border-4
                        border-white
                        shadow-lg
                      "
                    />

                  </div>

                  {/* INFO */}

                  <div className="text-white">

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        flex-wrap
                      "
                    >

                      <h1
                        className="
                          text-3xl
                          lg:text-5xl
                          font-black
                          tracking-tight
                        "
                      >
                        {user.name}
                      </h1>

                      <span
                        className="
                          w-7
                          h-7
                          rounded-full
                          bg-blue-500
                          flex
                          items-center
                          justify-center
                          text-sm
                          font-black
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
                        text-white/75
                        font-semibold
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

                    {/* SOCIALS */}

                    <div
                      className="
                        mt-6
                        flex
                        flex-wrap
                        items-center
                        gap-2
                      "
                    >

                      <SocialButton
                        platform="instagram"
                        value={
                          user.instagram
                        }
                        label="Instagram"
                        icon={
                          <FaInstagram />
                        }
                        className="
                          bg-gradient-to-tr
                          from-yellow-400
                          via-pink-500
                          to-purple-600
                        "
                      />

                      <SocialButton
                        platform="facebook"
                        value={
                          user.facebook
                        }
                        label="Facebook"
                        icon={
                          <FaFacebook />
                        }
                        className="
                          bg-[#1877F2]
                        "
                      />

                      <SocialButton
                        platform="twitter"
                        value={
                          user.twitter ||
                          user.x ||
                          user.twitter_url
                        }
                        label="X / Twitter"
                        icon={
                          <FaTwitter />
                        }
                        className="
                          bg-black
                        "
                      />

                      <SocialButton
                        platform="linkedin"
                        value={
                          user.linkedin
                        }
                        label="LinkedIn"
                        icon={
                          <FaLinkedin />
                        }
                        className="
                          bg-[#0A66C2]
                        "
                      />

                      <SocialButton
                        platform="youtube"
                        value={
                          user.youtube
                        }
                        label="YouTube"
                        icon={
                          <FaYoutube />
                        }
                        className="
                          bg-[#FF0000]
                        "
                      />

                      <SocialButton
                        platform="tiktok"
                        value={
                          user.tiktok
                        }
                        label="TikTok"
                        icon={
                          <FaTiktok />
                        }
                        className="
                          bg-black
                        "
                      />

                      <SocialButton
                        platform="whatsapp"
                        value={
                          user.whatsapp ||
                          user.phone ||
                          user.whatsapp_number
                        }
                        label="WhatsApp"
                        icon={
                          <FaWhatsapp />
                        }
                        className="
                          bg-[#25D366]
                        "
                      />

                      <SocialButton
                        platform="website"
                        value={
                          user.website ||
                          user.website_url
                        }
                        label="Website"
                        icon={
                          <FaGlobe />
                        }
                        className="
                          bg-indigo-600
                        "
                      />

                    </div>

                  </div>

                </div>

                {/* =================================================
                    ACTIONS
                ================================================== */}

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
                      font-bold
                      flex
                      items-center
                      gap-2
                      hover:bg-white/25
                      hover:-translate-y-0.5
                      transition-all
                      shadow-xl
                    "
                  >

                    {copied ? (
                      <FaCheck
                        className="
                          text-emerald-300
                        "
                      />
                    ) : (
                      <FaShareAlt />
                    )}

                    {copied
                      ? "Link Copied!"
                      : "Share Profile"}

                  </button>

                  {/* COPY */}

                  <button
                    type="button"
                    onClick={
                      handleCopyLink
                    }
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
                      hover:-translate-y-0.5
                      transition-all
                      shadow-xl
                    "
                    title="Copy profile link"
                  >
                    {copied ? (
                      <FaCheck />
                    ) : (
                      <FaLink />
                    )}
                  </button>

                  {/* MESSAGE */}

                  {!isOwnProfile && (
                    <button
                      type="button"
                      onClick={
                        handleMessage
                      }
                      className="
                        h-12
                        px-6
                        rounded-2xl
                        bg-white
                        text-blue-700
                        font-black
                        flex
                        items-center
                        gap-2
                        hover:bg-blue-50
                        hover:scale-105
                        transition-all
                        shadow-xl
                      "
                    >
                      <FaPaperPlane />

                      Message
                    </button>
                  )}

                  {/* FOLLOW */}

                  {!isOwnProfile && (
                    <button
                      type="button"
                      onClick={
                        following
                          ? handleUnfollow
                          : handleFollow
                      }
                      disabled={
                        followLoading
                      }
                      className={`
                        h-12
                        px-6
                        rounded-2xl
                        font-black
                        flex
                        items-center
                        gap-2
                        shadow-xl
                        transition-all

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
                            ? `
                              opacity-60
                              cursor-not-allowed
                            `
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
                        font-bold
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
                  group
                  bg-white
                  dark:bg-[#0f172a]
                  rounded-3xl
                  p-6
                  shadow-lg
                  border
                  border-gray-100
                  dark:border-gray-800
                  hover:-translate-y-1
                  transition-all
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

                <p
                  className="
                    text-gray-500
                    mt-1
                  "
                >
                  Followers
                </p>

              </div>

              {/* FOLLOWING */}

              <div
                className="
                  group
                  bg-white
                  dark:bg-[#0f172a]
                  rounded-3xl
                  p-6
                  shadow-lg
                  border
                  border-gray-100
                  dark:border-gray-800
                  hover:-translate-y-1
                  transition-all
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

                <p
                  className="
                    text-gray-500
                    mt-1
                  "
                >
                  Following
                </p>

              </div>

              {/* SPENDING */}

              <div
                className="
                  group
                  bg-white
                  dark:bg-[#0f172a]
                  rounded-3xl
                  p-6
                  shadow-lg
                  border
                  border-gray-100
                  dark:border-gray-800
                  hover:-translate-y-1
                  transition-all
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

                <p
                  className="
                    text-gray-500
                    mt-1
                  "
                >
                  Travel Spending
                </p>

              </div>

              {/* COUNTRIES */}

              <div
                className="
                  group
                  bg-white
                  dark:bg-[#0f172a]
                  rounded-3xl
                  p-6
                  shadow-lg
                  border
                  border-gray-100
                  dark:border-gray-800
                  hover:-translate-y-1
                  transition-all
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

                <p
                  className="
                    text-gray-500
                    mt-1
                  "
                >
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

              <div
                className="
                  flex
                  items-center
                  gap-3
                "
              >

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
                  "
                >
                  ✨
                </div>

                <div>

                  <p
                    className="
                      text-xs
                      text-blue-600
                      font-black
                      uppercase
                      tracking-widest
                    "
                  >
                    About
                  </p>

                  <h2
                    className="
                      text-2xl
                      font-black
                    "
                  >
                    About Traveler
                  </h2>

                </div>

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
                CONNECT
            ================================================== */}

            {!isOwnProfile && (
              <section
                className="
                  mt-6
                  relative
                  overflow-hidden
                  rounded-3xl
                  p-7
                  bg-gradient-to-r
                  from-blue-600
                  via-indigo-600
                  to-purple-600
                  text-white
                  shadow-xl
                "
              >

                <div
                  className="
                    absolute
                    -right-20
                    -top-20
                    w-56
                    h-56
                    rounded-full
                    bg-white/10
                    blur-3xl
                  "
                />

                <div
                  className="
                    relative
                    z-10
                    flex
                    flex-col
                    md:flex-row
                    md:items-center
                    justify-between
                    gap-6
                  "
                >

                  <div>

                    <p
                      className="
                        text-xs
                        uppercase
                        tracking-widest
                        text-white/60
                        font-bold
                      "
                    >
                      Connect
                    </p>

                    <h2
                      className="
                        text-2xl
                        font-black
                        mt-1
                      "
                    >
                      Want to connect with{" "}
                      {user.name}?
                    </h2>

                    <p
                      className="
                        text-white/75
                        mt-2
                      "
                    >
                      Start a conversation and
                      plan your next adventure.
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleMessage
                    }
                    className="
                      shrink-0
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      px-7
                      py-3.5
                      rounded-2xl
                      bg-white
                      text-blue-700
                      font-black
                      hover:scale-105
                      transition
                      shadow-xl
                    "
                  >
                    <FaPaperPlane />

                    Message {user.name}
                  </button>

                </div>

              </section>
            )}

            {/* =================================================
                TRIPS
            ================================================== */}

            <section className="mt-10">

              <div
                className="
                  flex
                  items-end
                  justify-between
                  gap-4
                  mb-6
                "
              >

                <div>

                  <p
                    className="
                      text-xs
                      text-blue-600
                      font-black
                      uppercase
                      tracking-[0.2em]
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

              {/* LOADING */}

              {tripsLoading ? (

                <div
                  className="
                    bg-white
                    dark:bg-[#0f172a]
                    rounded-3xl
                    p-12
                    text-center
                    shadow-lg
                  "
                >

                  <div
                    className="
                      w-10
                      h-10
                      border-4
                      border-blue-200
                      border-t-blue-600
                      rounded-full
                      animate-spin
                      mx-auto
                    "
                  />

                  <p
                    className="
                      mt-4
                      text-gray-500
                    "
                  >
                    Loading trips...
                  </p>

                </div>

              ) : trips.length === 0 ? (

                /* EMPTY */

                <div
                  className="
                    bg-white
                    dark:bg-[#0f172a]
                    rounded-3xl
                    border
                    border-dashed
                    border-gray-300
                    dark:border-gray-700
                    p-14
                    text-center
                  "
                >

                  <div
                    className="
                      w-20
                      h-20
                      mx-auto
                      rounded-3xl
                      bg-blue-50
                      dark:bg-blue-500/10
                      flex
                      items-center
                      justify-center
                      text-4xl
                    "
                  >
                    🧳
                  </div>

                  <h3
                    className="
                      text-xl
                      font-black
                      mt-5
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

                /* TRIPS */

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-3
                    gap-6
                  "
                >

                  {trips.map(
                    (trip) => (
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

                        {/* IMAGE */}

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
                            alt={
                              trip.title ||
                              "Trip"
                            }
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
                              from-black/70
                              via-black/10
                              to-transparent
                            "
                          />

                          <div
                            className="
                              absolute
                              bottom-4
                              left-5
                              right-5
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

                        {/* DETAILS */}

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
                              className="
                                text-blue-500
                              "
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
                                pt-4
                                border-t
                                border-gray-100
                                dark:border-gray-800
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
                    )
                  )}

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