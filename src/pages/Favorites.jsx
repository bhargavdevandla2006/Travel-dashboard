import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useTheme } from "../context/ThemeContext";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { getActiveBudget, getBudgetForCountry } from "../utils/budget";

export default function Favorites() {
    const { darkMode } = useTheme();

    const [searchParams] = useSearchParams();

    const [favorites, setFavorites] = useState(() =>
        JSON.parse(localStorage.getItem("favorites")) || []
    );

    const [activeFavorite, setActiveFavorite] = useState(0);

    const activeBudget =
        searchParams.get("budget") || getActiveBudget();

    const budgetFavorites = useMemo(
        () =>
            favorites.filter(
                (place) =>
                    getBudgetForCountry(place.country) === activeBudget
            ),
        [activeBudget, favorites]
    );

  function removeFavorite(place) {
    const nextFavorites = favorites.filter(
      (item) => !(item.name === place.name && item.country === place.country)
    );
    localStorage.setItem("favorites", JSON.stringify(nextFavorites));
    setFavorites(nextFavorites);
    setActiveFavorite((current) => Math.min(current, Math.max(0, nextFavorites.length - 3)));
  }

  const visibleFavorites = budgetFavorites.slice(activeFavorite, activeFavorite + 3);

  return (
  <div
  className={`favorites-page budget-filtered-page budget-theme-${activeBudget} min-h-screen p-6 transition-colors duration-300 ${
    darkMode ? "bg-[#020617]" : "bg-[#F5F5F5]"
  }`}
>

      <div
          className={`favorites-shell relative z-10 rounded-[40px] overflow-hidden flex transition-colors duration-300 ${
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
            ❤️ {activeBudget[0].toUpperCase() + activeBudget.slice(1)} Favorite Destinations
          </h1>

          <div className="mt-10">

            {budgetFavorites.length === 0 ? (

              <h2
                  className={darkMode ? "text-gray-300" : "text-gray-600"}
                >
                  No Favorite Destinations Yet ❤️
                </h2>

            ) : (

              <>
                <div className="mb-5 flex items-center justify-between">
                  <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    {activeFavorite + 1}-{Math.min(activeFavorite + 3, budgetFavorites.length)} of {budgetFavorites.length}
                  </p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setActiveFavorite((current) => Math.max(0, current - 3))} disabled={activeFavorite === 0} aria-label="Previous favorites" className="carousel-arrow rounded-xl bg-gray-200 p-3 text-gray-700 transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/10 dark:text-white"><FaChevronLeft /></button>
                    <button type="button" onClick={() => setActiveFavorite((current) => Math.min(Math.max(0, budgetFavorites.length - 3), current + 3))} disabled={activeFavorite + 3 >= budgetFavorites.length} aria-label="Next favorites" className="carousel-arrow rounded-xl bg-gray-200 p-3 text-gray-700 transition hover:bg-blue-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/10 dark:text-white"><FaChevronRight /></button>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                {visibleFavorites.map((place, index) => (

                <div
                    key={place.name}
                  style={{ "--delay": `${index * 90}ms` }}
                    className={`favorite-card-animate group relative overflow-hidden rounded-3xl shadow-lg p-6 transition-colors duration-300 ${
                      darkMode
                        ? "bg-[#1E293B] shadow-black/30"
                        : "bg-white"
                    }`}
                  >

                  <button
                    type="button"
                    onClick={() => removeFavorite(place)}
                    aria-label={`Remove ${place.name} from favorites`}
                    title="Remove favorite"
                    className="absolute right-8 top-8 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-600 shadow-lg transition hover:bg-red-500 hover:text-white"
                  >
                    <FaTimes />
                  </button>

                  <img
                    src={place.image}
                    className="favorite-card-image w-full h-52 object-cover rounded-2xl"
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

                ))}
                </div>
              </>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}