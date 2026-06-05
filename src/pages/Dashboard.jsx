import { FaSuitcase, FaPlane, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import DestinationCard from "../components/DestinationCard";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import TripCard from "../components/TripCard";
import MapView from "../components/MapView";
const stats = [
  { title: "Total Trips", value: "12", color: "bg-blue-600", icon: <FaSuitcase /> },
  { title: "Upcoming Flights", value: "5", color: "bg-green-500", icon: <FaPlane /> },
  { title: "Bookings", value: "18", color: "bg-purple-500", icon: <FaCalendarAlt /> },
  { title: "Total Spent", value: "₹2450", color: "bg-yellow-400", icon: <FaDollarSign /> },
];

const destinations = [
  {
    place: "Maldives",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    place: "Paris",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },
  {
    place: "Santorini",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80",
  },
  {
    place: "Dubai",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80",
  },
];

const trips = [
  {
    title: "Bali Getaway",
    location: "Bali, Indonesia",
    price: "₹850",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Paris Vacation",
    location: "Paris, France",
    price: "₹1200",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Venice Trip",
    location: "Venice, Italy",
    price: "₹950",
    image: "https://venicelover.com/images/venice.jpg",
  },
  {
    title: "Switzerland Tour",
    location: "Switzerland",
    price: "₹1500",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80",
  },
];

export default function Index() {
  return (
    <div className="bg-[#020B2D] min-h-screen p-6">
      <div className="bg-[#F5F5F5] rounded-[40px] overflow-hidden flex">
        <Sidebar />

        <div className="flex-1 p-10">
          <Navbar />

          <div className="grid grid-cols-4 gap-6 mt-10">
            {stats.map((item, index) => (
              <StatsCard
                key={index}
                title={item.title}
                value={item.value}
                color={item.color}
                icon={item.icon}
              />
            ))}
          </div>

          <div className="mt-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Popular Destinations
            </h1>

            <div className="grid grid-cols-4 gap-6">
              {destinations.map((item, index) => (
                <DestinationCard
                  key={index}
                  place={item.place}
                  image={item.image}
                />
              ))}
            </div>
          </div>
          <div className="mt-12">
            <h1 className="text-3xl font-bold text-grey-900 mb-6"> Live Travel  map</h1>

            <MapView /> 
          </div>

          <div className="mt-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Your Trips
            </h1>

            <div className="grid grid-cols-4 gap-6">
              {trips.map((item, index) => (
                <TripCard
                  key={index}
                  title={item.title}
                  location={item.location}
                  price={item.price}
                  image={item.image}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}