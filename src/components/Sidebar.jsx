import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaCog,
  FaCreditCard,
  FaGlobe,
  FaHome,
  FaLanguage,
  FaMapMarkerAlt,
  FaPalette,
  FaPlane,
  FaShieldAlt,
  FaTrash,
  FaUser,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const navigate = useNavigate();

  const menu = [
    { name: "Dashboard", icon: <FaHome />, path: "/" },
    { name: "Trips", icon: <FaPlane />, path: "/trips" },
    { name: "Destinations", icon: <FaMapMarkerAlt />, path: "/destinations" },
    { name: "Travelers", icon: <FaUsers />, path: "/travelers" },
    { name: "Profile", icon: <FaUserCircle />, path: "/profile" },
    { name: "Settings", icon: <FaCog />, path: "/settings" },
  ];

  const openSettingsSection = (section) => {
    setShowSettingsMenu(false);

    navigate("/settings", {
      state: {
        section,
      },
    });
  };

  return (
    <div
      className={`${collapsed ? "w-20" : "w-[290px]"}
  min-h-screen
  bg-[#0B1220]
  border-r
  border-slate-800
  text-white
  flex
  flex-col
  justify-between
  transition-all
  duration-300
  ease-in-out
  overflow-visible
`}
    >

      <div>

        <div
          className={`border-b border-slate-800 py-6 px-4 flex items-center ${collapsed ? "justify-center flex-col gap-4" : "justify-between"
            }`}
        >

          <div className="flex items-center gap-3">

            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <FaGlobe className="text-white text-xl" />
            </div>

            {!collapsed && (
              <div>
                <h1 className="text-xl font-bold tracking-wide">
                  TravelHub
                </h1>

                <p className="text-xs text-slate-400">
                  Premium Travel Dashboard
                </p>
              </div>
            )}

          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="h-10 w-10 rounded-xl flex items-center justify-center
             hover:bg-slate-800 transition"
          >
            <FaBars />
          </button>

        </div>

        <div className="px-3 mt-7">

          {menu.map((item) => {
            if (item.name === "Settings") {
              return (
                <div key={item.name} className="relative overflow-visible">
                  <button
                    onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                    className={`w-full group flex items-center
          ${collapsed ? "justify-center" : "justify-start"}
          ${collapsed ? "" : "gap-4"}
          ${collapsed ? "px-0" : "px-4"}
          py-3.5
          mb-2
          rounded-2xl
          transition-all
          duration-300
          hover:bg-slate-800 hover:translate-x-1`}
                  >
                    <span className="text-[20px]">{item.icon}</span>

                    {!collapsed && (
                      <span className="font-medium tracking-wide">
                        {item.name}
                      </span>
                    )}
                  </button>

                  {showSettingsMenu && !collapsed && (
                    <div
                      className="
    absolute
    left-full
    top-0
    ml-4
    w-72
    bg-white
    rounded-3xl
    shadow-2xl
    border
    border-gray-200
    z-[9999]
    overflow-hidden
  "
                    >

                      <div className="px-5 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <h2 className="text-lg font-bold">
                          ⚙️ Settings
                        </h2>

                        <p className="text-sm text-blue-100">
                          Customize your travel experience
                        </p>
                      </div>

                      <div className="py-2">

                        <button
                          onClick={() => openSettingsSection("profile")}
                          className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                        >
                          <FaUser className="text-blue-600" />
                          Profile
                        </button>

                        <button
                          onClick={() => openSettingsSection("theme")}
                          className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                        >
                          <FaPalette className="text-purple-600" />
                          Appearance
                        </button>

                        <button
                          onClick={() => openSettingsSection("notifications")}
                          className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                        >
                          <FaBell className="text-yellow-500" />
                          Notifications
                        </button>

                        <button
                          onClick={() => openSettingsSection("security")}
                          className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                        >
                          <FaShieldAlt className="text-green-600" />
                          Security
                        </button>

                        <button
                          onClick={() => openSettingsSection("travelStyle")}
                          className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                        >
                          <FaGlobe className="text-cyan-600" />
                          Travel Style
                        </button>

                        <button
                          onClick={() => openSettingsSection("location")}
                          className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                        >
                          <FaMapMarkerAlt className="text-red-500" />
                          Home Location
                        </button>

                        <button className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-200">
                          <FaCreditCard className="text-indigo-600" />
                          Payments
                        </button>

                        <button className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-200">
                          <FaLanguage className="text-pink-500" />
                          Language
                        </button>

                        <button
                          onClick={() => openSettingsSection("Danger Zone")}
                          className="w-full px-5 py-3 flex items-center gap-4 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition duration-200"
                        >
                          <FaMapMarkerAlt className="text-red-500" />
                          Danger Zone
                        </button>

                      </div>

                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `group flex items-center
        ${collapsed ? "justify-center" : "justify-start"}
        ${collapsed ? "" : "gap-4"}
        ${collapsed ? "px-0" : "px-4"}
        py-3.5
        mb-2
        rounded-2xl
        transition-all
        duration-300
        ${isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30"
                    : "hover:bg-slate-800 hover:translate-x-1"
                  }`
                }
              >
                <span className="text-[20px]">{item.icon}</span>

                {!collapsed && (
                  <span className="font-medium tracking-wide">
                    {item.name}
                  </span>
                )}
              </NavLink>
            );
          })}



        </div>
        {!collapsed && (
          <div className="px-5 mt-8">

            <h2 className="text-xs uppercase tracking-[3px] text-slate-500 mb-4">
              Recent Trips
            </h2>

            <div className="space-y-3">

              <div className="bg-slate-800 hover:bg-slate-700 rounded-2xl p-4 transition cursor-pointer">
                <p className="font-semibold">🏝 Bali</p>
                <p className="text-xs text-slate-400">Indonesia</p>
              </div>

              <div className="bg-slate-800 hover:bg-slate-700 rounded-2xl p-4 transition cursor-pointer">
                <p className="font-semibold">🗼 Paris</p>
                <p className="text-xs text-slate-400">France</p>
              </div>

              <div className="bg-slate-800 hover:bg-slate-700 rounded-2xl p-4 transition cursor-pointer">
                <p className="font-semibold">🗻 Tokyo</p>
                <p className="text-xs text-slate-400">Japan</p>
              </div>

            </div>

          </div>
        )}

      </div>



      {!collapsed && (
        <div className="m-5">

          <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 relative overflow-hidden">

            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10"></div>
            <div className="absolute -left-10 bottom-0 h-20 w-20 rounded-full bg-white/10"></div>

            <div className="relative">

              <h2 className="text-xl font-bold">
                Premium
              </h2>

              <p className="text-sm text-blue-100 mt-3 leading-6">
                Unlimited Bookings
                <br />
                Hotel Discounts
                <br />
                Priority Support
              </p>

              <button
                className="mt-6 w-full rounded-2xl bg-white text-blue-700 py-3 font-semibold hover:scale-105 transition"
              >
                Upgrade →
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}