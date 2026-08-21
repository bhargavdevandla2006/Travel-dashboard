import { BrowserRouter, Routes, Route } from "react-router-dom";

import Travelers from "./pages/Travelers";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trips from "./pages/Trips";
import Profile from "./pages/Profile";
import TripDetails from "./pages/TripDetails";
import Destinations from "./pages/Destinations";
import Settings from "./pages/Settings";
import AddTrip from "./pages/AddTrip";
import ProtectedRoute from "./components/ProtectedRoute";

import Hotels from "./pages/Hotel";
import Transport from "./pages/Transport";

import { MapProvider } from "./context/MapContext";

import HotelDetails from "./pages/HotelDetails";
import Booking from "./pages/Booking";
import DestinationDetails from "./pages/DestinationDetails";
import TravelerProfile from "./pages/TravelerProfile";
import Favorites from "./pages/Favorites";
import Messages from "./pages/Messages";

import { useTheme } from "./context/ThemeContext";

export default function App() {
  const { darkMode } = useTheme();

  return (
    <MapProvider>
      <div
        className={`min-h-screen transition-colors duration-300 ${darkMode
            ? "bg-[#020617] text-white"
            : "bg-white text-gray-900"
          }`}
      >
        <BrowserRouter>
          <Routes>

            {/* ================= AUTH ================= */}

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />


            {/* ================= TRAVELERS ================= */}

            <Route
              path="/travelers"
              element={
                <ProtectedRoute>
                  <Travelers />
                </ProtectedRoute>
              }
            />

            <Route
              path="/traveler/:id"
              element={<TravelerProfile />}
            />


            {/* ================= MESSAGES ================= */}

            <Route
              path="/messages/:id"
              element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              }
            />


            {/* ================= DASHBOARD ================= */}

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />


            {/* ================= DESTINATIONS ================= */}

            <Route
              path="/destinations"
              element={
                <ProtectedRoute>
                  <Destinations />
                </ProtectedRoute>
              }
            />

            <Route
              path="/destinations/:id"
              element={
                <ProtectedRoute>
                  <DestinationDetails />
                </ProtectedRoute>
              }
            />


            {/* ================= TRIPS ================= */}

            <Route
              path="/trips"
              element={
                <ProtectedRoute>
                  <Trips />
                </ProtectedRoute>
              }
            />

            <Route
              path="/add-trip"
              element={
                <ProtectedRoute>
                  <AddTrip />
                </ProtectedRoute>
              }
            />

            <Route
              path="/trip/:id"
              element={
                <ProtectedRoute>
                  <TripDetails />
                </ProtectedRoute>
              }
            />


            {/* ================= PROFILE ================= */}

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />


            {/* ================= FAVORITES ================= */}

            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />


            {/* ================= HOTELS ================= */}

            <Route
              path="/hotels/:location?"
              element={
                <ProtectedRoute>
                  <Hotels />
                </ProtectedRoute>
              }
            />

            <Route
              path="/hotel-details"
              element={
                <ProtectedRoute>
                  <HotelDetails />
                </ProtectedRoute>
              }
            />


            {/* ================= TRANSPORT ================= */}

            <Route
              path="/transport/:location?"
              element={
                <ProtectedRoute>
                  <Transport />
                </ProtectedRoute>
              }
            />


            {/* ================= BOOKING ================= */}

            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <Booking />
                </ProtectedRoute>
              }
            />


            {/* ================= SETTINGS ================= */}

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />


            {/* ================= FALLBACK ================= */}

            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

          </Routes>
        </BrowserRouter>
      </div>
    </MapProvider>
  );
}