import {
  FaBell,
  FaEnvelope,
  FaMoon,
  FaSearch,
  FaCog,
  FaUserCircle,
  FaHeart,
  FaUserPlus,
  FaCheck,
  FaSun,
} from "react-icons/fa";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

import apiUrl, {
  getProfile,
  logoutUser,
} from "../services/api";


export default function Navbar({ search = "", setSearch }) {

  const [open, setOpen] = useState(false);

  const [notificationOpen, setNotificationOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState([]);

  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const { darkMode, toggleTheme } = useTheme();

  const { t } = useLanguage();


  // =========================
  // LOAD USER
  // =========================

  useEffect(() => {

    loadUser();

  }, []);


  async function loadUser() {

    try {

      const data = await getProfile();

      setUser(data);

    } catch (error) {

      console.error("User loading error:", error);

    }

  }


  // =========================
  // LOAD NOTIFICATIONS
  // =========================

  useEffect(() => {

    loadNotifications();

    const interval = setInterval(() => {

      loadNotifications();

    }, 5000);


    return () => {

      clearInterval(interval);

    };

  }, []);


  async function loadNotifications() {

    try {

      const response = await fetch(
        `${apiUrl}/notifications`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();


      if (Array.isArray(data)) {

        setNotifications(data);

      }

    } catch (error) {

      console.error(
        "Notification loading error:",
        error
      );

    }

  }


  // =========================
  // DYNAMIC TIME AGO
  // =========================

  function getTimeAgo(date) {

    if (!date) return "Just now";


    const now = new Date();


    // SQLite datetime format support
    const notificationDate = new Date(
      date.includes("T")
        ? date
        : date.replace(" ", "T") + "Z"
    );


    const difference = Math.max(
      0,
      Math.floor(
        (now - notificationDate) / 1000
      )
    );


    // JUST NOW
    if (difference < 5) {

      return "Just now";

    }


    // SECONDS
    if (difference < 60) {

      return `${difference} sec${difference === 1 ? "" : "s"} ago`;

    }


    const minutes = Math.floor(
      difference / 60
    );


    // MINUTES
    if (minutes < 60) {

      return `${minutes} min${minutes === 1 ? "" : "s"} ago`;

    }


    const hours = Math.floor(
      minutes / 60
    );


    // HOURS
    if (hours < 24) {

      return `${hours} hour${hours === 1 ? "" : "s"} ago`;

    }


    const days = Math.floor(
      hours / 24
    );


    return `${days} day${days === 1 ? "" : "s"} ago`;

  }


  // =========================
  // LOGOUT
  // =========================

  async function handleLogout() {

    try {

      await logoutUser();

    } catch (error) {

      console.error(
        "Logout error:",
        error
      );

    } finally {

      navigate("/login");

    }

  }


  // =========================
  // NAVBAR UI
  // =========================

  return (

    <div
      className="
        bg-white/60
        dark:bg-[#0f172a]/80

        backdrop-blur-md

        rounded-3xl

        shadow-lg

        border
        border-gray-100
        dark:border-gray-800

        px-8
        py-5

        flex
        items-center
        justify-between

        transition-all
        duration-300
      "
    >


      {/* ================= TITLE ================= */}

      <div>

        <h1
          className="
            text-3xl
            font-bold
            text-slate-900
            dark:text-white
          "
        >
          {t("Dashboard")}
        </h1>


        <p
          className="
            text-gray-500
            dark:text-gray-300
            mt-1
            text-sm
          "
        >
          {t("WelcomeBack")}
        </p>

      </div>



      {/* ================= SEARCH ================= */}

      <div className="hidden lg:block relative w-[420px]">

        <FaSearch
          className="
            absolute
            left-5
            top-4
            text-gray-400
          "
        />


        <input
          value={search}
          onChange={(e) =>
            setSearch && setSearch(e.target.value)
          }
          type="text"
          placeholder={t("SearchPlaceholder")}
          className="
            w-full

            bg-white/10
            dark:bg-[#0f172a]/40

            pl-14
            pr-5
            py-3

            rounded-2xl

            outline-none

            text-slate-900
            dark:text-white

            focus:ring-2
            focus:ring-blue-500

            transition
          "
        />

      </div>



      {/* ================= RIGHT ACTIONS ================= */}

      <div
        className="
          flex
          items-center
          gap-5
        "
      >


        {/* ================= NOTIFICATIONS ================= */}

        <div className="relative">


          <button
            onClick={() => {

              setNotificationOpen(
                !notificationOpen
              );

              setOpen(false);

            }}
            className="
              relative

              w-12
              h-12

              rounded-2xl

              bg-gray-100
              dark:bg-white/10

              hover:bg-blue-600
              hover:text-white

              hover:scale-110

              transition-all
              duration-300

              flex
              items-center
              justify-center
            "
          >

            <FaBell className="text-lg" />


            {notifications.length > 0 && (

              <span
                className="
                  absolute
                  -top-1
                  -right-1

                  bg-red-500
                  text-white

                  min-w-5
                  h-5
                  px-1

                  rounded-full

                  text-[10px]

                  flex
                  items-center
                  justify-center

                  font-bold
                "
              >
                {notifications.length}
              </span>

            )}

          </button>



          {/* NOTIFICATION PANEL */}

          {notificationOpen && (

            <div
              className="
                absolute
                right-0
                mt-4

                w-[370px]
                max-h-[500px]

                overflow-y-auto

                bg-white
                dark:bg-[#111827]

                border
                border-gray-200
                dark:border-gray-700

                rounded-3xl

                shadow-2xl

                z-[100]

                overflow-hidden

                origin-top-right

                animate-[fadeIn_.25s_ease-out]
              "
            >


              {/* HEADER */}

              <div
                className="
                  px-6
                  py-5

                  border-b
                  border-gray-200
                  dark:border-gray-700

                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <h2
                    className="
                      font-bold
                      text-lg

                      text-slate-900
                      dark:text-white
                    "
                  >
                    Notifications
                  </h2>


                  <p
                    className="
                      text-xs

                      text-gray-500
                      dark:text-gray-400

                      mt-1
                    "
                  >
                    {notifications.length} notification
                    {notifications.length !== 1
                      ? "s"
                      : ""}
                  </p>

                </div>


                <FaCheck
                  className="
                    text-blue-500
                    text-lg
                  "
                />

              </div>



              {/* NOTIFICATIONS */}

              <div
                className="
                  p-3
                  space-y-2
                "
              >


                {notifications.length === 0 ? (

                  <div
                    className="
                      text-center
                      py-12

                      text-gray-500
                      dark:text-gray-400
                    "
                  >

                    <FaBell
                      className="
                        mx-auto
                        text-4xl
                        mb-4
                        opacity-30
                      "
                    />


                    <p className="font-medium">

                      No notifications yet

                    </p>


                    <p
                      className="
                        text-xs
                        mt-1
                        opacity-70
                      "
                    >

                      Your updates will appear here

                    </p>

                  </div>

                ) : (


                  notifications.map(
                    (notification) => (

                      <div
                        key={notification.id}

                        className="
                          group

                          flex
                          gap-4

                          p-4

                          rounded-2xl

                          hover:bg-blue-50
                          dark:hover:bg-white/5

                          hover:translate-x-1

                          transition-all
                          duration-300
                        "
                      >


                        {/* ICON */}

                        <div
                          className={`
                            w-11
                            h-11

                            shrink-0

                            rounded-xl

                            flex
                            items-center
                            justify-center

                            transition-all
                            duration-300

                            group-hover:scale-110

                            ${
                              notification.type === "like"
                                ? `
                                  bg-pink-500/10
                                  text-pink-500
                                `
                                : `
                                  bg-blue-500/10
                                  text-blue-500
                                `
                            }
                          `}
                        >

                          {notification.type ===
                          "like"

                            ? <FaHeart />

                            : <FaUserPlus />

                          }

                        </div>



                        {/* TEXT */}

                        <div className="flex-1">


                          <h3
                            className="
                              text-sm
                              font-bold

                              text-slate-900
                              dark:text-white
                            "
                          >
                            {notification.title}
                          </h3>


                          <p
                            className="
                              text-xs

                              mt-1

                              text-gray-500
                              dark:text-gray-400

                              leading-5
                            "
                          >
                            {notification.message}
                          </p>


                          {/* REAL DYNAMIC TIME */}

                          <p
                            className={`
                              text-xs
                              mt-2
                              font-medium

                              ${
                                notification.type ===
                                "like"

                                  ? "text-pink-500"

                                  : "text-blue-500"
                              }
                            `}
                          >

                            {getTimeAgo(
                              notification.created_at
                            )}

                          </p>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </div>

          )}

        </div>



        {/* ================= MESSAGES ================= */}

        <button
          onClick={() => {

            navigate("/messages");

          }}
          className="
            relative

            w-12
            h-12

            rounded-2xl

            bg-gray-100
            dark:bg-white/10

            hover:bg-green-600
            hover:text-white

            hover:scale-110

            transition-all
            duration-300

            flex
            items-center
            justify-center
          "
        >

          <FaEnvelope className="text-lg" />

        </button>



        {/* ================= THEME ================= */}

        <button
          onClick={toggleTheme}
          className="
            w-12
            h-12

            rounded-full

            bg-blue-100
            dark:bg-gray-700

            text-blue-600
            dark:text-yellow-300

            hover:scale-110
            hover:rotate-12

            transition-all
            duration-300

            flex
            items-center
            justify-center
          "
        >

          {darkMode

            ? <FaSun className="text-lg" />

            : <FaMoon className="text-lg" />

          }

        </button>



        {/* ================= PROFILE ================= */}

        <div className="relative">


          <button
            onClick={() => {

              setOpen(!open);

              setNotificationOpen(false);

            }}
            className="
              flex
              items-center
              gap-3

              bg-gray-100
              dark:bg-white/10

              hover:bg-gray-200
              dark:hover:bg-white/20

              rounded-2xl

              px-3
              py-2

              transition-all
              duration-300
            "
          >


            <img
              src={
                user?.photo ||
                "https://i.pravatar.cc/150"
              }

              alt="Profile"

              className="
                w-12
                h-12

                rounded-full

                object-cover

                border-2
                border-blue-500
              "
            />


            <div
              className="
                hidden
                xl:block

                text-left
              "
            >

              <h2
                className="
                  font-bold

                  text-slate-800
                  dark:text-white
                "
              >

                {user?.name || "Traveler"}

              </h2>


              <p
                className="
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >

                Premium Traveler

              </p>

            </div>

          </button>



          {/* PROFILE DROPDOWN */}

          {open && (

            <div
              className="
                absolute
                right-0
                mt-3

                w-56

                bg-white
                dark:bg-[#111827]

                rounded-2xl

                shadow-2xl

                border
                border-gray-100
                dark:border-gray-700

                overflow-hidden

                z-[100]
              "
            >


              {/* PROFILE */}

              <button
                onClick={() => {

                  navigate("/profile");

                  setOpen(false);

                }}
                className="
                  w-full

                  flex
                  items-center
                  gap-3

                  px-5
                  py-4

                  text-left

                  hover:bg-gray-100
                  dark:hover:bg-white/5

                  transition
                "
              >

                <FaUserCircle />

                {t("Profile")}

              </button>



              {/* SETTINGS */}

              <button
                onClick={() => {

                  navigate("/settings");

                  setOpen(false);

                }}
                className="
                  w-full

                  flex
                  items-center
                  gap-3

                  px-5
                  py-4

                  text-left

                  hover:bg-gray-100
                  dark:hover:bg-white/5

                  transition
                "
              >

                <FaCog />

                {t("Settings")}

              </button>



              <hr className="dark:border-gray-700" />



              {/* LOGOUT */}

              <button
                onClick={handleLogout}
                className="
                  w-full

                  text-red-600

                  font-semibold

                  px-5
                  py-4

                  hover:bg-red-50
                  dark:hover:bg-red-500/10

                  text-left

                  transition
                "
              >

                Logout

              </button>

            </div>

          )}

        </div>

      </div>

    </div>

  );

}