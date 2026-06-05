import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useMap } from "../context/MapContext";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [travelStyle, setTravelStyle] = useState('Adventure')
  const [city, setCity] = useState('')
  const [twoFA, setTwoFA] = useState(false);

 const {setLocation} = useMap();
 const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
 const handleLocationSearch = async () => {

  if (!city.trim()) {
    alert("Please enter a city");
    return;
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${city}&format=json&limit=1`
    );

    const data = await response.json();

    if (data.length > 0) {
      setLocation({
        name: city,
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      });

      alert("Location Updated!");
    } else {
      alert("Location not found");
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};

  return (
    <div className="bg-[#020B2D] min-h-screen p-6">
      <div className="bg-[#F5F5F5] rounded-[40px] overflow-hidden flex">

        <Sidebar />

        <div className="flex-1 p-10">
          <Navbar />


          <h1 className="text-5xl font-bold text-gray-900 mt-10">
            Settings
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Customize your travel experience like your own universe
          </p>


          <div className="bg-white p-8 rounded-3xl shadow-lg mt-10 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>

              <div>
                <h2 className="text-xl font-bold">Your Profile</h2>
                <p className="text-gray-500">Traveler • Explorer • Dreamer</p>
              </div>
            </div>

            <button className="bg-black text-white px-5 py-2 rounded-xl">
              Edit
            </button>
          </div>


          <div className="grid grid-cols-3 gap-6 mt-10">


            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <h2 className="font-bold text-xl">Theme </h2>
              <p className="text-gray-500 text-sm mt-2">
                Switch your travel UI mood
              </p>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`mt-5 px-4 py-2 rounded-xl text-white transition ${darkMode ? "bg-gray-700" : "bg-black"
                  }`}
              >
                {darkMode ? "Dark ON" : "Light ON"}
              </button>
            </div>


            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <h2 className="font-bold text-xl">Notifications </h2>
              <p className="text-gray-500 text-sm mt-2">
                Trip alerts & updates
              </p>

              <button
                onClick={() => setNotifications(!notifications)}
                className={`mt-5 px-4 py-2 rounded-xl text-white transition ${notifications ? "bg-blue-600" : "bg-gray-400"
                  }`}
              >
                {notifications ? "ON" : "OFF"}
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <h2 className="font-bold text-xl">Email Alerts </h2>
              <p className="text-gray-500 text-sm mt-2">
                Receive deals & offers
              </p>

              <button
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`mt-5 px-4 py-2 rounded-xl text-white transition ${emailAlerts ? "bg-green-600" : "bg-gray-400"
                  }`}
              >
                {emailAlerts ? "Enabled" : "Disabled"}
              </button>
            </div>


            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <h2 className="font-bold text-xl">Security </h2>
              <p className="text-gray-500 text-sm mt-2">
                Protect your account
              </p>

              <button
                onClick={() => setTwoFA(!twoFA)}
                className={`mt-5 px-4 py-2 rounded-xl text-white transition ${twoFA ? "bg-purple-600" : "bg-gray-400"
                  }`}
              >
                {twoFA ? "2FA ON" : "Enable 2FA"}
              </button>
            </div>


            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <h2 className="font-bold text-xl">Travel Style </h2>
              <p className="text-gray-500 text-sm mt-2">
                Adventure / Luxury / Budget
              </p>

              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => setTravelStyle("Adventure")}
                  className={`px-3 py-1 rounded-xl text-sm ${travelStyle === "Adventure"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100"
                    }`}
                >
                  Adventure
                </button>

                <button
                  onClick={() => setTravelStyle("Luxury")}
                  className={`px-3 py-1 rounded-xl text-sm ${travelStyle === "Luxury"
                    ? "bg-pink-500 text-white"
                    : "bg-pink-100"
                    }`}
                >
                  Luxury
                </button>

                <button
                  onClick={() => setTravelStyle("Budget")}
                  className={`px-3 py-1 rounded-xl text-sm ${travelStyle === "Budget"
                    ? "bg-green-500 text-white"
                    : "bg-green-100"
                    }`}
                >
                  Budget
                </button>
              </div>
            </div>


            <div className="bg-white p-6 rounded-3xl shadow-lg">
              <h2 className="font-bold text-xl">Home Location   </h2>
              <p className="text-gray-500 text-sm mt-2">
                Set your base city
              </p>

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-4 w-full border p-2 rounded-xl"
                placeholder="Enter city..."
              />

              <button onClick={handleLocationSearch} className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-xl"
              >
              updated Location 
              
              </button>

              <p className="mt-3 text-gray-500">
                Current City: {city || "Not Set"}
              </p>
            </div>


            <div className="bg-red-50 p-6 rounded-3xl shadow-lg col-span-3">
              <h2 className="font-bold text-xl text-red-600">
                Danger Zone
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Logout from all devices and reset session
              </p>

              <button
                onClick={handleLogout}
                className="mt-5 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl transition"
              >
                Logout Everywhere
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}