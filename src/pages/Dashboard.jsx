import { FaSuitcase, FaPlane, FaCalendarAlt, FaDollarSign, FaLightbulb, FaMapMarkerAlt } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import TripCard from "../components/TripCard";
import MapView from "../components/MapView";
import { useState } from "react";
const stats = [
  { title: "Total Trips", value: "12", color: "bg-blue-600", icon: <FaSuitcase /> },
  { title: "Upcoming Flights", value: "5", color: "bg-green-500", icon: <FaPlane /> },
  { title: "Bookings", value: "18", color: "bg-purple-500", icon: <FaCalendarAlt /> },
  { title: "Total Spent", value: "₹2450", color: "bg-yellow-400", icon: <FaDollarSign /> },
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

const quickStart = [
  {
    title: "Start your first trip",
    description: "Add your first destination, dates and budget to get going.",
    icon: <FaLightbulb className="text-2xl text-white" />,
    gradient: "from-cyan-500 via-sky-600 to-indigo-600",
    step: "Step 1",
  },
  {
    title: "Discover popular spots",
    description: "Explore top beginner-friendly locations and save favorites.",
    icon: <FaMapMarkerAlt className="text-2xl text-white" />,
    gradient: "from-purple-500 via-fuchsia-600 to-pink-500",
    step: "Step 2",
  },
  {
    title: "Customize your profile",
    description: "Set travel preferences so the app works for you.",
    icon: <FaSuitcase className="text-2xl text-white" />,
    gradient: "from-emerald-500 via-lime-500 to-emerald-600",
    step: "Step 3",
  },
];

export default function Index() {
  const [search, setSearch] = useState('')

  const filteredTrips = trips.filter((items) => {
    return (
      items.title.toLowerCase().includes(search.toLowerCase()) || items.location.toLowerCase().includes(search.toLowerCase())
    )

  })
  return (
    <div className="bg-[#020B2D] min-h-screen p-6">
      <div className="bg-[#F5F5F5] rounded-[40px] overflow-hidden flex flex-col lg:flex-row min-h-[calc(100vh-3rem)] shadow-xl">
        <Sidebar />

        <div className="flex-1 p-8 lg:p-10">
          <Navbar search={search} setSearch={setSearch} />

          <div className="space-y-10 mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
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

            <div className="mt-8">
              <div className="flex flex-col gap-4 mb-8">
                <h1 className="text-5xl font-playfair font-black bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent tracking-tight">
                  Travel Launchpad
                </h1>
                <p className="text-body text-gray-600 max-w-2xl">
                  Fast actions to start your first trip and explore with confidence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickStart.map((item, index) => (
                  <div
                    key={index}
                    className={`group relative overflow-hidden rounded-3xl p-6 text-white shadow-2xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-br ${item.gradient}`}
                  >
                    <div className="absolute inset-x-0 top-0 h-32 bg-white/10 blur-3xl" />
                    <div className="relative z-10 flex items-center justify-between mb-5">
                      <span className="text-[11px] uppercase tracking-[0.3em] text-white/80">{item.step}</span>
                      <div className="w-14 h-14 rounded-3xl bg-white/15 flex items-center justify-center text-white shadow-lg">
                        {item.icon}
                      </div>
                    </div>
                    <h2 className="relative z-10 text-xl font-poppins font-bold mb-3 text-white drop-shadow-md tracking-tight">{item.title}</h2>
                    <p className="relative z-10 text-sm text-white/80 leading-relaxed mb-6 font-inter font-medium">{item.description}</p>
                    <button className="relative z-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20">
                      Try it now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr] mb-8">
                <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-md hover:shadow-lg transition-all duration-300">
                  <p className="text-accent text-emerald-600">
                    🌍 Destination
                  </p>
                  <h2 className="mt-4 text-6xl font-playfair font-black text-slate-900 tracking-tight">
                    Maldives
                  </h2>
                  <p className="mt-4 text-body text-gray-700 max-w-xl">
                    Perfect tropical paradise with crystal clear waters, vibrant coral reefs, and luxury resorts.
                  </p>
                </div>

                <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-sky-500 p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <p className="text-accent text-cyan-100/80">
                      🎯 Navigation
                    </p>
                    <p className="mt-4 text-xl font-poppins font-bold tracking-tight">
                      Use <span className="font-black">Ctrl + Scroll</span> to explore
                    </p>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs uppercase tracking-[0.25em] font-bold text-white/95 backdrop-blur-sm">
                    💡 Pro tip
                  </div>
                </div>
              </div>

              <MapView />
            </div>

            <div>
              <h1 className="text-5xl font-playfair font-black text-slate-900 mb-7 tracking-tight">
                Your Trips
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredTrips.map((item, index) => (
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
    </div>
  );
}