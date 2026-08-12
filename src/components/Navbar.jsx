import {
  FaBell,
  FaEnvelope,
  FaMoon,
  FaSearch,
  FaCog,
  FaUserCircle,
} from "react-icons/fa";

import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar({ search, setSearch }) {

  const [open, setOpen] = useState(false);

  const { darkMode, toggleTheme } = useTheme();

  const { t } = useLanguage();

  return (

    <div
      className="
bg-white/60
dark:bg-gray-900/70

backdrop-blur-md

rounded-3xl

shadow-lg

border
border-gray-100
dark:border-gray-700

px-8
py-5

flex
items-center
justify-between

transition-all
duration-300
"
    >



      <div>

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          {t("Dashboard")}
        </h1>

        <p className="text-gray-500 dark:text-gray-300 mt-1 text-sm">
          {t("WelcomeBack")}
        </p>

      </div>



      <div className="hidden lg:block relative w-[420px]">

        <FaSearch
          className="absolute left-5 top-4 text-gray-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder={t("SearchPlaceholder")}
          className="w-full bg-white/20 pl-14 pr-5 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-900"
        />

      </div>



      <div className="flex items-center gap-5">



        <button className="relative w-12 h-12 rounded-2xl bg-white/30 hover:bg-blue-600 hover:text-white transition flex items-center justify-center">

          <FaBell className="text-lg" />

          <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold">
            3
          </span>

        </button>



        <button className="relative w-12 h-12 rounded-2xl bg-white/30 hover:bg-green-600 hover:text-white transition flex items-center justify-center">

          <FaEnvelope className="text-lg" />

          <span className="absolute -top-1 -right-1 bg-green-500 text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold">
            5
          </span>

        </button>

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
    transition-all
    duration-300
    flex
    items-center
    justify-center
  "
>
  {darkMode ? "☀️" : <FaMoon className="text-lg" />}
</button>



        <div className="relative">

          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 bg-white/30 hover:bg-gray-200/50 rounded-2xl px-3 py-2 transition"
          >

            <img
              src="https://i.pravatar.cc/150"
              alt=""
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
            />

            <div className="hidden xl:block text-left">

              <h2 className="font-bold text-slate-800 dark:text-white">
                Bhargav
              </h2>

              <p className="text-xs text-gray-500">
                Premium Traveler
              </p>

            </div>

          </button>



          {
            open && (

              <div className="absolute right-0 mt-3 w-56 bg-white/95 rounded-2xl shadow-2xl border-gray-100 overflow-hidden z-50 backdrop-blur-sm">
                <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-100">

                  <FaUserCircle />

                  {t("Profile")}

                </button>

                <button className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-100">

                  <FaCog />

                  {t("Settings")}

                </button>

                <hr />

                <button className="w-full text-red-600 font-semibold px-5 py-4 hover:bg-red-50 text-left">

                  Logout

                </button>

              </div>

            )
          }

        </div>

      </div>

    </div>

  );

}