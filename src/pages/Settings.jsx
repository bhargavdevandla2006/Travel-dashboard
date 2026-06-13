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

        <div className="flex-1 p-12">
          <Navbar />


          <h1 className="text-6xl font-playfair font-black text-gray-900 mt-12 tracking-tight">
            Settings
          </h1>
          <p className="text-gray-500 mt-3 text-lg font-medium">
            Customize your travel experience like your own universe
          </p>


          <div className="bg-white p-10 rounded-3xl shadow-lg mt-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-md"></div>

              <div>
                <h2 className="text-2xl font-bold font-poppins">Your Profile</h2>
                <p className="text-gray-500 text-base mt-1">Traveler • Explorer • Dreamer</p>
              </div>
            </div>

            <button className="bg-black text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition shadow-md">
              Edit
            </button>
          </div>


          <div className="grid grid-cols-3 gap-10 mt-16">


            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="font-bold text-2xl font-poppins">Theme</h2>
              <p className="text-gray-500 text-base mt-2">
                Switch your travel UI mood
              </p>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`mt-6 px-6 py-3 rounded-2xl text-white font-semibold transition ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-black hover:bg-gray-800"
                  }`}
              >
                {darkMode ? "Dark ON" : "Light ON"}
              </button>
            </div>


            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="font-bold text-2xl font-poppins">Notifications</h2>
              <p className="text-gray-500 text-base mt-2">
                Trip alerts & updates
              </p>

              <button
                onClick={() => setNotifications(!notifications)}
                className={`mt-6 px-6 py-3 rounded-2xl text-white font-semibold transition ${notifications ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 hover:bg-gray-500"
                  }`}
              >
                {notifications ? "ON" : "OFF"}
              </button>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="font-bold text-2xl font-poppins">Email Alerts</h2>
              <p className="text-gray-500 text-base mt-2">
                Receive deals & offers
              </p>

              <button
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`mt-6 px-6 py-3 rounded-2xl text-white font-semibold transition ${emailAlerts ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 hover:bg-gray-500"
                  }`}
              >
                {emailAlerts ? "Enabled" : "Disabled"}
              </button>
            </div>


            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="font-bold text-2xl font-poppins">Security</h2>
              <p className="text-gray-500 text-base mt-2">
                Protect your account
              </p>

              <button
                onClick={() => setTwoFA(!twoFA)}
                className={`mt-6 px-6 py-3 rounded-2xl text-white font-semibold transition ${twoFA ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-400 hover:bg-gray-500"
                  }`}
              >
                {twoFA ? "2FA ON" : "Enable 2FA"}
              </button>
            </div>


            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="font-bold text-2xl font-poppins">Travel Style</h2>
              <p className="text-gray-500 text-base mt-2">
                Adventure / Luxury / Budget
              </p>

              <div className="flex gap-3 mt-5 flex-wrap">
                <button
                  onClick={() => setTravelStyle("Adventure")}
                  className={`px-5 py-2 rounded-2xl text-sm font-semibold ${travelStyle === "Adventure"
                    ? "bg-blue-500 text-white"
                    : "bg-blue-100 hover:bg-blue-200"
                    }`}
                >
                  Adventure
                </button>

                <button
                  onClick={() => setTravelStyle("Luxury")}
                  className={`px-5 py-2 rounded-2xl text-sm font-semibold ${travelStyle === "Luxury"
                    ? "bg-pink-500 text-white"
                    : "bg-pink-100 hover:bg-pink-200"
                    }`}
                >
                  Luxury
                </button>

                <button
                  onClick={() => setTravelStyle("Budget")}
                  className={`px-5 py-2 rounded-2xl text-sm font-semibold ${travelStyle === "Budget"
                    ? "bg-green-500 text-white"
                    : "bg-green-100 hover:bg-green-200"
                    }`}
                >
                  Budget
                </button>
              </div>
            </div>


            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="font-bold text-2xl font-poppins">Home Location</h2>
              <p className="text-gray-500 text-base mt-2">
                Set your base city
              </p>

              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-5 w-full border border-gray-300 p-3 rounded-2xl text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Enter city..."
              />

              <button onClick={handleLocationSearch} className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-600 transition"
              >
              Update Location
              
              </button>

              <p className="mt-4 text-gray-600 font-medium">
                Current City: {city || "Not Set"}
              </p>
            </div>


            <div className="bg-red-50 p-8 rounded-3xl shadow-lg col-span-3 border-2 border-red-200">
              <h2 className="font-bold text-2xl text-red-600 font-poppins">
                Danger Zone
              </h2>
              <p className="text-gray-600 text-base mt-2 font-medium">
                Logout from all devices and reset session
              </p>

              <button
                onClick={handleLogout}
                className="mt-6 bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-bold transition shadow-md"
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