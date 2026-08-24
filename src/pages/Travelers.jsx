import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import apiUrl, { getProfile } from "../services/api";

import {
  FaSearch,
  FaMapMarkerAlt,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaCompass,
} from "react-icons/fa";

export default function Travelers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, [search]);

  async function loadUsers() {
    try {
      const endpoint = search.trim()
        ? `${apiUrl}/search-users?search=${encodeURIComponent(search)}`
        : `${apiUrl}/users`;

      const response = await fetch(endpoint, {
        credentials: "include",
      });

      const data = await response.json();
      const currentUser = await getProfile();

      const sortedUsers = data.sort((a, b) => {
        if (a.id === currentUser.id) return -1;
        if (b.id === currentUser.id) return 1;
        return 0;
      });

      setUsers(sortedUsers);
      setCurrentIndex(0);
    } catch (err) {
      console.log(err);
    }
  }

  const visibleUsers = users.slice(currentIndex, currentIndex + 3);

  function nextProfiles() {
    if (currentIndex + 3 < users.length) {
      setCurrentIndex((prev) => prev + 3);
    }
  }

  function previousProfiles() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => Math.max(0, prev - 3));
    }
  }

  return (
    <div className="min-h-screen p-6 bg-[#0f172a] text-white overflow-hidden">

      {/* CUSTOM ANIMATIONS */}
      <style>
        {`

          @keyframes auroraMove {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          @keyframes floatParticle {
            0%, 100% {
              transform: translateY(0px);
              opacity: 0.3;
            }

            50% {
              transform: translateY(-20px);
              opacity: 1;
            }
          }

          @keyframes rotateOrbit {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @keyframes cardEnter {
            from {
              opacity: 0;
              transform: translateY(50px) scale(0.9);
              filter: blur(10px);
            }

            to {
              opacity: 1;
              transform: translateY(0px) scale(1);
              filter: blur(0px);
            }
          }

          @keyframes shineMove {
            0% {
              transform: translateX(-150%) rotate(20deg);
            }

            100% {
              transform: translateX(250%) rotate(20deg);
            }
          }

          .traveler-card {
            animation: cardEnter 0.7s ease forwards;
            position: relative;
            overflow: hidden;
            transform-style: preserve-3d;
          }

          .traveler-card:hover {
            transform:
              translateY(-12px)
              scale(1.025)
              rotateX(2deg)
              rotateY(-2deg);
          }

          .traveler-card::before {
            content: "";
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;

            background:
              radial-gradient(
                circle,
                rgba(96, 165, 250, 0.18),
                transparent 40%
              );

            opacity: 0;
            transition: 0.5s;
            pointer-events: none;
          }

          .traveler-card:hover::before {
            opacity: 1;
          }

          .shine-effect {
            position: absolute;
            width: 40%;
            height: 150%;
            top: -30%;

            background:
              linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,0.12),
                transparent
              );

            pointer-events: none;
          }

          .traveler-card:hover .shine-effect {
            animation: shineMove 1.2s ease forwards;
          }

          .aurora-header {
            background:
              linear-gradient(
                120deg,
                #2563eb,
                #4f46e5,
                #7c3aed,
                #c026d3,
                #2563eb
              );

            background-size: 300% 300%;

            animation: auroraMove 7s ease infinite;
          }

          .profile-orbit {
            animation: rotateOrbit 8s linear infinite;
          }

          .traveler-card:hover .profile-orbit {
            animation-duration: 2s;
          }

          .floating-particle {
            animation: floatParticle 3s ease-in-out infinite;
          }

          .floating-particle:nth-child(2) {
            animation-delay: 1s;
          }

          .floating-particle:nth-child(3) {
            animation-delay: 2s;
          }

        `}
      </style>

      <div className="bg-[#111827] rounded-[40px] overflow-hidden flex border border-white/5 shadow-2xl">

        <Sidebar />

        <div className="flex-1 p-10 min-w-0">

          <Navbar />

          {/* HEADER */}

          <div className="mt-10 flex justify-between items-end">

            <div>

              <div className="flex items-center gap-3 text-blue-400 text-xs font-bold tracking-[0.4em]">

                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />

                EXPLORE PEOPLE

              </div>

              <h1 className="text-4xl font-black mt-3 bg-gradient-to-r from-white via-blue-300 to-purple-400 bg-clip-text text-transparent">
                Travel Community
              </h1>

              <p className="text-gray-400 mt-3">
                Discover travelers, explorers and people sharing their journeys.
              </p>

            </div>

            <div className="hidden md:flex items-center gap-2 text-blue-300">

              <FaUsers />

              <span className="text-sm">
                {users.length} Travelers
              </span>

            </div>

          </div>


          {/* SEARCH */}

          <div className="relative mt-8">

            <FaSearch
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Search travelers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                bg-[#111827]
                border
                border-slate-700
                rounded-2xl
                py-5
                pl-14
                pr-5
                outline-none
                transition
                focus:border-blue-500
                focus:shadow-[0_0_30px_rgba(59,130,246,0.15)]
              "
            />

          </div>


          {/* SECTION HEADER */}

          {!search && users.length > 0 && (

            <div className="flex justify-between items-center mt-10">

              <div className="flex items-center gap-3">

                <div className="
                  w-11
                  h-11
                  rounded-2xl
                  bg-blue-500/10
                  border
                  border-blue-400/20
                  flex
                  items-center
                  justify-center
                  text-blue-400
                ">
                  <FaCompass />
                </div>

                <div>

                  <h2 className="font-bold text-xl">
                    Discover Travelers
                  </h2>

                  <p className="text-gray-500 text-xs mt-1">
                    Meet new people and explore their journeys
                  </p>

                </div>

              </div>


              {/* ARROWS */}

              <div className="flex gap-3">

                <button
                  onClick={previousProfiles}
                  disabled={currentIndex === 0}
                  className="
                    w-12
                    h-12
                    rounded-full
                    border
                    border-slate-700
                    flex
                    items-center
                    justify-center
                    transition
                    hover:bg-white
                    hover:text-black
                    disabled:opacity-30
                    disabled:cursor-not-allowed
                  "
                >
                  <FaChevronLeft />
                </button>


                <button
                  onClick={nextProfiles}
                  disabled={currentIndex + 3 >= users.length}
                  className="
                    w-12
                    h-12
                    rounded-full
                    bg-gradient-to-r
                    from-blue-600
                    to-purple-600
                    flex
                    items-center
                    justify-center
                    transition
                    hover:scale-110
                    hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]
                    disabled:opacity-30
                    disabled:cursor-not-allowed
                  "
                >
                  <FaChevronRight />
                </button>

              </div>

            </div>

          )}


          {/* CARDS */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">

            {(search ? users : visibleUsers).map((user, index) => (

              <div
                key={user.id}
                onClick={() => navigate(`/traveler/${user.id}`)}
                className="
                  traveler-card
                  group
                  bg-[#161f2f]
                  rounded-[32px]
                  border
                  border-slate-700/70
                  cursor-pointer
                  transition-all
                  duration-500
                  hover:border-blue-400/70
                  hover:shadow-[0_20px_60px_rgba(37,99,235,0.2)]
                "
                style={{
                  animationDelay: `${index * 0.12}s`,
                }}
              >

                {/* PARTICLES */}

                <div
                  className="
                    floating-particle
                    absolute
                    top-16
                    right-10
                    w-2
                    h-2
                    bg-blue-400
                    rounded-full
                    opacity-40
                  "
                />

                <div
                  className="
                    floating-particle
                    absolute
                    top-28
                    right-24
                    w-1
                    h-1
                    bg-purple-400
                    rounded-full
                  "
                />

                <div
                  className="
                    floating-particle
                    absolute
                    top-10
                    left-20
                    w-1.5
                    h-1.5
                    bg-cyan-300
                    rounded-full
                  "
                />


                <div className="shine-effect" />


                {/* AURORA */}

                <div className="aurora-header h-28 relative overflow-hidden">

                  <div className="
                    absolute
                    inset-0
                    bg-gradient-to-b
                    from-transparent
                    to-[#161f2f]
                  " />

                </div>


                {/* PROFILE */}

                <div className="px-6 relative -mt-10">

                  <div className="relative w-20 h-20">

                    <div
                      className="
                        profile-orbit
                        absolute
                        -inset-1
                        rounded-full
                        bg-gradient-to-r
                        from-cyan-400
                        via-purple-500
                        to-pink-500
                      "
                    />

                    <img
                      src={user.photo}
                      alt={user.name}
                      className="
                        relative
                        w-20
                        h-20
                        rounded-full
                        object-cover
                        border-4
                        border-[#161f2f]
                        transition
                        duration-500
                        group-hover:scale-110
                      "
                    />

                    <div className="
                      absolute
                      bottom-0
                      right-0
                      w-4
                      h-4
                      bg-green-400
                      rounded-full
                      border-2
                      border-[#161f2f]
                      animate-pulse
                    " />

                  </div>


                  {/* NAME */}

                  <div className="flex justify-between items-center mt-4">

                    <div>

                      <h2 className="
                        text-xl
                        font-black
                        transition
                        duration-300
                        group-hover:text-blue-300
                      ">
                        {user.name}
                      </h2>

                      <div className="
                        flex
                        items-center
                        gap-2
                        text-gray-400
                        text-sm
                        mt-2
                      ">

                        <FaMapMarkerAlt className="text-blue-400" />

                        {user.city}, {user.country}

                      </div>

                    </div>


                    <div className="
                      px-3
                      py-1
                      rounded-full
                      text-[10px]
                      font-bold
                      tracking-wider
                      text-blue-300
                      bg-blue-500/10
                      border
                      border-blue-400/10
                    ">
                      TRAVELER
                    </div>

                  </div>


                  {/* JOURNEY INFO */}

                  <div className="grid grid-cols-2 gap-3 mt-6">

                    <div className="
                      bg-white/[0.04]
                      border
                      border-white/[0.06]
                      rounded-2xl
                      p-4
                      transition
                      duration-300
                      group-hover:bg-blue-500/[0.08]
                    ">

                      <p className="
                        text-[10px]
                        tracking-widest
                        text-gray-500
                      ">
                        STATUS
                      </p>

                      <p className="
                        font-bold
                        text-sm
                        mt-2
                      ">
                        Exploring
                      </p>

                    </div>


                    <div className="
                      bg-white/[0.04]
                      border
                      border-white/[0.06]
                      rounded-2xl
                      p-4
                      transition
                      duration-300
                      group-hover:bg-purple-500/[0.08]
                    ">

                      <p className="
                        text-[10px]
                        tracking-widest
                        text-gray-500
                      ">
                        JOURNEY
                      </p>

                      <p className="
                        font-bold
                        text-sm
                        mt-2
                      ">
                        India
                      </p>

                    </div>

                  </div>


                  {/* BUTTON */}

                  <button
                    className="
                      mt-6
                      mb-6
                      w-full
                      py-4
                      rounded-2xl
                      font-bold
                      text-sm
                      flex
                      items-center
                      justify-center
                      gap-3
                      bg-white/[0.05]
                      border
                      border-white/[0.08]
                      transition-all
                      duration-500
                      group-hover:
                      bg-gradient-to-r
                      group-hover:from-blue-600
                      group-hover:to-purple-600
                      group-hover:shadow-[0_10px_30px_rgba(37,99,235,0.35)]
                    "
                  >

                    Enter Journey

                    <FaArrowRight
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-2
                      "
                    />

                  </button>

                </div>

              </div>

            ))}

          </div>


          {/* SEE MORE */}

          {!search &&
            currentIndex + 3 < users.length && (

              <div className="flex justify-center mt-10">

                <button
                  onClick={nextProfiles}
                  className="
                    group
                    flex
                    items-center
                    gap-4
                    px-8
                    py-4
                    rounded-full
                    border
                    border-blue-500/30
                    bg-blue-500/5
                    text-blue-300
                    font-bold
                    transition-all
                    duration-300
                    hover:bg-blue-600
                    hover:text-white
                    hover:scale-105
                    hover:shadow-[0_0_35px_rgba(37,99,235,0.4)]
                  "
                >

                  See More Travelers

                  <FaArrowRight
                    className="
                      transition-transform
                      duration-300
                      group-hover:translate-x-2
                    "
                  />

                </button>

              </div>

            )}

        </div>

      </div>

    </div>
  );
}