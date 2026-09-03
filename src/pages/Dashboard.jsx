import {
  FaSuitcase,
  FaPlane,
  FaCalendarAlt,
  FaDollarSign,
  FaLightbulb,
  FaMapMarkerAlt,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import TripCard from "../components/TripCard";
import MapView from "../components/MapView";

import { useState } from "react";
import { useTheme } from "../context/ThemeContext";



const stats = [
  {
    title: "Total Trips",
    value: "12",
    color: "bg-blue-600",
    icon: <FaSuitcase />,
  },
  {
    title: "Upcoming Flights",
    value: "5",
    color: "bg-green-500",
    icon: <FaPlane />,
  },
  {
    title: "Bookings",
    value: "18",
    color: "bg-purple-500",
    icon: <FaCalendarAlt />,
  },
  {
    title: "Total Spent",
    value: "₹2450",
    color: "bg-yellow-400",
    icon: <FaDollarSign />,
  },
];



const trips = [
  {
    id: 1,
    title: "Bali Getaway",
    location: "Bali, Indonesia",
    price: "₹850",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 2,
    title: "Paris Vacation",
    location: "Paris, France",
    price: "₹1200",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
  },

  {
    id: 3,
    title: "Venice Trip",
    location: "Venice, Italy",
    price: "₹950",
    image: "https://venicelover.com/images/venice.jpg",
  },

  {
    id: 4,
    title: "Switzerland Tour",
    location: "Switzerland",
    price: "₹1500",
    image:
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80",
  },
];



const quickStart = [
  {
    title: "Start your first trip",

    description:
      "Add your first destination, dates and budget to get going.",

    icon: (
      <FaLightbulb className="text-2xl text-white" />
    ),

    gradient:
      "from-cyan-500 via-sky-600 to-indigo-600",

    step: "Step 1",
  },

  {
    title: "Discover popular spots",

    description:
      "Explore top beginner-friendly locations and save favorites.",

    icon: (
      <FaMapMarkerAlt className="text-2xl text-white" />
    ),

    gradient:
      "from-purple-500 via-fuchsia-600 to-pink-500",

    step: "Step 2",
  },

  {
    title: "Customize your profile",

    description:
      "Set travel preferences so the app works for you.",

    icon: (
      <FaSuitcase className="text-2xl text-white" />
    ),

    gradient:
      "from-emerald-500 via-lime-500 to-emerald-600",

    step: "Step 3",
  },
];



export default function Index() {
  const { darkMode } = useTheme();

  const [search, setSearch] = useState("");

  

  const filteredTrips = trips.filter((item) => {
    return (
      item.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      item.location
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  });

  

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        darkMode
          ? "bg-[#020617]"
          : "bg-[#020B2D]"
      }`}
    >

      

      <div
        className={`rounded-[40px] overflow-hidden flex flex-col lg:flex-row min-h-[calc(100vh-3rem)] shadow-xl transition-colors duration-300 ${
          darkMode
            ? "bg-[#0F172A]"
            : "bg-[#F5F5F5]"
        }`}
      >

        

        <Sidebar />

        

        <div
          className={`flex-1 p-5 lg:p-7 transition-colors duration-300 ${
            darkMode
              ? "bg-[#020617]"
              : "bg-gray-50"
          }`}
        >

          

          <Navbar
            search={search}
            setSearch={setSearch}
          />

          

          <div
            className="
              mt-8
              relative
              overflow-hidden
              rounded-3xl
              bg-gradient-to-r
              from-blue-700
              via-indigo-600
              to-purple-600
              p-8
              shadow-2xl
            "
          >

            <div
              className="
                absolute
                -top-20
                -right-20
                w-72
                h-72
                bg-white/10
                rounded-full
                blur-3xl
              "
            />

            <div
              className="
                absolute
                -bottom-20
                -left-20
                w-64
                h-64
                bg-cyan-400/10
                rounded-full
                blur-3xl
              "
            />

            <div
              className="
                relative
                z-10
                flex
                flex-col
                lg:flex-row
                items-center
                justify-between
              "
            >

              <div>

                <p
                  className="
                    uppercase
                    tracking-[4px]
                    text-blue-200
                    text-sm
                    font-semibold
                  "
                >
                  Welcome Back
                </p>

                <h1
                  className="
                    text-5xl
                    font-black
                    text-white
                    mt-4
                  "
                >
                  Good Morning,
                  <br />
                  Bhargav 👋
                </h1>

                <p
                  className="
                    mt-5
                    max-w-xl
                    text-blue-100
                    leading-8
                  "
                >
                  Explore new destinations, manage
                  trips, book hotels, track expenses
                  and enjoy your travel experience in
                  one beautiful dashboard.
                </p>

                <button
                  type="button"
                  className="
                    mt-8
                    bg-white
                    text-blue-700
                    px-8
                    py-4
                    rounded-2xl
                    font-bold
                    hover:scale-105
                    hover:shadow-xl
                    transition-all
                    duration-300
                  "
                >
                  Start New Trip
                </button>

              </div>

              <img
                src="https://cdn-icons-png.flaticon.com/512/201/201623.png"
                alt="Travel"
                className="
                  w-64
                  mt-10
                  lg:mt-0
                "
              />

            </div>
          </div>

          

          <div className="space-y-6 mt-6">

            

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                xl:grid-cols-4
                gap-4
              "
            >

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

              <div
                className="
                  flex
                  flex-col
                  gap-4
                  mb-8
                "
              >

                <h1
                  className="
                    text-2xl
                    font-playfair
                    font-bold

                    bg-gradient-to-r
                    from-slate-900
                    via-purple-900
                    to-slate-900

                    dark:from-white
                    dark:via-purple-300
                    dark:to-white

                    bg-clip-text
                    text-transparent

                    tracking-tight
                  "
                >
                  Travel Launchpad
                </h1>

                <p
                  className="
                    text-sm
                    text-gray-600
                    dark:text-gray-300
                    max-w-2xl
                  "
                >
                  Fast actions to start your first
                  trip and explore with confidence.
                </p>

              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-6
                "
              >

                {quickStart.map((item, index) => (
                  <div
                    key={index}
                    className={`
                      group
                      relative
                      overflow-hidden
                      rounded-2xl
                      p-4
                      text-white
                      shadow-2xl
                      transition-transform
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-2xl
                      bg-gradient-to-br
                      ${item.gradient}
                    `}
                  >

                    <div
                      className="
                        absolute
                        inset-x-0
                        top-0
                        h-32
                        bg-white/10
                        blur-3xl
                      "
                    />

                    <div
                      className="
                        relative
                        z-10
                        flex
                        items-center
                        justify-between
                        mb-5
                      "
                    >

                      <span
                        className="
                          text-[11px]
                          uppercase
                          tracking-[0.3em]
                          text-white/80
                        "
                      >
                        {item.step}
                      </span>

                      <div
                        className="
                          w-14
                          h-14
                          rounded-3xl
                          bg-white/15
                          flex
                          items-center
                          justify-center
                          text-white
                          shadow-lg
                        "
                      >
                        {item.icon}
                      </div>

                    </div>

                    <h2
                      className="
                        relative
                        z-10
                        text-xl
                        font-poppins
                        font-bold
                        mb-3
                        text-white
                        drop-shadow-md
                        tracking-tight
                      "
                    >
                      {item.title}
                    </h2>

                    <p
                      className="
                        relative
                        z-10
                        text-sm
                        text-white/80
                        leading-relaxed
                        mb-6
                        font-inter
                        font-medium
                      "
                    >
                      {item.description}
                    </p>

                    <button
                      type="button"
                      className="
                        relative
                        z-10
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        border
                        border-white/20
                        bg-white/10
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-white/20
                      "
                    >
                      Try it now
                    </button>

                  </div>
                ))}

              </div>

            </div>

            

            <div>

              <div
                className="
                  grid
                  gap-6
                  lg:grid-cols-[1.5fr_0.9fr]
                  mb-8
                "
              >

                

                <div
                  className="
                    rounded-2xl

                    border
                    border-gray-200
                    dark:border-gray-700

                    bg-white
                    dark:bg-gray-900

                    p-5

                    shadow-md
                    hover:shadow-lg

                    transition-all
                    duration-300
                  "
                >

                  <p
                    className="
                      text-accent
                      text-emerald-600
                    "
                  >
                    Destination
                  </p>

                  <h2
                    className="
                      mt-4
                      text-2xl
                      font-playfair
                      font-bold
                      text-slate-900
                      dark:text-white
                      tracking-tight
                    "
                  >
                    Maldives
                  </h2>

                  <p
                    className="
                      mt-4
                      text-sm
                      text-gray-700
                      dark:text-gray-300
                      max-w-xl
                    "
                  >
                    Perfect tropical paradise with
                    crystal clear waters, vibrant coral
                    reefs, and luxury resorts.
                  </p>

                </div>

                

                <div
                  className="
                    rounded-2xl
                    bg-gradient-to-br
                    from-blue-600
                    via-cyan-500
                    to-sky-500
                    p-4
                    text-white
                    shadow-lg
                    hover:shadow-xl
                    transition-all
                    duration-300
                    flex
                    flex-col
                    justify-between
                  "
                >

                  <div>

                    <p
                      className="
                        text-accent
                        text-cyan-100/80
                      "
                    >
                      Navigation
                    </p>

                    <p
                      className="
                        mt-4
                        text-sm
                        font-poppins
                        font-semibold
                        tracking-tight
                      "
                    >
                      Use{" "}
                      <span className="font-bold">
                        Ctrl + Scroll
                      </span>{" "}
                      to explore
                    </p>

                  </div>

                  <div
                    className="
                      mt-6
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      bg-white/15
                      px-4
                      py-2
                      text-xs
                      uppercase
                      tracking-[0.25em]
                      font-bold
                      text-white/95
                      backdrop-blur-sm
                    "
                  >
                    Pro tip
                  </div>

                </div>

              </div>

              

              <MapView />

            </div>

            

            <div>

              <h1
                className="
                  text-2xl
                  font-playfair
                  font-bold
                  text-slate-900
                  dark:text-white
                  mb-7
                  tracking-tight
                "
              >
                Your Trips
              </h1>

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  xl:grid-cols-4
                  gap-6
                "
              >

                {filteredTrips.map((item) => (

                  <TripCard
                    key={item.id}

                    

                    id={item.id}

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