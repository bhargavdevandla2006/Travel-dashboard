import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Favorites() {
  const favorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-[#07111a]">

      <div className="bg-white dark:bg-gray-900 rounded-[40px] overflow-hidden flex">

        <Sidebar />

        <div className="flex-1 p-12">

          <Navbar />

          <h1 className="text-4xl font-bold mt-10 text-gray-900 dark:text-gray-100">
            ❤️ Favorite Destinations
          </h1>

          <div className="grid grid-cols-3 gap-8 mt-10">

            {favorites.length === 0 ? (

              <h2 className="text-gray-600 dark:text-gray-300">No Favorite Destinations Yet ❤️</h2>

            ) : (

              favorites.map((place) => (

                <div
                  key={place.name}
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg dark:shadow-none p-6"
                >

                  <img
                    src={place.image}
                    className="w-full h-52 object-cover rounded-2xl"
                    alt={place.name}
                  />

                  <h2 className="text-xl font-bold mt-4 text-gray-900 dark:text-gray-100">
                    {place.name}
                  </h2>

                  <p className="text-gray-500 dark:text-gray-300">
                    {place.country}
                  </p>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
  );
}