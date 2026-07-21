import {
  FaHome,
  FaPlane,
  FaMapMarkerAlt,
  FaUser,
  FaCog,
  FaGlobe,
  FaUsers
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

export default function Sidebar() {

  return (

    <div className="w-full lg:w-72 xl:w-[320px] min-h-screen bg-gradient-to-b from-[#021B4E] to-[#0D2555] text-white p-6 pt-8 pb-6 flex flex-col justify-between rounded-l-[28px] shadow-xl">

      <div>

        <div className="flex items-center gap-4 mb-8">

          <FaGlobe className="text-4xl text-blue-400 drop-shadow-lg" />

          <h1 className="text-3xl font-poppins font-bold tracking-tight">
            Travel
          </h1>

        </div>

        <ul className="space-y-3">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-[22px] transition-all duration-300 text-base font-poppins font-semibold ${isActive
                ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg hover:shadow-xl scale-105"
                : "text-gray-200 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <FaHome className="text-2xl" />
            Dashboard
          </NavLink>

          <NavLink
            to="/trips"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-[22px] transition-all duration-300 text-base font-poppins font-semibold ${isActive
                ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg hover:shadow-xl scale-105"
                : "text-gray-200 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <FaPlane className="text-2xl" />
            Trips
          </NavLink>

          <NavLink
            to="/destinations"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-[22px] transition-all duration-300 text-base font-poppins font-semibold ${isActive
                ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg hover:shadow-xl scale-105"
                : "text-gray-200 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <FaMapMarkerAlt className="text-2xl" />
            Destinations
          </NavLink>

          <NavLink
            to="/travelers"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-[22px] transition-all duration-300 text-base font-poppins font-semibold ${isActive
                ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg hover:shadow-xl scale-105"
                : "text-gray-200 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <FaUsers className="text-2xl" />
            Travelers
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-[22px] transition-all duration-300 text-base font-poppins font-semibold ${isActive
                ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg hover:shadow-xl scale-105"
                : "text-gray-200 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <FaUser className="text-2xl" />
            Profile
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-[22px] transition-all duration-300 text-base font-poppins font-semibold ${isActive
                ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg hover:shadow-xl scale-105"
                : "text-gray-200 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <FaCog className="text-2xl" />
            Settings
          </NavLink>

        </ul>

      </div>

      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-600 via-purple-500 to-pink-600 p-6 text-center shadow-2xl before:absolute before:inset-0 before:rounded-[28px] before:bg-white/5 before:backdrop-blur-sm">

        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-2xl font-poppins font-bold text-white tracking-tight leading-snug">
            Plan your next adventure
          </h2>

          <p className="mt-4 text-sm text-blue-100/90 font-inter font-semibold uppercase tracking-[0.2em]">
            Explore the world with us
          </p>

          <button className="relative mt-6 inline-flex items-center gap-2 rounded-full bg-white text-blue-600 px-8 py-3 font-poppins font-bold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Explore Now
          </button>
        </div>

      </div>

    </div>
  );
}