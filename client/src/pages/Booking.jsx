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

        console.log("👤 Logged-in user:", data);

        setUser(data);
      } catch (error) {
        console.error("❌ Failed to load profile:", error);
      }
    }

    loadUser();
  }, []);

  // =====================================================
  // NO HOTEL
  // =====================================================

  if (!state) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-violet-50 flex items-center justify-center px-5">
        <div className="rounded-3xl border border-white/80 bg-white/70 px-10 py-12 text-center shadow-xl backdrop-blur-xl">
          <div className="mb-4 text-5xl">🏨</div>

          <h1 className="text-3xl font-extrabold text-slate-800">
            No Hotel Selected
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Please select a hotel before continuing.
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // HOTEL DISPLAY DETAILS
  // =====================================================

  const displayHotelName =
    state.name ||
    state.title ||
    "Hotel";

  const displayHotelLocation =
    state.vicinity ||
    state.location ||
    state.address ||
    "Location unavailable";

  const hotelImage =
    state.photo ||
    state.image ||
    state.imageUrl ||
    state.thumbnail ||
    state.photoUrl ||
    "";

  const bookingAmount = 4500;

  // =====================================================
  // PAYMENT
  // =====================================================

  const handlePayment = async () => {
    try {
      console.log("================================");
      console.log("🚀 HOTEL PAYMENT STARTED");
      console.log("================================");

      // =================================================
      // CHECK USER
      // =================================================

      if (!user) {
        alert("Please login first.");
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

      const hotelName = displayHotelName;

      const hotelLocation = displayHotelLocation;

      setLoading(true);

      // =================================================
      // GET RAZORPAY KEY
      // =================================================

      console.log("🔑 Getting Razorpay key...");

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

      console.log("✅ Razorpay key loaded");

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

      console.log("💰 Creating Razorpay order...");

      const orderResponse =
        await createOrder(bookingAmount);

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
        key: razorpayKey,

        amount: order.amount,

        currency:
          order.currency || "INR",

        name: "TravelHub",

        description:
          `Hotel booking - ${hotelName}`,

        order_id: order.id,

        // =================================================
        // CUSTOMER DETAILS
        // =================================================

        prefill: {
          name: customerName,

          email: customerEmail,

          contact: customerContact,
        },

        // =================================================
        // BOOKING DETAILS
        // =================================================

        notes: {
          hotel_name: hotelName,

          hotel_location: hotelLocation,

          check_in: checkIn,

          check_out: checkOut,
        },

        theme: {
          color: "#6366f1",
        },

        // =================================================
        // PAYMENT SUCCESS
        // =================================================

        handler: async function (response) {
          console.log("================================");
          console.log("✅ RAZORPAY PAYMENT SUCCESS");

          console.log(
            "Payment ID:",
            response.razorpay_payment_id
          );

          console.log(
            "Order ID:",
            response.razorpay_order_id
          );

          console.log("================================");

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
                "Your booking has been added to your Mailbox."
              );

              navigate("/mailbox");
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
        new window.Razorpay(options);

      // =================================================
      // PAYMENT FAILED
      // =================================================

      razorpay.on(
        "payment.failed",
        function (response) {
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

      console.log("🟢 Opening Razorpay...");

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-violet-50 px-4 py-8 sm:px-6 lg:px-8">

      {/* =================================================
          ANIMATED BACKGROUND
      ================================================= */}

      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-sky-300/30 blur-3xl animate-pulse" />

      <div className="pointer-events-none absolute -right-32 -top-10 h-72 w-72 rounded-full bg-violet-300/25 blur-3xl animate-pulse" />

      <div className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl animate-pulse" />

      {/* =================================================
          FLOATING ELEMENTS
      ================================================= */}

      <div className="pointer-events-none absolute left-[5%] top-[15%] hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/50 text-2xl shadow-lg backdrop-blur-xl sm:flex animate-bounce">
        ✈️
      </div>

      <div className="pointer-events-none absolute right-[7%] top-[25%] hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/50 text-2xl shadow-lg backdrop-blur-xl sm:flex animate-bounce [animation-delay:500ms]">
        🧳
      </div>

      <div className="pointer-events-none absolute bottom-[12%] left-[8%] hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/50 text-2xl shadow-lg backdrop-blur-xl sm:flex animate-bounce [animation-delay:1000ms]">
        🌍
      </div>

      {/* =================================================
          MAIN GLASS CARD
      ================================================= */}

      <div className="relative z-10 mx-auto w-full max-w-3xl overflow-hidden rounded-[32px] border border-white/90 bg-white/65 p-5 shadow-[0_30px_90px_rgba(59,130,246,0.16)] backdrop-blur-2xl sm:p-8 animate-[fadeInUp_0.8s_ease-out]">

        {/* Glass shine */}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/80 via-transparent to-white/20" />

        <div className="relative z-10">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-8 text-center">

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-200/70 bg-indigo-50/70 px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-600 backdrop-blur-md">

              <span className="animate-pulse">
                ✦
              </span>

              TravelHub Stay

            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-800 sm:text-4xl">

              Booking Confirmation

            </h1>

            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">

              Complete your booking and get ready for your next adventure.

            </p>

          </div>

          {/* =================================================
              HOTEL CARD
          ================================================= */}

          <div className="group overflow-hidden rounded-3xl border border-white/90 bg-white/55 shadow-lg shadow-sky-100/60 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:bg-white/75 hover:shadow-2xl animate-[floatCard_5s_ease-in-out_infinite]">

            {/* HOTEL IMAGE */}

            {hotelImage ? (
              <div className="relative h-52 overflow-hidden">

                <img
                  src={hotelImage}
                  alt={displayHotelName}
                  className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 animate-[slowZoom_8s_ease-in-out_infinite]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 rounded-full border border-white/40 bg-white/20 px-4 py-2 text-xs font-bold text-white backdrop-blur-lg">

                  ✦ Selected Stay

                </div>

              </div>
            ) : (
              <div className="flex h-44 items-center justify-center bg-gradient-to-br from-sky-100 via-white to-violet-100">

                <div className="text-center">

                  <div className="text-6xl">
                    🏨
                  </div>

                  <p className="mt-2 text-xs font-bold text-slate-500">
                    Your selected hotel
                  </p>

                </div>

              </div>
            )}

            {/* HOTEL INFORMATION */}

            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0">

                <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">

                  Your Stay

                </p>

                <h2 className="truncate text-xl font-black text-slate-800 sm:text-2xl">

                  {displayHotelName}

                </h2>

                <p className="mt-2 text-sm font-medium text-slate-500">

                  📍 {displayHotelLocation}

                </p>

              </div>
<div className="w-fit shrink-0 rounded-2xl border border-orange-200/70 bg-orange-50/80 px-5 py-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg animate-[priceGlow_3s_ease-in-out_infinite]">
              

                <span className="block text-2xl font-black text-orange-600">

                  ₹4500

                </span>

                <span className="text-xs font-semibold text-orange-700">

                  per night

                </span>

              </div>

            </div>

          </div>

          {/* =================================================
              DATE SECTION
          ================================================= */}

          <div className="mt-8 animate-[slideInRight_0.8s_ease-out]">

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-200/70 bg-sky-100/70 text-xl shadow-sm">

                📅

              </div>

              <div>

                <h3 className="font-black text-slate-800">

                  Choose your dates

                </h3>

                <p className="text-xs text-slate-500">

                  Select your check-in and check-out dates.

                </p>

              </div>

            </div>

            <div className="grid gap-4 sm:grid-cols-2">

              {/* CHECK IN */}

              <div>

                <label className="mb-2 block text-xs font-extrabold text-slate-700">

                  Check In

                </label>

                <div className="flex items-center rounded-2xl border border-slate-200/80 bg-white/65 px-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:bg-white/90 hover:shadow-lg focus-within:-translate-y-1 focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.10)]">

                  <span className="text-base">
                    🗓️
                  </span>

                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) =>
                      setCheckIn(e.target.value)
                    }
                    className="w-full bg-transparent px-3 py-3 text-sm font-bold text-slate-800 outline-none"
                  />

                </div>

              </div>

              {/* CHECK OUT */}

              <div>

                <label className="mb-2 block text-xs font-extrabold text-slate-700">

                  Check Out

                </label>

                <div className="flex items-center rounded-2xl border border-slate-200/80 bg-white/65 px-3 shadow-sm transition-all duration-300 hover:bg-white/90 focus-within:border-indigo-400 focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(99,102,241,0.10)]">

                  <span className="text-base">
                    🗓️
                  </span>

                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) =>
                      setCheckOut(e.target.value)
                    }
                    className="w-full bg-transparent px-3 py-3 text-sm font-bold text-slate-800 outline-none"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              CUSTOMER DETAILS
          ================================================= */}

          {user && (
            <div className="mt-6 rounded-2xl border border-emerald-200/60 bg-emerald-50/60 p-4 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-50/80 animate-[slideInLeft_0.8s_ease-out]">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-xl shadow-sm">

                  👤

                </div>

                <div className="min-w-0 flex-1">

                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">

                    Booking For

                  </p>

                  <h3 className="truncate text-sm font-black text-slate-800">

                    {user.name ||
                      user.username ||
                      "Customer"}

                  </h3>

                  <p className="truncate text-xs text-slate-500">

                    {user.email || "N/A"}

                  </p>

                  {(user.phone ||
                    user.contact) && (
                    <p className="text-[11px] text-slate-500">

                      {user.phone ||
                        user.contact}

                    </p>
                  )}

                </div>

               <div className="hidden shrink-0 rounded-full border border-emerald-200/70 bg-emerald-100/80 px-3 py-2 text-[10px] font-black text-emerald-700 shadow-sm sm:block animate-[softPulse_2.5s_ease-in-out_infinite]">

                  ✓ VERIFIED

                </div>

              </div>

            </div>
          )}

          {/* =================================================
              PAYMENT SUMMARY
          ================================================= */}

         <div className="mt-6 rounded-2xl border border-white/80 bg-white/50 p-5 shadow-sm backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:bg-white/70 hover:shadow-xl animate-[fadeInUp_1s_ease-out]">

            <div className="flex items-center justify-between text-sm">

              <span className="font-medium text-slate-500">

                Room price

              </span>

              <span className="font-bold text-slate-700">

                ₹4500

              </span>

            </div>

            <div className="mt-3 flex items-center justify-between text-sm">

              <span className="font-medium text-slate-500">

                Taxes & fees

              </span>

              <span className="font-bold text-emerald-600">

                Included

              </span>

            </div>

            <div className="my-4 h-px bg-slate-200/70" />

            <div className="flex items-center justify-between">

              <span className="font-black text-slate-800">

                Total

              </span>

              <span className="text-2xl font-black text-orange-600">

                ₹4500

              </span>

            </div>

          </div>

          {/* =================================================
              PAYMENT BUTTON
          ================================================= */}

          <button
            onClick={handlePayment}
            disabled={loading}
           className="group relative mt-6 flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 px-5 py-4 text-sm font-black text-white shadow-lg shadow-blue-300/30 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-400/50 active:scale-[0.97] animate-[buttonGlow_3s_ease-in-out_infinite] disabled:cursor-not-allowed disabled:opacity-60"
          >

            {/* Animated shine */}

            <span className="absolute inset-y-0 -left-24 w-16 -skew-x-12 bg-white/40 transition-all duration-700 group-hover:left-[120%]" />

            <span className="relative text-lg">

              💳

            </span>

            <span className="relative">

              {loading
                ? "Processing Payment..."
                : "Pay ₹4500 Securely"}

            </span>

            {!loading && (
             <span className="relative text-xl transition-transform duration-300 group-hover:translate-x-2 animate-[arrowMove_1.5s_ease-in-out_infinite]">

                →

              </span>
            )}

          </button>

          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500 animate-[softPulse_3s_ease-in-out_infinite]">

            <span>
              🔒
            </span>

            Secure payment powered by Razorpay

          </div>

        </div>

      </div>

    </div>
  );
}