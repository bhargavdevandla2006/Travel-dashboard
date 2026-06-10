import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { FaMapMarkerAlt, FaStar, FaPlane } from "react-icons/fa";

export default function TripDetails() {

  const { state } = useLocation();

  const trip = state || {
    title: "Maldives Escape",
    location: "Maldives",
    price: "₹1,25,000",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
  };

  const handlePayment = () => {
    const upiId = "yourupi@okhdfcbank"; 
    const name = trip.title || "Trip Booking";
    const amount = 850;

    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
      name
    )}&am=${amount}&cu=INR`;

    window.location.href = upiUrl;
  };

  return (
    <div className="bg-[#020B2D] min-h-screen p-6">
      <div className="bg-[#F5F5F5] rounded-[40px] overflow-hidden flex">

        <Sidebar />

        <div className="flex-1 p-10">

          <Navbar />

          
          <img
            src={trip.image}
            className="w-full h-[400px] object-cover rounded-3xl shadow-lg"
          />

          <div className="mt-8 flex justify-between">

            <div>
              <h1 className="text-5xl font-bold">
                {trip.title}
              </h1>

              <p className="flex items-center gap-2 text-gray-500 mt-2">
                <FaMapMarkerAlt />
                {trip.location}
              </p>
            </div>


            <div className="bg-blue-600 text-white px-8 py-4 rounded-3xl flex flex-col items-center">
  <h1 className="text-3xl font-bold">{trip.price}</h1>

  
  <button
    onClick={handlePayment}
    className="mt-4 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-2xl font-bold cursor-pointer"
  >
    Pay ₹850
  </button>
</div>

          </div>

          
          <div className="grid grid-cols-3 gap-6 mt-10">

            <div className="bg-white p-6 rounded-3xl shadow-md">
              <FaStar className="text-yellow-400 text-2xl" />
              <h1 className="font-bold mt-2">Rating</h1>
              <p>4.9 / 5</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md">
              <FaPlane className="text-blue-600 text-2xl" />
              <h1 className="font-bold mt-2">Flights</h1>
              <p>Direct available</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-md">
              <h1 className="font-bold">Best Season</h1>
              <p>Nov - April</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}