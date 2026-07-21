import { useLocation } from "react-router-dom";
import { createOrder } from "../services/api";

export default function Booking() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">No Hotel Selected</h1>
      </div>
    );
  }

  const handlePayment = async () => {
    try {
      const data = await createOrder(4500);

      if (!data?.success) {
        alert("Failed to create order");
        return;
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Travel Booking",
        description: `Booking for ${state.name}`,
        order_id: data.order.id,

        handler: function (response) {
          alert("🎉 Payment Successful!");

          console.log("Payment ID:", response.razorpay_payment_id);
          console.log("Order ID:", response.razorpay_order_id);
          console.log("Signature:", response.razorpay_signature);
        },

        prefill: {
          name: "Bhargav",
          email: "bhargav@example.com",
          contact: "9999999999",
        },

        theme: {
          color: "#f97316",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-6">
          Booking Confirmation
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            {state.name}
          </h2>

          <p className="text-gray-500">
            {state.vicinity}
          </p>

          <h3 className="text-2xl font-bold text-orange-500 mt-4">
            ₹4500 / Night
          </h3>
        </div>

        <div className="mt-8">
          <label className="block mb-2 font-medium">
            Check In
          </label>

          <input
            type="date"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div className="mt-5">
          <label className="block mb-2 font-medium">
            Check Out
          </label>

          <input
            type="date"
            className="w-full border rounded-lg p-3"
          />
        </div>

        <button
          onClick={handlePayment}
          className="mt-8 w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl text-lg font-semibold transition"
        >
          Pay Now
        </button>

      </div>
    </div>
  );
}