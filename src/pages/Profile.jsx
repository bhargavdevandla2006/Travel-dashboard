import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaUserEdit, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Profile() {

const handleLogout = () =>{
    localStorage.removeItem('token');
    window.location.href = '/login'
}

  return (

    <div className="bg-[#020B2D] min-h-screen p-6">

      <div className="bg-[#F5F5F5] rounded-[40px] overflow-hidden flex">

        <Sidebar />

        <div className="flex-1 p-10">

          <Navbar />

          <div className="mt-10 bg-white rounded-3xl p-10 shadow-lg">

            <div className="flex items-center gap-8">

              <img
                src="https://i.pravatar.cc/150"
                alt=""
                className="w-36 h-36 rounded-full object-cover shadow-lg"
              />

              <div>

                <h1 className="text-4xl font-bold text-gray-900">
                  Bhargav
                </h1>

                <p className="text-gray-500 mt-2 flex items-center gap-2">
                  <FaEnvelope />
                  bhargav@gmail.com
                </p>

                <p className="text-gray-500 mt-2 flex items-center gap-2">
                  <FaMapMarkerAlt />
                  Hyderabad, India
                </p>

                <button className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition">

                  <FaUserEdit />

                  Edit Profile

                </button>

              </div>

            </div>

            <div className="grid grid-cols-3 gap-6 mt-12">

              <div className="bg-blue-50 p-6 rounded-3xl">

                <h1 className="text-gray-500 text-sm">
                  Total Trips
                </h1>

                <h2 className="text-4xl font-bold text-blue-600 mt-3">
                  12
                </h2>

              </div>

              <div className="bg-purple-50 p-6 rounded-3xl">

                <h1 className="text-gray-500 text-sm">
                  Countries Visited
                </h1>

                <h2 className="text-4xl font-bold text-purple-600 mt-3">
                  8
                </h2>

              </div>

              <div className="bg-green-50 p-6 rounded-3xl">

                <h1 className="text-gray-500 text-sm">
                  Total Spending
                </h1>

                <h2 className="text-4xl font-bold text-green-600 mt-3">
                  ₹24,500
                </h2>

              </div>

            </div>

            <div className="mt-12">

              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Recent Activity
              </h1>

              <div className="space-y-4">

                <div className="bg-gray-100 p-5 rounded-2xl">
                   Booked a trip to Bali
                </div>

                <div className="bg-gray-100 p-5 rounded-2xl">
                  Reserved hotel in Paris
                </div>

                <div className="bg-gray-100 p-5 rounded-2xl">
                   Added Switzerland to wishlist
                </div>

              </div>

            </div>

            <button
              onClick={handleLogout}
              className="mt-10 bg-red-500 text-white px-8 py-4 rounded-2xl hover:bg-red-600 transition font-bold"
            >
              Logout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}