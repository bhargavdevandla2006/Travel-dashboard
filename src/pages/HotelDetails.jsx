import { useLocation, useNavigate } from "react-router-dom";

export default function HotelDetails() {
    const {state} = useLocation();
    const navigate = useNavigate()

    if(!state)  return <h1>No Hotels Selected</h1>

    return (
    <div className="min-h-screen bg-gray-100">
      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
        alt="hotel"
        className="w-full h-[400px] object-cover"
      />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-bold">
          {state.name}
        </h1>

        <p className="text-gray-500">
          {state.vicinity}
        </p>

        <div className="mt-4">
          ⭐ 4.8 Excellent
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-bold">
            Reviews
          </h2>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white p-4 rounded-xl shadow">
              Amazing stay ⭐⭐⭐⭐⭐
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              Great location ⭐⭐⭐⭐⭐
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              Clean rooms ⭐⭐⭐⭐
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <h2 className="text-3xl font-bold text-orange-500">
            ₹4500/night
          </h2>

          <button
            onClick={() =>
              navigate("/booking", {
                state,
              })
            }
            className="bg-orange-500 text-white px-8 py-3 rounded-xl"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
