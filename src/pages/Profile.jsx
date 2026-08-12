import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import EditProfile from "../components/EditProfile";
import { FaUserEdit, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import apiUrl from "../services/api";
import { getProfile, logoutUser } from "../services/api";


export default function Profile() {

  const [user, setUser] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [trips, setTrips] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {

      const data = await getProfile();

      setUser(data);

      const followersRes = await fetch(
        `${apiUrl}/followers-count/${data.id}`,
        {
          credentials: "include",
        }
      );
      const followersData = await followersRes.json();
      setFollowers(followersData.count || 0);

      const followingRes = await fetch(
        `${apiUrl}/following-count/${data.id}`,
        {
          credentials: "include",
        }
      );
      const followingData = await followingRes.json();
      setFollowing(followingData.count || 0);

      const tripsRes = await fetch(
        `${apiUrl}/users/${data.id}/trips`,
        {
          credentials: "include",
        }
      );
      const tripsData = await tripsRes.json();
      setTrips(Array.isArray(tripsData) ? tripsData.length : 0);
    } catch (error) {
      console.error(error);
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      window.location.href = "/login";
    }
  }
  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl text-gray-900 dark:text-white bg-white dark:bg-[#0f172a]">
        Loading...
      </div>
    );
  }

  return (

    <div className="min-h-screen p-6 bg-white text-gray-900 dark:bg-[#0f172a] dark:text-white">

      <div className="bg-white/90 dark:bg-[#111827] border border-gray-200 dark:border-gray-800 rounded-[40px] overflow-hidden flex shadow-lg shadow-slate-200/70 dark:shadow-black/40">

        <Sidebar />

        <div className="flex-1 p-10">

          <Navbar />

          <div className="mt-10 bg-white dark:bg-[#111827] rounded-3xl p-10 shadow-xl shadow-slate-200/60 dark:shadow-black/40">

            <div className="flex items-center gap-8">

              <img

                src={user.photo}
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover shadow-lg"
              />

              <div>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {user.name}
                </h1>

                <p className="text-slate-600 dark:text-slate-300 mt-2 flex items-center gap-2">
                  <FaEnvelope />
                  {user.email}
                </p>

                <p className="text-slate-600 dark:text-slate-300 mt-2 flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {user.city},  {user.state},  {user.country}
                </p>

              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12">

              <div className="bg-blue-50 dark:bg-[#0f172a] p-6 rounded-3xl border border-transparent dark:border-white/10 shadow-sm shadow-slate-200/40 dark:shadow-black/30">
                <h1 className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                  Trips
                </h1>

                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-300 mt-3">
                  {trips}
                </h2>
              </div>

              <div className="bg-purple-50 dark:bg-[#0f172a] p-6 rounded-3xl border border-transparent dark:border-white/10 shadow-sm shadow-slate-200/40 dark:shadow-black/30">
                <h1 className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                  Followers
                </h1>

                <h2 className="text-xl font-bold text-purple-600 dark:text-purple-300 mt-3">
                  {followers}
                </h2>
              </div>

              <div className="bg-green-50 dark:bg-[#0f172a] p-6 rounded-3xl border border-transparent dark:border-white/10 shadow-sm shadow-slate-200/40 dark:shadow-black/30">
                <h1 className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                  Following
                </h1>

                <h2 className="text-xl font-bold text-green-600 dark:text-green-300 mt-3">
                  {following}
                </h2>
              </div>

            </div>

            <div className="mt-12">

              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Recent Activity
              </h1>

              <div className="space-y-4">

                <div className="bg-gray-100 dark:bg-[#111827] text-slate-900 dark:text-slate-200 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
                  Booked a trip to Bali
                </div>

                <div className="bg-gray-100 dark:bg-[#111827] text-slate-900 dark:text-slate-200 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
                  Reserved hotel in Paris
                </div>

                <div className="bg-gray-100 dark:bg-[#111827] text-slate-900 dark:text-slate-200 p-5 rounded-2xl border border-gray-200 dark:border-gray-800">
                  Added Switzerland to wishlist
                </div>

              </div>

            </div>

            <div className="flex gap-5 mt-10">

              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl hover:bg-blue-700 transition font-bold flex items-center gap-2"
              >
                <FaUserEdit />
                Edit Profile
              </button>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-8 py-4 rounded-2xl hover:bg-red-600 transition font-bold"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      </div>
      {
        showModal && (
          <EditProfile
            user={user}
            onClose={() => setShowModal(false)}
            onUpdate={loadProfile}
          />
        )
      }

    </div>
  );
}