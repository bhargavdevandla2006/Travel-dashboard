
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import apiUrl, { getProfile } from "../services/api";

import {
  FaMapMarkerAlt,
  FaArrowRight,
  FaArrowLeft,
  FaChevronDown,
  FaPlane,
  FaCircle,
} from "react-icons/fa";

export default function Travelers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);

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

      let currentUser = null;

      try {
        currentUser = await getProfile();
      } catch (error) {
        console.log("No logged in user");
      }

      const sortedUsers = [...data].sort((a, b) => {
        if (!currentUser) return 0;

        if (a.id === currentUser.id) return -1;
        if (b.id === currentUser.id) return 1;

        return 0;
      });

      setUsers(sortedUsers);
      setVisibleCount(3);
    } catch (err) {
      console.log(err);
    }
  }

  const handleSeeMore = () => {
    setVisibleCount((prev) =>
      Math.min(prev + 3, users.length)
    );
  };

  const handleNext = () => {
    setVisibleCount((prev) =>
      Math.min(prev + 3, users.length)
    );
  };

  const handlePrevious = () => {
    setVisibleCount((prev) =>
      Math.max(3, prev - 3)
    );
  };

  const visibleUsers = users.slice(0, visibleCount);

  return (
    <div className="min-h-screen p-6 bg-white text-gray-900 dark:bg-[#0f172a] dark:text-white">

      <div className="bg-white dark:bg-[#111827] rounded-[40px] overflow-hidden flex shadow-xl">

        <Sidebar />

        <div className="flex-1 p-6 md:p-10 overflow-hidden">

          <Navbar />

          

          <div
            id="travelers-section"
            className="mt-10 flex items-end justify-between"
          >
            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-blue-500 animate-pulse">
                ✦ EXPLORE PEOPLE
              </p>

              <h1 className="text-3xl font-black mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Travel Community
              </h1>

              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                Discover travelers, explorers and people sharing their journeys.
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-500">
              👥 {users.length} Travelers
            </div>
          </div>


          

          <div className="relative mt-8 group">

            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 blur group-focus-within:opacity-70 transition duration-500" />

            <input
              type="text"
              placeholder="Search travelers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                relative
                w-full
                border
                border-gray-300
                dark:border-gray-700
                bg-white
                dark:bg-[#111827]
                text-gray-900
                dark:text-white
                px-6
                py-4
                rounded-2xl
                outline-none
                transition
                focus:border-transparent
              "
            />

          </div>


          

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">

            {visibleUsers.map((user, index) => (

              <div
                key={user.id}
                onClick={() => navigate(`/traveler/${user.id}`)}
                className="
                  group
                  relative
                  min-h-[470px]
                  overflow-hidden
                  rounded-[32px]
                  cursor-pointer
                  bg-white
                  dark:bg-[#111827]
                  border
                  border-gray-200
                  dark:border-white/10
                  shadow-xl
                  transition-all
                  duration-500
                  hover:-translate-y-4
                  hover:scale-[1.02]
                  hover:shadow-[0_25px_70px_rgba(59,130,246,0.25)]
                  animate-[fadeIn_0.6s_ease-out_forwards]
                "
                style={{
                  animationDelay: `${index * 0.12}s`,
                }}
              >

                

                <div
                  className="
                    absolute
                    -top-32
                    -left-32
                    w-72
                    h-72
                    rounded-full
                    bg-blue-500/20
                    blur-3xl
                    transition-all
                    duration-700
                    group-hover:translate-x-40
                    group-hover:translate-y-20
                    group-hover:bg-purple-500/30
                  "
                />

                <div
                  className="
                    absolute
                    -bottom-32
                    -right-32
                    w-72
                    h-72
                    rounded-full
                    bg-purple-500/20
                    blur-3xl
                    transition-all
                    duration-700
                    group-hover:-translate-x-24
                    group-hover:-translate-y-20
                    group-hover:bg-pink-500/30
                  "
                />

                

                <div
                  className="
                    absolute
                    inset-0
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-500
                    overflow-hidden
                  "
                >
                  <div
                    className="
                      absolute
                      -top-full
                      left-1/2
                      w-32
                      h-[200%]
                      bg-gradient-to-b
                      from-transparent
                      via-white/20
                      to-transparent
                      rotate-45
                      transition-transform
                      duration-1000
                      group-hover:translate-x-96
                    "
                  />
                </div>


                

                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20" />


                <div className="relative z-10 p-6 pt-14">

                  

                  <div className="flex justify-between items-start">

                    

                    <div className="relative w-24 h-24">

                      

                      <div
                        className="
                          absolute
                          inset-[-6px]
                          rounded-full
                          bg-gradient-to-r
                          from-blue-500
                          via-purple-500
                          to-pink-500
                          opacity-70
                          blur-[1px]
                          transition
                          duration-700
                          group-hover:rotate-[360deg]
                        "
                      />

                      <div className="absolute inset-[3px] rounded-full bg-white dark:bg-[#111827]" />

                      <img
                        src={user.photo}
                        alt={user.name}
                        className="
                          relative
                          w-full
                          h-full
                          rounded-full
                          object-cover
                          border-4
                          border-white
                          dark:border-[#111827]
                          transition
                          duration-500
                          group-hover:scale-105
                        "
                      />

                      

                      <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-green-400 border-4 border-white dark:border-[#111827] animate-pulse" />

                    </div>


                    

                    <div
                      className="
                        px-4
                        py-2
                        rounded-full
                        text-[10px]
                        font-bold
                        tracking-widest
                        text-purple-600
                        dark:text-purple-300
                        bg-purple-500/10
                        border
                        border-purple-500/20
                        backdrop-blur-xl
                        transition
                        duration-500
                        group-hover:scale-110
                        group-hover:bg-purple-500/20
                      "
                    >
                      ✦ TRAVELER
                    </div>

                  </div>


                  

                  <div className="mt-6">

                    <h2
                      className="
                        text-2xl
                        font-black
                        transition-all
                        duration-500
                        group-hover:tracking-wide
                        group-hover:text-blue-500
                      "
                    >
                      {user.name}
                    </h2>

                    <div className="flex items-center gap-2 mt-3 text-sm text-gray-500 dark:text-gray-400">

                      <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <FaMapMarkerAlt />
                      </div>

                      <span>
                        {user.city || "Unknown"},{" "}
                        {user.country || "India"}
                      </span>

                    </div>

                  </div>


                  

                  <div className="flex items-center gap-3 mt-8">

                    <FaCircle className="text-blue-500 text-[8px]" />

                    <div className="flex-1 h-[2px] overflow-hidden rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500 to-pink-500/20">

                      <div
                        className="
                          w-1/3
                          h-full
                          bg-blue-400
                          transition-all
                          duration-700
                          group-hover:translate-x-[220%]
                        "
                      />

                    </div>

                    <div className="text-purple-500 transition duration-500 group-hover:translate-x-2 group-hover:-translate-y-2">
                      <FaPlane />
                    </div>

                    <div className="flex-1 h-[2px] bg-gradient-to-r from-purple-500/20 via-pink-500 to-blue-500/20 rounded-full" />

                    <FaCircle className="text-pink-500 text-[8px]" />

                  </div>


                  

                  <div className="grid grid-cols-2 gap-4 mt-8">

                    <div
                      className="
                        p-4
                        rounded-2xl
                        bg-gray-50
                        dark:bg-white/5
                        border
                        border-gray-200
                        dark:border-white/10
                        transition
                        duration-500
                        group-hover:-translate-y-1
                        group-hover:border-blue-500/40
                      "
                    >
                      <span className="text-[10px] tracking-widest text-gray-400">
                        STATUS
                      </span>

                      <b className="block mt-2 text-sm text-green-500">
                        Exploring
                      </b>

                    </div>


                    <div
                      className="
                        p-4
                        rounded-2xl
                        bg-gray-50
                        dark:bg-white/5
                        border
                        border-gray-200
                        dark:border-white/10
                        transition
                        duration-500
                        delay-75
                        group-hover:-translate-y-1
                        group-hover:border-purple-500/40
                      "
                    >
                      <span className="text-[10px] tracking-widest text-gray-400">
                        JOURNEY
                      </span>

                      <b className="block mt-2 text-sm truncate">
                        {user.country || "India"}
                      </b>

                    </div>

                  </div>


                  

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/traveler/${user.id}`);
                    }}
                    className="
                      group/btn
                      relative
                      w-full
                      mt-7
                      py-4
                      rounded-2xl
                      overflow-hidden
                      bg-gray-900
                      dark:bg-white
                      text-white
                      dark:text-gray-900
                      font-bold
                      transition-all
                      duration-500
                      hover:shadow-[0_15px_40px_rgba(99,102,241,0.4)]
                    "
                  >

                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500" />

                    <span className="relative z-10 flex justify-center items-center gap-3">

                      Enter Journey

                      <FaArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-2" />

                    </span>

                  </button>

                </div>

              </div>

            ))}

          </div>


          

          {users.length === 0 && (

            <div className="text-center py-20 text-gray-400">

              <div className="text-5xl mb-4 animate-bounce">
                🧳
              </div>

              No travelers found

            </div>

          )}


          

          {users.length > 3 && (

            <div className="flex justify-center items-center gap-4 mt-12 mb-6">

              

              <button
                onClick={handlePrevious}
                disabled={visibleCount <= 3}
                className={`
                  w-12
                  h-12
                  rounded-full
                  flex
                  items-center
                  justify-center
                  border
                  border-gray-300
                  dark:border-white/10
                  bg-white
                  dark:bg-[#111827]
                  transition-all
                  duration-300
                  hover:scale-110
                  hover:bg-blue-500
                  hover:text-white
                  hover:border-blue-500
                  ${
                    visibleCount <= 3
                      ? "opacity-30 cursor-not-allowed"
                      : ""
                  }
                `}
              >
                <FaArrowLeft />
              </button>


              

              {visibleCount < users.length ? (

                <button
                  onClick={handleSeeMore}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    px-7
                    py-4
                    rounded-full
                    bg-gradient-to-r
                    from-blue-600
                    via-purple-600
                    to-pink-600
                    text-white
                    font-bold
                    shadow-lg
                    transition-all
                    duration-500
                    hover:scale-105
                    hover:shadow-[0_15px_40px_rgba(99,102,241,0.4)]
                  "
                >

                  See More Travelers

                  <FaChevronDown className="transition-transform duration-300 group-hover:translate-y-1" />

                </button>

              ) : (

                <button
                  onClick={() => {
                    setVisibleCount(3);

                    document
                      .getElementById("travelers-section")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    px-7
                    py-4
                    rounded-full
                    bg-gradient-to-r
                    from-purple-600
                    to-blue-600
                    text-white
                    font-bold
                    shadow-lg
                    transition-all
                    duration-500
                    hover:scale-105
                  "
                >

                  Show Less

                  <FaChevronDown className="rotate-180 transition-transform duration-300 group-hover:-translate-y-1" />

                </button>

              )}


              

              <button
                onClick={handleNext}
                disabled={visibleCount >= users.length}
                className={`
                  w-12
                  h-12
                  rounded-full
                  flex
                  items-center
                  justify-center
                  border
                  border-gray-300
                  dark:border-white/10
                  bg-white
                  dark:bg-[#111827]
                  transition-all
                  duration-300
                  hover:scale-110
                  hover:bg-purple-500
                  hover:text-white
                  hover:border-purple-500
                  ${
                    visibleCount >= users.length
                      ? "opacity-30 cursor-not-allowed"
                      : ""
                  }
                `}
              >
                <FaArrowRight />
              </button>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

