import { useLocation, useNavigate } from "react-router-dom";

import {
  createOrder,
  verifyPayment,
  getProfile,
  getRazorpayKey,
} from "../services/api";

import { useEffect, useState } from "react";

export default function Booking() {

  const { state } = useLocation();
  const navigate = useNavigate();

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
        "🚀 HOTEL PAYMENT STARTED"
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
      // CHECK EMAIL
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


      if (!customerEmail) {

        alert(
          "Please add your email address to your profile before booking."
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


      if (checkIn >= checkOut) {

        alert(
          "Check-out date must be after check-in date."
        );

        return;

      }


      // =================================================
      // HOTEL DETAILS
      // =================================================

      const hotelName =
        state.name ||
        state.title ||
        "Hotel";

      const hotelLocation =
        state.vicinity ||
        state.location ||
        state.address ||
        "N/A";


      // =================================================
      // BOOKING AMOUNT
      // =================================================

      const bookingAmount =
        4500;


      setLoading(true);


      // =================================================
      // GET RAZORPAY KEY
      // =================================================

      console.log(
        "🔑 Getting Razorpay key..."
      );


      const razorpayKeyResponse =
        await getRazorpayKey();


      if (
        !razorpayKeyResponse ||
        !razorpayKeyResponse.success ||
        !razorpayKeyResponse.key
      ) {

        throw new Error(
          "Razorpay key could not be loaded."
        );

      }


      const razorpayKey =
        razorpayKeyResponse.key;


      console.log(
        "✅ Razorpay key loaded"
      );


      // =================================================
      // CHECK RAZORPAY SCRIPT
      // =================================================

      if (!window.Razorpay) {

        throw new Error(
          "Razorpay checkout failed to load. Please refresh the page."
        );

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
        "✅ ORDER RESPONSE:",
        orderResponse
      );


      if (
        !orderResponse ||
        !orderResponse.success ||
        !orderResponse.order ||
        !orderResponse.order.id
      ) {

        throw new Error(
          orderResponse?.message ||
          "Unable to create Razorpay order."
        );

      }


      const order =
        orderResponse.order;


      console.log(
        "🆔 Order ID:",
        order.id
      );


      // =================================================
      // RAZORPAY OPTIONS
      // =================================================

      const options = {

        key:
          razorpayKey,

        amount:
          order.amount,

        currency:
          order.currency || "INR",

        name:
          "TravelHub",

        description:
          `Hotel booking - ${hotelName}`,

        order_id:
          order.id,


        // =================================================
        // REAL CUSTOMER DETAILS
        // =================================================

        prefill: {

          name:
            customerName,

          email:
            customerEmail,

          contact:
            customerContact,

        },


        // =================================================
        // BOOKING DETAILS
        // =================================================

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

        handler:
          async function(response) {

            console.log(
              "================================"
            );

            console.log(
              "✅ RAZORPAY PAYMENT SUCCESS"
            );

            console.log(
              "Payment ID:",
              response.razorpay_payment_id
            );

            console.log(
              "Order ID:",
              response.razorpay_order_id
            );

            console.log(
              "================================"
            );


            try {

              // =================================================
              // VERIFY PAYMENT
              // =================================================

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


                  // CUSTOMER
                  customerName:
                    customerName,

                  customerEmail:
                    customerEmail,

                  customerContact:
                    customerContact,


                  // HOTEL
                  hotelName:
                    hotelName,

                  hotelLocation:
                    hotelLocation,


                  // DATES
                  checkIn:
                    checkIn,

                  checkOut:
                    checkOut,


                  // PAYMENT
                  amount:
                    bookingAmount,

                });


              console.log(
                "✅ VERIFY RESPONSE:",
                verification
              );


              // =================================================
              // SUCCESS
              // =================================================

              if (
                verification &&
                verification.success
              ) {

                alert(
                  "🎉 Hotel Booking Confirmed!\n\n" +
                  `Hotel: ${hotelName}\n` +
                  `Location: ${hotelLocation}\n` +
                  `Check-in: ${checkIn}\n` +
                  `Check-out: ${checkOut}\n` +
                  `Amount Paid: ₹${bookingAmount}\n\n` +
                  "Confirmation email has been sent to your email."
                );


                // Optional:
                // if your booking details page exists,
                // navigate to it here.
                //
                // navigate(`/booking/${verification.bookingId}`);

              } else {

                alert(
                  verification?.message ||
                  "Payment was successful, but booking verification failed."
                );

              }


            } catch (error) {

              console.error(
                "❌ VERIFY PAYMENT ERROR:",
                error
              );

              alert(
                "⚠️ Payment was successful,\n" +
                "but booking verification failed.\n\n" +
                error?.message
              );

            }


            setLoading(false);

          },

      };


      // =================================================
      // CREATE RAZORPAY
      // =================================================

      const razorpay =
        new window.Razorpay(
          options
        );


      // =================================================
      // PAYMENT FAILED
      // =================================================

      razorpay.on(
        "payment.failed",
        function(response) {

          console.error(
            "❌ PAYMENT FAILED:",
            response
          );


          alert(
            "❌ Payment Failed\n\n" +
            (
              response?.error?.description ||
              "Payment could not be completed."
            )
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

      console.error(
        "❌ PAYMENT FLOW ERROR:",
        error
      );


      alert(
        "❌ Payment Error\n\n" +
        (
          error?.message ||
          "Something went wrong."
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


            {(
              user.phone ||
              user.contact
            ) && (

              <p>

                <strong>Contact:</strong>{" "}

                {user.phone ||
                  user.contact}

              </p>

            )}

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