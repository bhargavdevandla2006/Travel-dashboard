import {
  FaHome,
  FaPlane,
  FaHotel,
  FaMapMarkerAlt,
  FaClipboardList,
  FaUser,
  FaCog,
  FaGlobe,
} from "react-icons/fa";

import { Link } from "react-router-dom";

export default function Sidebar() {

  return (

    <div className="w-64 min-h-screen bg-[#021B4E] text-white p-6 flex flex-col justify-between rounded-l-[30px]">

      <div>

        <div className="flex items-center gap-3 mb-10">

          <FaGlobe className="text-3xl text-blue-500" />

          <h1 className="text-4xl font-bold">
            Travel
          </h1>

        </div>

        <ul className="space-y-2">

          <Link to="/">

            <li className="flex items-center gap-3 bg-blue-600 px-5 py-3 rounded-2xl font-semibold shadow-md hover:bg-blue-700 transition">

              <FaHome />

              Dashboard

            </li>

          </Link>

          <Link to="/trips">

            <li className="flex items-center gap-3 px-5 py-3 hover:bg-[#0B2A66] rounded-2xl transition cursor-pointer hover:shadow-md font-medium">

              <FaPlane />

              Trips

            </li>

          </Link>

          <Link to="/destinations">

            <li className="flex items-center gap-3 px-5 py-3 hover:bg-[#0B2A66] rounded-2xl transition cursor-pointer hover:shadow-md font-medium">

              <FaMapMarkerAlt />

              Destinations

            </li>

          </Link>

          <Link to="/profile">

            <li className="flex items-center gap-3 px-5 py-3 hover:bg-[#0B2A66] rounded-2xl transition cursor-pointer hover:shadow-md font-medium">

              <FaUser />

              Profile

            </li>

          </Link>

          <Link to="/settings">

            <li className="flex items-center gap-3 px-5 py-3 hover:bg-[#0B2A66] rounded-2xl transition cursor-pointer hover:shadow-md font-medium">

              <FaCog />

              Settings

            </li>

          </Link>

        </ul>

      </div>

      <div className="text-sm bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-5 rounded-3xl text-center shadow-lg">

        <h1 className="text-sm font-bold leading-tight text-white">

          Plan your next adventure

        </h1>

        <p className="mt-2 text-xs text-blue-100 font-medium">

          Explore the world with us

        </p>

        <button className="bg-white text-blue-600 font-bold px-6 py-2 rounded-full mt-4 hover:shadow-lg transition">

          Explore Now

        </button>

      </div>

    </div>
  );
}