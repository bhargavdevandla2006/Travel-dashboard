import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaMapMarkerAlt, FaStar, FaPlane } from "react-icons/fa";

export default function TripDetails() {

  return (

    <div className="bg-[#020B2D] min-h-screen p-6">

      <div className="bg-[#F5F5F5] rounded-[40px] overflow-hidden flex">

        <Sidebar />

        <div className="flex-1 p-10">

          <Navbar />

          <div className="mt-10">

            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
              alt=""
              className="w-full h-[400px] object-cover rounded-3xl shadow-lg"
            />

            <div className="mt-8 flex justify-between items-center">

              <div>

                <h1 className="text-5xl font-bold text-gray-900">
                  Maldives Escape
                </h1>

                <p className="text-gray-500 mt-3 flex items-center gap-2 text-lg">

                  <FaMapMarkerAlt />

                  Maldives

                </p>

              </div>

              <div className="bg-blue-600 text-white px-8 py-4 rounded-3xl shadow-lg">

                <h1 className="text-3xl font-bold">
                  ₹1,25,000
                </h1>

              </div>

            </div>

            <div className="grid grid-cols-3 gap-6 mt-10">

              <div className="bg-white p-6 rounded-3xl shadow-md">

                <div className="flex items-center gap-3">

                  <FaStar className="text-yellow-400 text-2xl" />

                  <h1 className="text-2xl font-bold">
                    Rating
                  </h1>

                </div>

                <p className="text-gray-500 mt-4">
                  4.9 / 5 Excellent Reviews
                </p>

              </div>

              <div className="bg-white p-6 rounded-3xl shadow-md">

                <div className="flex items-center gap-3">

                  <FaPlane className="text-blue-600 text-2xl" />

                  <h1 className="text-2xl font-bold">
                    Flights
                  </h1>

                </div>

                <p className="text-gray-500 mt-4">
                  Direct flights available
                </p>

              </div>

              <div className="bg-white p-6 rounded-3xl shadow-md">

                <div className="flex items-center gap-3">

                  🌍

                  <h1 className="text-2xl font-bold">
                    Best Season
                  </h1>

                </div>

                <p className="text-gray-500 mt-4">
                  November to April
                </p>

              </div>

            </div>

            <div className="mt-12 bg-white p-8 rounded-3xl shadow-md">

              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                About This Trip
              </h1>

              <p className="text-gray-600 leading-8 text-lg">

                Experience crystal-clear beaches, luxury resorts,
                beautiful sunsets, water adventures, and relaxing
                island vibes in Maldives. Perfect destination for
                couples, family vacations, and unforgettable memories.

              </p>

            </div>

            <div className="mt-12">

              <h1 className="text-3xl font-bold text-gray-900 mb-6">
                Location Map
              </h1>

              <iframe
                title="map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127055.7643192643!2d73.22068095!3d3.11322865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x24b3f7e2d9c8b4cb%3A0x5b3e0d7f3f7a7c29!2sMaldives!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="400"
                className="rounded-3xl border-0 shadow-lg"
                allowFullScreen=""
                loading="lazy"
              ></iframe>

            </div>

            <button className="mt-12 bg-blue-600 text-white px-10 py-5 rounded-3xl text-xl font-bold hover:bg-blue-700 transition shadow-lg">

              Book This Trip

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}