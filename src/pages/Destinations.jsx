import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const destinations = [

  {
    name: "Maldives",
    country: "Indian Ocean",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },

  {
    name: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
  },

  {
    name: "Tokyo",
    country: "Japan",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
  },

  {
    name: "Dubai",
    country: "UAE",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  },

];

export default function Destinations() {

  return (

    <div className="bg-[#020B2D] min-h-screen p-6">

      <div className="bg-[#F5F5F5] rounded-[40px] overflow-hidden flex">

        <Sidebar />

        <div className="flex-1 p-10">

          <Navbar />

          <div className="flex justify-between items-center mt-10">

            <div>

              <h1 className="text-5xl font-bold text-gray-900">
                Explore Destinations 
              </h1>

              <p className="text-gray-500 mt-3 text-lg">
                Discover your dream vacation spots
              </p>

            </div>

            <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition">

              + Add Destination

            </button>

          </div>

          <div className="grid grid-cols-2 gap-8 mt-12">

            {
              destinations.map((place, index) => (

                <div
                  key={index}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition hover:scale-105"
                >

                  <img
                    src={place.image}
                    alt=""
                    className="h-72 w-full object-cover"
                  />

                  <div className="p-6">

                    <h1 className="text-3xl font-bold">
                      {place.name}
                    </h1>

                    <p className="text-gray-500 mt-2">
                      {place.country}
                    </p>

                    <div className="flex gap-4 mt-6">

                      <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition">

                        View Details

                      </button>

                      <button className="bg-gray-200 px-6 py-3 rounded-2xl hover:bg-gray-300 transition">

                        Save 

                      </button>

                    </div>

                  </div>

                </div>

              ))
            }

          </div>

        </div>

      </div>

    </div>
  );
}