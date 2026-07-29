import {
  FaBell,
  FaEnvelope,
  FaMoon,
  FaSearch
} from "react-icons/fa";

export default function Navbar() {

  return (

    <div className="bg-white rounded-2xl shadow-md px-8 py-5 flex items-center justify-between">

  

      <div className="relative w-[420px]">

        <FaSearch
          className="absolute left-4 top-4 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search trips, destinations..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      

      <div className="flex items-center gap-6">

        <button className="relative">

          <FaBell className="text-2xl text-gray-600 hover:text-blue-600 transition"/>

          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
            3
          </span>

        </button>

        <button className="relative">

          <FaEnvelope className="text-2xl text-gray-600 hover:text-blue-600 transition"/>

          <span className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
            5
          </span>

        </button>

        <button className="bg-gray-100 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition">

          <FaMoon />

        </button>

        <div className="flex items-center gap-3">

          <img

            src="https://i.pravatar.cc/150"

            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"

          />

          <div>

            <h2 className="font-bold">
              Bhargav
            </h2>

            <p className="text-gray-500 text-sm">
              Traveler
            </p>

          </div>

        </div>

      </div>

    </div>

  )

}