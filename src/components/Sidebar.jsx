import {
  FaHome,
  FaPlane,
  FaMapMarkerAlt,
  FaUser,
  FaCog,
  FaGlobe,
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

export default function Sidebar() {

  return (

    <div className="w-full lg:w-96 xl:w-[420px] min-h-screen bg-gradient-to-b from-[#021B4E] to-[#0D2555] text-white p-10 pt-16 pb-10 flex flex-col justify-between rounded-l-[40px] shadow-xl">

      <div>

        <div className="flex items-center gap-4 mb-20">

          <FaGlobe className="text-7xl text-blue-400 drop-shadow-lg" />

          <h1 className="text-6xl font-poppins font-black tracking-tighter">
            Travel
          </h1>

        </div>

        <ul className="space-y-6">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-5 px-8 py-5 rounded-[28px] transition-all duration-300 text-xl font-poppins font-semibold ${
                isActive
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
              `flex items-center gap-5 px-8 py-5 rounded-[28px] transition-all duration-300 text-xl font-poppins font-semibold ${
                isActive
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
              `flex items-center gap-5 px-8 py-5 rounded-[28px] transition-all duration-300 text-xl font-poppins font-semibold ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg hover:shadow-xl scale-105"
                  : "text-gray-200 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <FaMapMarkerAlt className="text-2xl" />
            Destinations
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-5 px-8 py-5 rounded-[28px] transition-all duration-300 text-xl font-poppins font-semibold ${
                isActive
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
              `flex items-center gap-5 px-8 py-5 rounded-[28px] transition-all duration-300 text-xl font-poppins font-semibold ${
                isActive
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

      <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-600 via-purple-500 to-pink-600 p-12 text-center shadow-2xl before:absolute before:inset-0 before:rounded-[40px] before:bg-white/5 before:backdrop-blur-sm">

        <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <h2 className="text-4xl font-poppins font-black text-white tracking-tight leading-snug">
            Plan your next adventure
          </h2>

          <p className="mt-5 text-base text-blue-100/90 font-inter font-semibold uppercase tracking-[0.2em]">
            Explore the world with us
          </p>

          <button className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white text-blue-600 px-12 py-5 font-poppins font-black text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Explore Now
          </button>
        </div>

      </div>

    </div>
  );
}