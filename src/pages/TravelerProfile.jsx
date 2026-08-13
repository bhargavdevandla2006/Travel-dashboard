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
  FaExternalLinkAlt,
} from "react-icons/fa";

export default function TravelerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

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
      const response = await fetch(`${apiUrl}/users/${id}`, {
        credentials: "include",
      });

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
  // LOAD CURRENT USER
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

      const self = String(currentUser.id) === String(id);

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
      const response = await fetch(`${apiUrl}/follow-status/${id}`, {
        credentials: "include",
      });

      if (!response.ok) return;

      const data = await response.json();

      setFollowing(Boolean(data.following));
    } catch (err) {
      console.error("Follow status error:", err);
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // FOLLOWERS
  // =========================================================

  async function loadFollowers() {
    try {
      const response = await fetch(`${apiUrl}/followers-count/${id}`);

      if (!response.ok) return;

      const data = await response.json();

      setFollowers(Number(data.count) || 0);
    } catch (err) {
      console.error("Followers error:", err);
    }
  }

  // =========================================================
  // FOLLOWING
  // =========================================================

  async function loadFollowing() {
    try {
      const response = await fetch(`${apiUrl}/following-count/${id}`);

      if (!response.ok) return;

      const data = await response.json();

      setFollowingCount(Number(data.count) || 0);
    } catch (err) {
      console.error("Following error:", err);
    }
  }

  // =========================================================
  // TRIPS
  // =========================================================

  async function loadTrips() {
    setTripsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/users/${id}/trips`);

      if (!response.ok) {
        setTrips([]);
        return;
      }

      const data = await response.json();

      setTrips(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Trips error:", err);
      setTrips([]);
    } finally {
      setTripsLoading(false);
    }
  }

  // =========================================================
  // FOLLOW
  // =========================================================

  async function handleFollow() {
    if (isOwnProfile || followLoading) return;

    try {
      setFollowLoading(true);

      const response = await fetch(`${apiUrl}/follow/${id}`, {
        method: "POST",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to follow user");
      }

      setFollowing(true);

      await loadFollowers();
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
    if (isOwnProfile || followLoading) return;

    try {
      setFollowLoading(true);

      const response = await fetch(`${apiUrl}/unfollow/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to unfollow user");
      }

      setFollowing(false);

      await loadFollowers();
    } catch (err) {
      console.error("Unfollow error:", err);

      alert(err.message || "Unable to unfollow this traveler.");
    } finally {
      setFollowLoading(false);
    }
  }

  // =========================================================
  // SHARE PROFILE
  // =========================================================

  async function handleShare() {
    if (!user?.id) return;

    const profileUrl = `${window.location.origin}/traveler/${user.id}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${user.name} | TravelHub`,
          text: `Check out ${user.name}'s TravelHub profile.`,
          url: profileUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(profileUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      console.error("Share error:", err);
    }
  }

  // =========================================================
  // COPY PROFILE LINK
  // =========================================================

  async function handleCopyLink() {
    if (!user?.id) return;

    const profileUrl = `${window.location.origin}/traveler/${user.id}`;

    try {
      await navigator.clipboard.writeText(profileUrl);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (err) {
      console.error("Copy error:", err);
    }
  }

  // =========================================================
  // SOCIAL URL BUILDER
  //
  // CONNECTED ACCOUNT:
  //     Open exact traveler account.
  //
  // NO CONNECTED ACCOUNT:
  //     Open official signup page.
  //
  // NO RANDOM PROFILE URL.
  // NO RANDOM ACCOUNT.
  // NO POPUP.
  // =========================================================

  function getSocialUrl(platform, value) {
    const username = String(value || "").trim();

    // =======================================================
    // TRAVELER HAS CONNECTED ACCOUNT
    // =======================================================

    if (username) {
      // If database already contains complete URL
      if (
        username.startsWith("http://") ||
        username.startsWith("https://")
      ) {
        return username;
      }

      const cleanUsername = username.replace(/^@/, "");

      switch (platform) {
        case "instagram":
          return `https://www.instagram.com/${cleanUsername}/`;

        case "facebook":
          return `https://www.facebook.com/${cleanUsername}`;

        case "twitter":
          return `https://x.com/${cleanUsername}`;

        case "linkedin":
          return `https://www.linkedin.com/in/${cleanUsername}`;

        case "youtube":
          return `https://www.youtube.com/@${cleanUsername}`;

        case "tiktok":
          return `https://www.tiktok.com/@${cleanUsername}`;

        case "website":
          return cleanUsername.startsWith("www.")
            ? `https://${cleanUsername}`
            : `https://${cleanUsername}`;

        default:
          return null;
      }
    }

    // =======================================================
    // TRAVELER DOES NOT HAVE ACCOUNT
    //
    // DIRECTLY GO TO SIGNUP.
    //
    // NO CONFIRM POPUP.
    // NO RANDOM ACCOUNT.
    // =======================================================

    switch (platform) {
      case "instagram":
        return "https://www.instagram.com/accounts/emailsignup/";

      case "facebook":
        return "https://www.facebook.com/r.php";

      case "twitter":
        return "https://x.com/i/flow/signup";

      case "linkedin":
        return "https://www.linkedin.com/signup";

      case "youtube":
        return "https://accounts.google.com/signup";

      case "tiktok":
        return "https://www.tiktok.com/signup";

      case "website":
        return null;

      default:
        return null;
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

    window.open(url, "_blank", "noopener,noreferrer");
  }

  // =========================================================
  // SOCIAL BUTTON
  // =========================================================

  function SocialButton({
    platform,
    value,
    label,
    icon,
    className,
  }) {
    const connected = Boolean(value && String(value).trim());

    return (
      <button
        type="button"
        onClick={() => openSocial(platform, value)}
        title={
          connected
            ? `Open ${user.name}'s ${label}`
            : `${user.name} has no ${label} account — create one`
        }
        className={`
          group
          inline-flex
          items-center
          gap-2
          px-4
          py-2.5
          rounded-xl
          text-white
          text-sm
          font-semibold
          shadow-lg
          border
          border-white/10
          transition-all
          duration-200
          hover:-translate-y-1
          hover:shadow-2xl
          active:scale-95
          ${className}
        `}
      >
        <span className="text-base">
          {icon}
        </span>

        <span>
          {label}
        </span>

        {!connected && (
          <span className="text-[10px] opacity-80">
            Create
          </span>
        )}

        {connected && (
          <FaExternalLinkAlt
            className="
              text-[9px]
              opacity-0
              group-hover:opacity-70
              transition
            "
          />
        )}
      </button>
    );
  }

  // =========================================================
  // MESSAGE
  // =========================================================

  function handleMessage() {
    if (!id || isOwnProfile) return;

    navigate(`/messages/${id}`);
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

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <Sidebar />

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="flex-1 min-w-0">

          <div className="p-4 lg:p-6">

            <Navbar />

            {/* =================================================
                BACK
            ================================================= */}

            <div className="mt-5">
              <button
                type="button"
                onClick={() => navigate(-1)}
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
                HERO
            ================================================= */}

            <section
              className="
                relative
                overflow-hidden
                rounded-[32px]
                mt-5
                min-h-[380px]
                shadow-2xl
                group
              "
            >
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

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-r
                  from-[#020617]/95
                  via-[#1e1b4b]/80
                  to-[#7c3aed]/30
                "
              />

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

              <div
                className="
                  relative
                  z-10
                  min-h-[380px]
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

                {/* =================================================
                    PROFILE
                ================================================= */}

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

                  {/* PHOTO */}

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

                  {/* INFO */}

                  <div className="text-white">

                    <div className="flex items-center gap-3 flex-wrap">

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
                      Explorer • Traveler • Adventure Lover ✈️
                    </p>

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

                    {/* =================================================
                        SOCIAL MEDIA
                    ================================================= */}

                    <div className="mt-6">

                      <p
                        className="
                          text-xs
                          uppercase
                          tracking-[0.2em]
                          text-white/50
                          font-bold
                          mb-3
                        "
                      >
                        Connect
                      </p>

                      <div className="flex flex-wrap gap-2">

                        {/* INSTAGRAM */}

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

                        {/* FACEBOOK */}

                        <SocialButton
                          platform="facebook"
                          value={user.facebook}
                          label="Facebook"
                          icon={<FaFacebook />}
                          className="bg-[#1877F2]"
                        />

                        {/* X */}

                        <SocialButton
                          platform="twitter"
                          value={
                            user.twitter ||
                            user.x ||
                            user.twitter_url
                          }
                          label="X"
                          icon={<FaTwitter />}
                          className="bg-black"
                        />

                        {/* LINKEDIN */}

                        <SocialButton
                          platform="linkedin"
                          value={user.linkedin}
                          label="LinkedIn"
                          icon={<FaLinkedin />}
                          className="bg-[#0A66C2]"
                        />

                        {/* YOUTUBE */}

                        <SocialButton
                          platform="youtube"
                          value={user.youtube}
                          label="YouTube"
                          icon={<FaYoutube />}
                          className="bg-[#FF0000]"
                        />

                        {/* TIKTOK */}

                        <SocialButton
                          platform="tiktok"
                          value={user.tiktok}
                          label="TikTok"
                          icon={<FaTiktok />}
                          className="bg-black"
                        />

                        {/* WEBSITE */}

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

                      <p className="mt-3 text-xs text-white/45">
                        Connected accounts open the traveler's
                        exact profile. Missing accounts open
                        the official signup page.
                      </p>

                    </div>

                  </div>

                </div>

                {/* =================================================
                    ACTIONS
                ================================================= */}

                <div className="flex flex-wrap items-center gap-3">

                  {/* FOLLOW */}

                  {!isOwnProfile && (
                    <button
                      type="button"
                      disabled={followLoading}
                      onClick={
                        following
                          ? handleUnfollow
                          : handleFollow
                      }
                      className="
                        h-11
                        px-5
                        rounded-xl
                        bg-blue-600
                        hover:bg-blue-700
                        text-white
                        font-bold
                        flex
                        items-center
                        gap-2
                        transition
                        shadow-xl
                        disabled:opacity-50
                      "
                    >
                      <FaUserCheck />

                      {followLoading
                        ? "Please wait..."
                        : following
                        ? "Following"
                        : "Follow"}
                    </button>
                  )}

                  {/* SHARE */}

                  <button
                    type="button"
                    onClick={handleShare}
                    className="
                      h-11
                      px-5
                      rounded-xl
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
                      hover:-translate-y-0.5
                      transition-all
                      shadow-lg
                    "
                  >
                    {copied ? (
                      <FaCheck className="text-emerald-300" />
                    ) : (
                      <FaShareAlt />
                    )}

                    {copied
                      ? "Link Copied!"
                      : "Share"}
                  </button>

                  {/* COPY */}

                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="
                      w-11
                      h-11
                      rounded-xl
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
                      shadow-lg
                    "
                    title="Copy profile link"
                  >
                    <FaCopy />
                  </button>

                  {/* MESSAGE */}

                  {!isOwnProfile && (
                    <button
                      type="button"
                      onClick={handleMessage}
                      className="
                        h-11
                        px-5
                        rounded-xl
                        bg-white
                        text-blue-700
                        font-bold
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

                  {/* OWN PROFILE */}

                  {isOwnProfile && (
                    <div
                      className="
                        h-11
                        px-5
                        rounded-xl
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
            ================================================= */}

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

                <h2 className="text-3xl font-black mt-4">
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

                <h2 className="text-3xl font-black mt-4">
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

                <h2 className="text-3xl font-black mt-4">
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

                <h2 className="text-3xl font-black mt-4">
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
            ================================================= */}

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

                <h2 className="text-2xl font-black">
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
                MESSAGE CTA
            ================================================= */}

            {!isOwnProfile && (
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
                    Start a conversation and plan your next adventure.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={handleMessage}
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
                  Message {user.name}
                </button>

              </section>
            )}

            {/* =================================================
                TRIPS
            ================================================= */}

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

                  <p className="mt-4 text-gray-500">
                    Loading trips...
                  </p>
                </div>

              ) : trips.length === 0 ? (

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