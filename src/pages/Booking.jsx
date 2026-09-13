import { useLocation } from "react-router-dom";

import {
  createOrder,
  verifyPayment,
  getProfile,
} from "../services/api";

import { useEffect, useState } from "react";

export default function Booking() {

  const { state } = useLocation();

  const [user, setUser] = useState(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [loading, setLoading] = useState(false);


  // =====================================================
  // GET LOGGED-IN USER
  // =====================================================

  useEffect(() => {

    async function loadUser() {

      try {

        const data = await getProfile();

        console.log(
          "👤 Logged-in user:",
          data
        );

        setUser(data);

      } catch (error) {

        console.error(
          "❌ Failed to load profile:",
          error
        );

      }

    }

    loadUser();

  }, []);


  // =====================================================
  // NO HOTEL
  // =====================================================

  if (!state) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <h1 className="text-3xl font-bold">
          No Hotel Selected
        </h1>

      </div>

    );

  }


  // =====================================================
  // PAYMENT
  // =====================================================

  const handlePayment = async () => {

    try {

      console.log(
        "================================"
      );

      console.log(
        "🚀 PAYMENT STARTED"
      );

      console.log(
        "================================"
      );


      // =================================================
      // CHECK USER
      // =================================================

      if (!user) {

        alert(
          "Please login first."
        );

        return;

      }


      // =================================================
      // CHECK DATES
      // =================================================

      if (!checkIn || !checkOut) {

        alert(
          "Please select check-in and check-out dates."
        );

        return;

      }


      // =================================================
      // CHECK DATE ORDER
      // =================================================

      if (checkIn >= checkOut) {

        alert(
          "Check-out date must be after check-in date."
        );

        return;

      }


      // =================================================
      // CUSTOMER DETAILS
      // =================================================

      const customerName =
        user.name ||
        user.username ||
        "Customer";

      const customerEmail =
        user.email ||
        "";

      const customerContact =
        user.phone ||
        user.contact ||
        "";


      // =================================================
      // HOTEL DETAILS
      // =================================================

      const hotelName =
        state.name ||
        "Hotel";

      const hotelLocation =
        state.vicinity ||
        state.location ||
        "N/A";


      // =================================================
      // BOOKING AMOUNT
      // =================================================

      const bookingAmount = 4500;


      setLoading(true);


      // =================================================
      // RAZORPAY KEY
      // =================================================

 

      console.log(
        "🔑 Razorpay Key:",
        razorpayKey
      );


      if (!razorpayKey) {

        console.error(
          "❌ Razorpay key is missing"
        );

        alert(
          "Razorpay key is missing.\n\nCheck VITE_RAZORPAY_KEY_ID in frontend .env"
        );

        setLoading(false);

        return;

      }


      // =================================================
      // RAZORPAY SCRIPT
      // =================================================

      console.log(
        "Razorpay object:",
        window.Razorpay
      );


      if (!window.Razorpay) {

        alert(
          "Razorpay checkout failed to load.\n\nPlease refresh the page."
        );

        setLoading(false);

        return;

      }


      // =================================================
      // CREATE ORDER
      // =================================================

      console.log(
        "💰 Creating Razorpay order..."
      );


      const orderResponse =
        await createOrder(
          bookingAmount
        );


      console.log(
        "✅ CREATE ORDER RESPONSE:",
        orderResponse
      );


      if (
        !orderResponse ||
        !orderResponse.success ||
        !orderResponse.order ||
        !orderResponse.order.id
      ) {

        console.error(
          "❌ Order creation failed:",
          orderResponse
        );

        alert(
          orderResponse?.message ||
          "Unable to create Razorpay order."
        );

        setLoading(false);

        return;

      }


      const order =
        orderResponse.order;


      console.log(
        "🆔 Razorpay Order ID:",
        order.id
      );

      console.log(
        "💰 Razorpay Amount:",
        order.amount
      );

      console.log(
        "💱 Razorpay Currency:",
        order.currency
      );


      // =================================================
      // RAZORPAY OPTIONS
      // =================================================

      const options = {

        key: razorpayKey,

        amount: order.amount,

        currency:
          order.currency || "INR",

        name:
          "TravelHub",

        description:
          `Hotel booking - ${hotelName}`,

        order_id:
          order.id,

        prefill: {

          name:
            customerName,

          email:
            customerEmail,

          contact:
            customerContact,

        },

        notes: {

          hotel_name:
            hotelName,

          hotel_location:
            hotelLocation,

          check_in:
            checkIn,

          check_out:
            checkOut,

        },

        theme: {

          color:
            "#f97316",

        },


        // =================================================
        // PAYMENT SUCCESS
        // =================================================

        handler: async function (
          response
        ) {

          console.log(
            "================================"
          );

          console.log(
            "✅ RAZORPAY PAYMENT SUCCESS"
          );

          console.log(
            "Payment ID:",
            response?.razorpay_payment_id
          );

          console.log(
            "Order ID:",
            response?.razorpay_order_id
          );

          console.log(
            "Signature:",
            response?.razorpay_signature
          );

          console.log(
            "================================"
          );


          try {

            // ---------------------------------------------
            // VERIFY PAYMENT
            // ---------------------------------------------

            console.log(
              "🔐 Sending payment to /verify-payment..."
            );


            const verification =
              await verifyPayment({

                razorpay_order_id:
                  response.razorpay_order_id,

                razorpay_payment_id:
                  response.razorpay_payment_id,

                razorpay_signature:
                  response.razorpay_signature,

                customerName:
                  customerName,

                customerEmail:
                  customerEmail,

                customerContact:
                  customerContact,

                hotelName:
                  hotelName,

                hotelLocation:
                  hotelLocation,

                checkIn:
                  checkIn,

                checkOut:
                  checkOut,

                amount:
                  bookingAmount,

              });


            console.log(
              "✅ VERIFY PAYMENT RESPONSE:",
              verification
            );


            // ---------------------------------------------
            // BOOKING SUCCESS
            // ---------------------------------------------

            if (
              verification &&
              verification.success
            ) {

              alert(
                "🎉 Hotel booked successfully!\n\n" +
                "Confirmation emails have been sent."
              );

            } else {

              console.error(
                "❌ Verification failed:",
                verification
              );

              alert(
                verification?.message ||
                "Payment was successful, but booking verification failed."
              );

            }


          } catch (error) {

            console.error(
              "================================"
            );

            console.error(
              "❌ VERIFY PAYMENT ERROR"
            );

            console.error(
              "FULL ERROR:",
              error
            );

            console.error(
              "MESSAGE:",
              error?.message
            );

            console.error(
              "================================"
            );


            alert(
              "⚠️ Payment was successful,\n" +
              "but booking verification failed.\n\n" +
              "Error: " +
              (
                error?.message ||
                "Unknown error"
              )
            );

          }


          setLoading(false);

        },

      };


      // =================================================
      // CREATE RAZORPAY INSTANCE
      // =================================================

      console.log(
        "🔵 Creating Razorpay checkout..."
      );


      const razorpay =
        new window.Razorpay(
          options
        );


      // =================================================
      // PAYMENT FAILED
      // =================================================

      razorpay.on(
        "payment.failed",
        function (response) {

          console.error(
            "================================"
          );

          console.error(
            "❌ RAZORPAY PAYMENT FAILED"
          );

          console.error(
            "FULL RESPONSE:",
            response
          );

          console.error(
            "ERROR:",
            response?.error
          );

          console.error(
            "CODE:",
            response?.error?.code
          );

          console.error(
            "DESCRIPTION:",
            response?.error?.description
          );

          console.error(
            "SOURCE:",
            response?.error?.source
          );

          console.error(
            "STEP:",
            response?.error?.step
          );

          console.error(
            "REASON:",
            response?.error?.reason
          );

          console.error(
            "================================"
          );


          const errorCode =
            response?.error?.code ||
            "Unknown";

          const errorDescription =
            response?.error?.description ||
            "No description provided";

          const errorSource =
            response?.error?.source ||
            "Unknown";

          const errorStep =
            response?.error?.step ||
            "Unknown";

          const errorReason =
            response?.error?.reason ||
            "Unknown";


          alert(
            "❌ RAZORPAY PAYMENT FAILED\n\n" +

            "Code: " +
            errorCode +

            "\n\nDescription: " +
            errorDescription +

            "\n\nSource: " +
            errorSource +

            "\n\nStep: " +
            errorStep +

            "\n\nReason: " +
            errorReason
          );


          setLoading(false);

        }
      );


      // =================================================
      // OPEN RAZORPAY
      // =================================================

      console.log(
        "🟢 Opening Razorpay..."
      );


      razorpay.open();


    } catch (error) {

      // =================================================
      // PAYMENT FLOW ERROR
      // =================================================

      console.error(
        "================================"
      );

      console.error(
        "❌ PAYMENT FLOW ERROR"
      );

      console.error(
        "FULL ERROR:",
        error
      );

      console.error(
        "MESSAGE:",
        error?.message
      );

      console.error(
        "NAME:",
        error?.name
      );

      console.error(
        "STACK:",
        error?.stack
      );

      console.error(
        "================================"
      );


      alert(
        "❌ Payment Flow Error\n\n" +
        (
          error?.message ||
          "Unknown error"
        )
      );


      setLoading(false);

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen bg-gray-100 py-10 px-5">

      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">


        {/* TITLE */}

        <h1 className="text-3xl font-bold mb-6">
          Booking Confirmation
        </h1>


        {/* HOTEL */}

        <div className="space-y-2">

          <h2 className="text-2xl font-semibold">
            {state.name}
          </h2>

          <p className="text-gray-500">
            {state.vicinity ||
              state.location ||
              "N/A"}
          </p>

          <h3 className="text-2xl font-bold text-orange-500 mt-4">
            ₹4500 / Night
          </h3>

        </div>


        {/* CHECK IN */}

        <div className="mt-8">

          <label className="block mb-2 font-medium">
            Check In
          </label>

          <input
            type="date"
            value={checkIn}
            onChange={(e) =>
              setCheckIn(
                e.target.value
              )
            }
            className="w-full border rounded-lg p-3"
          />

        </div>


        {/* CHECK OUT */}

        <div className="mt-5">

          <label className="block mb-2 font-medium">
            Check Out
          </label>

          <input
            type="date"
            value={checkOut}
            onChange={(e) =>
              setCheckOut(
                e.target.value
              )
            }
            className="w-full border rounded-lg p-3"
          />

        </div>


        {/* CUSTOMER */}

        {user && (

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">

            <h3 className="font-semibold mb-2">
              Customer Details
            </h3>

            <p>
              <strong>Name:</strong>{" "}
              {user.name ||
                user.username ||
                "Customer"}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {user.email ||
                "N/A"}
            </p>

          </div>

        )}


        {/* PAY */}

        <button
          onClick={handlePayment}
          disabled={loading}
          className="mt-8 w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 rounded-xl text-lg font-semibold transition"
        >

          {loading
            ? "Processing..."
            : "Pay ₹4500"}

        </button>


      </div>

    </div>

  );

}
