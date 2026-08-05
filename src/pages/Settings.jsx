import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useMap } from "../context/MapContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";


export default function Settings() {
  const SETTINGS_STORAGE_KEY = "travelhub-settings";
  const PROFILE_STORAGE_KEY = "travelhub-profile";

  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [travelStyle, setTravelStyle] = useState('Adventure');
  const [city, setCity] = useState('');
  const [twoFA, setTwoFA] = useState(false);
  const [language, setLanguage] = useState("English");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const defaultProfile = {
    name: "Bhargav Devandla",
    email: "bhargav@gmail.com",
    phone: "+91 9876543210",
    country: "India",
    bio: "Traveler • Explorer • Dreamer",
  };

  const [profile, setProfile] = useState(defaultProfile);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || "{}");
    const savedProfile = JSON.parse(localStorage.getItem(PROFILE_STORAGE_KEY) || "{}");

    if (savedSettings.darkMode !== undefined) setDarkMode(savedSettings.darkMode);
    if (savedSettings.notifications !== undefined) setNotifications(savedSettings.notifications);
    if (savedSettings.emailAlerts !== undefined) setEmailAlerts(savedSettings.emailAlerts);
    if (savedSettings.travelStyle) setTravelStyle(savedSettings.travelStyle);
    if (savedSettings.city) setCity(savedSettings.city);
    if (savedSettings.twoFA !== undefined) setTwoFA(savedSettings.twoFA);
    if (savedSettings.language) setLanguage(savedSettings.language);

    if (savedProfile && Object.keys(savedProfile).length) {
      setProfile(savedProfile);
    }

    if (savedSettings.profileImage) {
      setProfileImage(savedSettings.profileImage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        darkMode,
        notifications,
        emailAlerts,
        travelStyle,
        city,
        twoFA,
        language,
        profileImage,
      })
    );
  }, [darkMode, notifications, emailAlerts, travelStyle, city, twoFA, language, profileImage]);

  useEffect(() => {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const profileRef = useRef(null);
  const themeRef = useRef(null);
  const notificationsRef = useRef(null);
  const securityRef = useRef(null);
  const travelStyleRef = useRef(null);
  const locationRef = useRef(null);
  const dangerRef = useRef(null);

  const { setLocation } = useMap();
  const navigate = useNavigate()
  const location = useLocation();
const { darkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleResetSettings = () => {
    setDarkMode(false);
    setNotifications(true);
    setEmailAlerts(false);
    setTravelStyle("Adventure");
    setCity("");
    setTwoFA(false);
    setLanguage("English");
    setProfile(defaultProfile);
    setProfileImage(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleSaveSettings = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
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

  useEffect(() => {
    switch (location.state?.section) {
      case "profile":
        profileRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;

      case "theme":
        themeRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;

      case "notifications":
        notificationsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;

      case "security":
        securityRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;

      case "travelStyle":
        travelStyleRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;

      case "location":
        locationRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;

      case "danger":
        dangerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        break;

      default:
        break;
    }
  }, [location]);

  const handleSaveProfile = () => {
    setShowEditProfile(false);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setProfileImage(imageUrl);
  };

  return (
    <div className="bg-[#020B2D] min-h-screen p-6">
      <div className="bg-[#F5F5F5] rounded-[40px] overflow-hidden flex">

        <Sidebar />

        <div className="flex-1 p-12">
          <Navbar />


          <h1 className="text-3xl font-playfair font-bold text-gray-900 mt-12 tracking-tight">
            Settings
          </h1>
          <p className="text-gray-500 mt-3 text-lg font-medium">
            Customize your travel experience like your own universe
          </p>


          <div
            ref={profileRef}
            className="bg-white p-10 rounded-3xl shadow-lg mt-14 flex items-center justify-between"
          >
            <div className="flex items-center gap-8">

              <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg">

                {profileImage ? (

                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                    B
                  </div>

                )}

              </div>

              <div>

                <div className="flex items-center gap-3">

                  <h2 className="text-3xl font-bold">
                    {profile.name}
                  </h2>

                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                    ⭐ Premium
                  </span>

                </div>

                <p className="text-gray-500 mt-2">
                  {profile.bio}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  📧 {profile.email}
                </p>

                <p className="text-sm text-gray-400">
                  📱 {profile.phone}
                </p>

                <p className="text-sm text-gray-400">
                  🌍 {profile.country}
                </p>

                <div className="flex gap-8 mt-6">

                  <div>
                    <h3 className="text-2xl font-bold text-blue-600">
                      18
                    </h3>

                    <p className="text-gray-500 text-sm">
                      Trips
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-green-600">
                      12
                    </h3>

                    <p className="text-gray-500 text-sm">
                      Countries
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-pink-600">
                      24
                    </h3>

                    <p className="text-gray-500 text-sm">
                      Favorites
                    </p>
                  </div>

                </div>

                <div className="mt-6">

                  <div className="flex justify-between text-sm mb-2">
                    <span>Explorer Level</span>
                    <span>75%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">

                    <div className="bg-blue-600 h-3 rounded-full w-3/4"></div>

                  </div>

                </div>

              </div>

            </div>

            <button
              onClick={() => setShowEditProfile(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-semibold transition"
            >
              ✏️ Edit Profile
            </button>
          </div>


          <div className="grid grid-cols-3 gap-10 mt-16">


            <div
              ref={themeRef}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="font-bold text-2xl font-poppins">Theme</h2>
              <p className="text-gray-500 text-base mt-2">
                Switch your travel UI mood
              </p>

              <div className="mt-6 flex items-center justify-between">

                <span className="font-semibold text-gray-700">
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </span>

                <button
                  onClick={toggleTheme}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 ${darkMode ? "bg-blue-600" : "bg-gray-300"
                    }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${darkMode ? "left-9" : "left-1"
                      }`}
                  />
                </button>

              </div>
            </div>


            <div
              ref={notificationsRef}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="font-bold text-2xl font-poppins">Notifications</h2>
              <p className="text-gray-500 text-base mt-2">
                Trip alerts & updates
              </p>

              <div className="mt-6 flex items-center justify-between">

                <span className="font-semibold text-gray-700">
                  Trip Alerts
                </span>

                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 ${notifications ? "bg-blue-600" : "bg-gray-300"
                    }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${notifications ? "left-9" : "left-1"
                      }`}
                  />
                </button>

              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="font-bold text-2xl font-poppins">Email Alerts</h2>
              <p className="text-gray-500 text-base mt-2">
                Receive deals & offers
              </p>

              <div className="mt-6 flex items-center justify-between">

                <span className="font-semibold text-gray-700">
                  Receive Offers
                </span>

                <button
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 ${emailAlerts ? "bg-green-600" : "bg-gray-300"
                    }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${emailAlerts ? "left-9" : "left-1"
                      }`}
                  />
                </button>

              </div>
            </div>


            <div
              ref={securityRef}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="font-bold text-2xl font-poppins">Security</h2>
              <p className="text-gray-500 text-base mt-2">
                Protect your account
              </p>

              <div className="mt-6 flex items-center justify-between">

                <span className="font-semibold text-gray-700">
                  Two Factor Authentication
                </span>

                <button
                  onClick={() => setTwoFA(!twoFA)}
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 ${twoFA ? "bg-purple-600" : "bg-gray-300"
                    }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 ${twoFA ? "left-9" : "left-1"
                      }`}
                  />
                </button>

              </div>
            </div>


            <div
              ref={travelStyleRef}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
            >
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


            <div
              ref={locationRef}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
            >
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

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">

              <h2 className="font-bold text-2xl font-poppins">
                💳 Payment Methods
              </h2>

              <p className="text-gray-500 text-base mt-2">
                Manage your saved payment methods
              </p>

              <div className="mt-6 space-y-3">

                <div className="flex justify-between items-center bg-gray-100 rounded-2xl p-4">
                  <span>💳 Visa •••• 4821</span>
                  <span className="text-green-600 font-semibold">Default</span>
                </div>

                <div className="flex justify-between items-center bg-gray-100 rounded-2xl p-4">
                  <span>💳 MasterCard •••• 7812</span>
                  <button className="text-blue-600 font-semibold">
                    Edit
                  </button>
                </div>

                <div className="flex justify-between items-center bg-gray-100 rounded-2xl p-4">
                  <span>📱 bhargav@upi</span>
                  <button className="text-blue-600 font-semibold">
                    Edit
                  </button>
                </div>

              </div>

              <button
                className="mt-6 w-full bg-blue-600 text-white py-3 rounded-2xl font-semibold hover:bg-blue-700 transition"
              >
                + Add Payment Method
              </button>

            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow">

              <h2 className="font-bold text-2xl font-poppins">
                🌐 Language
              </h2>

              <p className="text-gray-500 text-base mt-2">
                Choose your preferred language
              </p>

              <div className="mt-6 flex flex-wrap gap-3">

                {[
                  "English",
                  "తెలుగు",
                  "हिन्दी",
                  "தமிழ்",
                  "ಕನ್ನಡ"
                ].map((lang) => (

                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-5 py-3 rounded-2xl font-semibold transition
                    ${language === lang
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-gray-100 hover:bg-blue-100"
                      }`}
                  >
                    {lang}
                  </button>

                ))}

              </div>

              <p className="mt-6 text-gray-600 font-medium">
                Selected Language:
                <span className="font-bold text-blue-600 ml-2">
                  {language}
                </span>
              </p>

            </div>

            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition">

              <h2 className="text-2xl font-bold">
                � Your Travel Hub
              </h2>

              <p className="text-gray-500 mt-2">
                Use this section to personalize your app without leaving the dashboard.
              </p>

              <ul className="mt-6 space-y-3 text-gray-700">
                <li className="flex items-center gap-3">
                  <span className="text-blue-600">•</span> Keep your travel preferences synced.
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-600">•</span> Switch themes, languages, and alerts on the fly.
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-blue-600">•</span> Control your home location and payment settings.
                </li>
              </ul>

            </div>

            <div
              ref={dangerRef}
              className="bg-red-50 p-8 rounded-3xl shadow-lg col-span-3 border-2 border-red-200"
            >
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

      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white w-[600px] rounded-3xl p-8 shadow-2xl">

            <h2 className="text-3xl font-bold mb-8">
              Edit Profile
            </h2>

            <div className="space-y-5">

              <div>

                <label className="block mb-3 font-semibold text-gray-700">
                  Profile Picture
                </label>

                <label
                  htmlFor="profileImage"
                  className="flex items-center justify-between
    border-2 border-dashed border-blue-300
    rounded-2xl p-4 cursor-pointer
    hover:border-blue-600
    hover:bg-blue-50
    transition"
                >

                  <span className="text-gray-500">
                    {profileImage ? "✅ Image Selected" : "📷 Choose Profile Picture"}
                  </span>

                  <span className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold">
                    Browse
                  </span>

                </label>

                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

              </div>

              <input
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                placeholder="Full Name"
                className="w-full border rounded-xl p-4"
              />

              <input
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                placeholder="Email"
                className="w-full border rounded-xl p-4"
              />

              <input
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
                placeholder="Phone"
                className="w-full border rounded-xl p-4"
              />

              <input
                value={profile.country}
                onChange={(e) =>
                  setProfile({ ...profile, country: e.target.value })
                }
                placeholder="Country"
                className="w-full border rounded-xl p-4"
              />

              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) =>
                  setProfile({ ...profile, bio: e.target.value })
                }
                placeholder="Bio"
                className="w-full border rounded-xl p-4"
              />

            </div>

            <div className="flex justify-end gap-4 mt-8">

              <button
                onClick={() => setShowEditProfile(false)}
                className="px-6 py-3 rounded-xl bg-gray-200"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveProfile}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}
      {showToast && (
        <div className="fixed top-6 right-6 z-[9999] animate-bounce">

          <div className="bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl">

            <h3 className="font-bold">
              ✅ Profile Updated
            </h3>

            <p className="text-sm text-green-100">
              Your changes have been saved successfully.
            </p>

          </div>

        </div>
      )}
    </div>
  );
}