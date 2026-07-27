import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiUrl from "../services/api";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPlane,
  FaHeart,
  FaMoneyBillWave,
  FaUserPlus
} from "react-icons/fa";

export default function TravelerProfile() {

  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [trips, setTrips] = useState([]);


  useEffect(() => {
    loadUser();
    loadCurrentUser();
    loadFollowers();
    loadFollowing();
    loadTrips();
  }, []);

  async function loadUser() {

    try {

      const response = await fetch(`${apiUrl}/users/${id}`);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to load user: ${response.status} ${response.statusText} - ${text}`);
      }

      const data = await response.json();

      setUser(data);

    } catch (err) {

      console.error(err);

    }

  }
  async function loadTrips() {

    try {

      const response = await fetch(
        `https://travel-dashboard-backend-2.onrender.com/users/${id}/trips`
      );

      const data = await response.json();

      setTrips(data);

    } catch (err) {

      console.log(err);

    }

  }

  async function loadCurrentUser() {
    try {
      const response = await fetch(`${apiUrl}/profile`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to load current user profile: ${response.status}`);
      }

      const currentUser = await response.json();
      const self = String(currentUser.id) === id;
      setIsOwnProfile(self);

      if (!self) {
        await checkStatus();
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  if (!user) {

    return (
      <div className="min-h-screen flex justify-center items-center text-2xl">
        Loading...
      </div>
    );

  }

  async function checkStatus() {

    try {

      const response = await fetch(
        `${apiUrl}/follow-status/${id}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to load follow status: ${response.status}`);
      }

      const data = await response.json();

      setFollowing(data.following);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  async function loadFollowers() {

    try {
      const response = await fetch(`${apiUrl}/followers-count/${id}`)
      const data = await response.json()
      setFollowers(data.count)

    } catch (err) {
      console.log(err)
    }
  }

  async function loadFollowing() {

    try {
      const response = await fetch(
        `${apiUrl}/following-count/${id}`
      );
      const data = await response.json();
      setFollowingCount(data.count)

    } catch (err) {
      console.log(err)
    }
  }

  async function handleFollow() {
    if (isOwnProfile) {
      alert("You cannot follow yourself.");
      return;
    }

    try {

      const response = await fetch(
        `${apiUrl}/follow/${id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      setFollowing(true);
      loadFollowers();
      loadFollowing();

    } catch (err) {

      console.error(err);

    }

  }

  async function handleUnfollow() {

    try {

      const response = await fetch(
        `${apiUrl}/unfollow/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await response.json();

      setFollowing(false);
      loadFollowers();
      loadFollowing();

    } catch (err) {

      console.error(err);

    }

  }

  return (

    <div className="bg-[#020B2D] min-h-screen p-6">

      <div className="bg-[#F5F5F5] rounded-[40px] overflow-hidden flex">

        <Sidebar />

        <div className="flex-1 p-10">

          <Navbar />

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-10 text-white mt-8">

            <div className="flex items-center gap-10">

              <img
                src={user.photo}
                alt=""
                className="w-44 h-44 rounded-full border-4 border-white object-cover"
              />

              <div>

                <h1 className="text-3xl font-bold">
                  {user.name}
                </h1>

                <p className="mt-3 flex items-center gap-2">
                  <FaEnvelope />
                  {user.email}
                </p>

                <p className="mt-2 flex items-center gap-2">
                  <FaMapMarkerAlt />
                  {user.city}, {user.state}, {user.country}
                </p>

                <button
                  onClick={following ? handleUnfollow : handleFollow}
                  disabled={isOwnProfile}
                  className={`mt-6 px-8 py-3 rounded-2xl font-bold transition flex items-center gap-2 ${isOwnProfile
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : following
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : "bg-white text-blue-700 hover:scale-105"
                    }`}
                >

                  <FaUserPlus />

                  {loading
                    ? "Loading..."
                    : isOwnProfile
                      ? "Your profile"
                      : following
                        ? "Following ✓"
                        : "Follow"}

                </button>

              </div>

            </div>

          </div>

          <div className="grid grid-cols-4 gap-6 mt-10">

            <div className="bg-white rounded-3xl p-8 shadow-lg text-center">

              <FaPlane className="text-blue-600 text-4xl mx-auto" />

              <h2 className="text-4xl font-bold mt-4">
                {followers}
              </h2>

              <p className="text-gray-500 mt-2">
                Followers
              </p>

            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg text-center">

              <FaHeart className="text-red-500 text-4xl mx-auto" />

              <h2 className="text-4xl font-bold mt-4">
                {followingCount}
              </h2>

              <p className="text-gray-500 mt-2">
                Following
              </p>

            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg text-center">

              <FaMoneyBillWave className="text-green-600 text-4xl mx-auto" />

              <h2 className="text-2xl font-bold mt-4">

                ₹52K

              </h2>

              <p className="text-gray-500 mt-2">

                Spending

              </p>

            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg text-center">

              <h2 className="text-2xl">
                🌍
              </h2>

              <h2 className="text-2xl font-bold mt-4">
                7
              </h2>

              <p className="text-gray-500 mt-2">

                Countries

              </p>

            </div>

          </div>

          <div className="bg-white rounded-3xl shadow-lg mt-10 p-8">

            <h1 className="text-3xl font-bold">

              About Traveler

            </h1>

            <p className="text-gray-600 mt-4 leading-8">

              Passionate traveler who loves exploring new cultures,
              mountains, beaches and food around the world.

            </p>

          </div>
          <div className="mt-10">

            <h1 className="text-3xl font-bold mb-6">
              Trips by {user.name}
            </h1>

            <div className="grid grid-cols-3 gap-6">

              {trips.length === 0 ? (

                <p>No trips yet.</p>

              ) : (

                trips.map((trip) => (

                  <div
                    key={trip.id}
                    className="bg-white rounded-3xl shadow-lg overflow-hidden"
                  >

                    <img
                      src={trip.image}
                      alt=""
                      className="w-full h-52 object-cover"
                    />

                    <div className="p-5">

                      <h2 className="text-2xl font-bold">
                        {trip.title}
                      </h2>

                      <p className="text-gray-500 mt-2">
                        📍 {trip.location}
                      </p>

                      <p className="text-blue-600 font-bold mt-3">
                        ₹ {trip.price}
                      </p>

                    </div>

                  </div>

                ))

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}