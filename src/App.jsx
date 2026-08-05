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


export default function App() {

  return (

    <MapProvider>

      <BrowserRouter>

        <Routes>

          <Route
            path="/favorites"
            element={<Favorites />}
          />

          <Route
            path="/traveler/:id"
            element={<TravelerProfile />}
          />

          <Route path="/travelers"
            element={<Travelers />} />

          <Route
            path="/destinations/:id"
            element={<DestinationDetails />}
          />

          <Route
            path="/hotel-details"
            element={<HotelDetails />}
          />

          <Route
            path="/booking"
            element={<Booking />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />
          <Route
            path="/add-trip"
            element={<AddTrip />}
          />

          <Route
            path="/hotels/:location?"
            element={<Hotels />}
          />

          <Route
            path="/transport/:location?"
            element={<Transport />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/destinations"
            element={
              <ProtectedRoute>
                <Destinations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips"
            element={
              <ProtectedRoute>
                <Trips />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
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

        </Routes>

      </BrowserRouter>

    </MapProvider>

  );
}