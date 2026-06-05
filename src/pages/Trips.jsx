import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TripCard from "../components/TripCard";

const trips = [

  {
    id: 1,
    title: "Bali Getaway",
    location: "Bali, Indonesia",
    price: "₹85,000",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 2,
    title: "Paris Vacation",
    location: "Paris, France",
    price: "₹1,20,000",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 3,
    title: "Dubai Luxury",
    location: "Dubai, UAE",
    price: "₹95,000",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 4,
    title: "Swiss Adventure",
    location: "Switzerland",
    price: "₹1,50,000",
    image:
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 5,
    title: "Tokyo Tour",
    location: "Tokyo, Japan",
    price: "₹1,10,000",
    image:
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 6,
    title: "Maldives Escape",
    location: "Maldives",
    price: "₹1,25,000",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },

];

export default function Trips() {

  return (

    <div className="bg-[#020B2D] min-h-screen p-6">

      <div className="bg-[#F5F5F5] rounded-[40px] overflow-hidden flex">

        <Sidebar />

        <div className="flex-1 p-10">

          <Navbar />

          <div className="flex justify-between items-center mt-10">

            <div>

              <h1 className="text-5xl font-bold text-gray-900">
                Explore Trips
              </h1>

              <p className="text-gray-500 mt-3 text-lg">
                Discover beautiful destinations around the world 
              </p>

            </div>

            <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg">

              + Add New Trip

            </button>

          </div>

          <div className="grid grid-cols-3 gap-8 mt-12">

            {
              trips.map((trip) => (

                <TripCard
                  key={trip.id}
                  title={trip.title}
                  location={trip.location}
                  price={trip.price}
                  image={trip.image}
                />

              ))
            }

          </div>

        </div>

      </div>

    </div>
  );
}