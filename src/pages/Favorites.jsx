import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";

export default function Favorites() {
  const { darkMode } = useTheme();
  console.log("Favorites darkMode:", darkMode);
  
  const favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

  return (
   <div
  className={`min-h-screen p-6 transition-colors duration-300 ${
    darkMode ? "bg-[#020617]" : "bg-[#F5F5F5]"
  }`}
>

      <div
          className={`rounded-[40px] overflow-hidden flex transition-colors duration-300 ${
            darkMode ? "bg-[#0F172A]" : "bg-white"
          }`}
        >

        <Sidebar />

        <div className="flex-1 p-12">

          <Navbar />

                  <h1
                  className={`text-4xl font-bold mt-10 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
         >
            ❤️ Favorite Destinations
          </h1>

          <div className="grid grid-cols-3 gap-8 mt-10">

            {favorites.length === 0 ? (

              <h2
                  className={darkMode ? "text-gray-300" : "text-gray-600"}
                >
                  No Favorite Destinations Yet ❤️
                </h2>

            ) : (

              favorites.map((place) => (

                <div
                    key={place.name}
                    className={`rounded-3xl shadow-lg p-6 transition-colors duration-300 ${
                      darkMode
                        ? "bg-[#1E293B] shadow-black/30"
                        : "bg-white"
                    }`}
                  >

                  <img
                    src={place.image}
                    className="w-full h-52 object-cover rounded-2xl"
                    alt={place.name}
                  />

                  <h2
                      className={`text-xl font-bold mt-4 ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                    {place.name}
                  </h2>

                  <p className={darkMode ? "text-gray-300" : "text-gray-500"}>{place.country}</p>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
  );
}