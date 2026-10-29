import {
    useEffect,
    useState,
} from "react";

import {
    apiUrl,
} from "../services/api";


export default function Mailbox() {

    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD BOOKINGS
    // =====================================================

    useEffect(() => {

        async function loadBookings() {

            try {

                setLoading(true);

                setError("");


                console.log(
                    "📬 Loading booking mailbox..."
                );


                const response =
                    await fetch(
                        `${apiUrl}/mailbox/bookings`,
                        {
                            method: "GET",

                            credentials:
                                "include",
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "📬 Mailbox response:",
                    data
                );


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Failed to load mailbox"
                    );

                }


                setBookings(
                    data.bookings ||
                    []
                );

            } catch (error) {

                console.error(
                    "❌ Mailbox error:",
                    error
                );


                setError(
                    error.message ||
                    "Failed to load booking mailbox."
                );

            } finally {

                setLoading(
                    false
                );

            }

        }


        loadBookings();

    }, []);


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div
                className="
                    min-h-screen
                    bg-gray-100
                    flex
                    items-center
                    justify-center
                "
            >

                <div
                    className="
                        text-lg
                        font-semibold
                    "
                >
                    📬 Loading mailbox...
                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div
                className="
                    min-h-screen
                    bg-gray-100
                    p-8
                "
            >

                <div
                    className="
                        max-w-4xl
                        mx-auto
                        bg-white
                        rounded-2xl
                        shadow-lg
                        p-8
                    "
                >

                    <h1
                        className="
                            text-3xl
                            font-bold
                            mb-4
                        "
                    >
                        📬 Mailbox
                    </h1>


                    <div
                        className="
                            bg-red-100
                            text-red-700
                            p-4
                            rounded-lg
                        "
                    >
                        ❌ {error}
                    </div>

                </div>

            </div>

        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div
            className="
                min-h-screen
                bg-gray-100
                py-10
                px-5
            "
        >

            <div
                className="
                    max-w-5xl
                    mx-auto
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="
                        bg-white
                        rounded-2xl
                        shadow-lg
                        p-6
                        mb-6
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <div>

                            <h1
                                className="
                                    text-3xl
                                    font-bold
                                "
                            >
                                📬 Mailbox
                            </h1>


                            <p
                                className="
                                    text-gray-500
                                    mt-1
                                "
                            >
                                Your hotel booking confirmations
                            </p>

                        </div>


                        <div
                            className="
                                bg-green-100
                                text-green-700
                                px-4
                                py-2
                                rounded-full
                                font-semibold
                            "
                        >

                            {bookings.length} Booking
                            {bookings.length !== 1
                                ? "s"
                                : ""}

                        </div>

                    </div>

                </div>


                {/* =================================================
                    NO BOOKINGS
                ================================================= */}

                {bookings.length === 0 ? (

                    <div
                        className="
                            bg-white
                            rounded-2xl
                            shadow-lg
                            p-12
                            text-center
                        "
                    >

                        <div
                            className="
                                text-6xl
                                mb-5
                            "
                        >
                            📭
                        </div>


                        <h2
                            className="
                                text-2xl
                                font-bold
                                mb-2
                            "
                        >
                            No bookings yet
                        </h2>


                        <p
                            className="
                                text-gray-500
                            "
                        >
                            Your confirmed hotel bookings
                            will appear here.
                        </p>

                    </div>

                ) : (

                    <div
                        className="
                            space-y-6
                        "
                    >

                        {bookings.map(
                            (booking) => (

                                <div
                                    key={
                                        booking.id
                                    }
                                    className="
                                        bg-white
                                        rounded-2xl
                                        shadow-lg
                                        overflow-hidden
                                    "
                                >

                                    {/* =================================================
                                        HEADER
                                    ================================================= */}

                                    <div
                                        className="
                                            bg-gray-900
                                            text-white
                                            p-6
                                        "
                                    >

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-4
                                            "
                                        >

                                            <div>

                                                <p
                                                    className="
                                                        text-sm
                                                        text-gray-300
                                                    "
                                                >
                                                    Hotel Booking
                                                </p>


                                                <h2
                                                    className="
                                                        text-2xl
                                                        font-bold
                                                        mt-1
                                                    "
                                                >
                                                    {
                                                        booking.hotel_name
                                                    }
                                                </h2>

                                            </div>


                                            <div
                                                className="
                                                    bg-green-500
                                                    text-white
                                                    px-4
                                                    py-2
                                                    rounded-full
                                                    font-semibold
                                                    text-sm
                                                "
                                            >
                                                ✓{" "}
                                                {
                                                    booking.status ||
                                                    "confirmed"
                                                }
                                            </div>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        DETAILS
                                    ================================================= */}

                                    <div
                                        className="
                                            p-6
                                        "
                                    >

                                        <div
                                            className="
                                                grid
                                                grid-cols-1
                                                md:grid-cols-2
                                                gap-6
                                            "
                                        >

                                            {/* HOTEL */}

                                            <div>

                                                <h3
                                                    className="
                                                        font-semibold
                                                        text-gray-900
                                                        mb-3
                                                    "
                                                >
                                                    🏨 Hotel Details
                                                </h3>


                                                <div
                                                    className="
                                                        space-y-2
                                                        text-gray-600
                                                    "
                                                >

                                                    <p>

                                                        <strong>
                                                            Hotel:
                                                        </strong>{" "}

                                                        {
                                                            booking.hotel_name
                                                        }

                                                    </p>


                                                    <p>

                                                        <strong>
                                                            Location:
                                                        </strong>{" "}

                                                        {
                                                            booking.hotel_location ||
                                                            "N/A"
                                                        }

                                                    </p>

                                                </div>

                                            </div>


                                            {/* CUSTOMER */}

                                            <div>

                                                <h3
                                                    className="
                                                        font-semibold
                                                        text-gray-900
                                                        mb-3
                                                    "
                                                >
                                                    👤 Customer Details
                                                </h3>


                                                <div
                                                    className="
                                                        space-y-2
                                                        text-gray-600
                                                    "
                                                >

                                                    <p>

                                                        <strong>
                                                            Name:
                                                        </strong>{" "}

                                                        {
                                                            booking.customer_name ||
                                                            "N/A"
                                                        }

                                                    </p>


                                                    <p>

                                                        <strong>
                                                            Email:
                                                        </strong>{" "}

                                                        {
                                                            booking.customer_email ||
                                                            "N/A"
                                                        }

                                                    </p>


                                                    <p>

                                                        <strong>
                                                            Contact:
                                                        </strong>{" "}

                                                        {
                                                            booking.customer_contact ||
                                                            "N/A"
                                                        }

                                                    </p>

                                                </div>

                                            </div>


                                            {/* DATES */}

                                            <div>

                                                <h3
                                                    className="
                                                        font-semibold
                                                        text-gray-900
                                                        mb-3
                                                    "
                                                >
                                                    📅 Stay Details
                                                </h3>


                                                <div
                                                    className="
                                                        space-y-2
                                                        text-gray-600
                                                    "
                                                >

                                                    <p>

                                                        <strong>
                                                            Check-in:
                                                        </strong>{" "}

                                                        {
                                                            booking.check_in ||
                                                            "N/A"
                                                        }

                                                    </p>


                                                    <p>

                                                        <strong>
                                                            Check-out:
                                                        </strong>{" "}

                                                        {
                                                            booking.check_out ||
                                                            "N/A"
                                                        }

                                                    </p>

                                                </div>

                                            </div>


                                            {/* PAYMENT */}

                                            <div>

                                                <h3
                                                    className="
                                                        font-semibold
                                                        text-gray-900
                                                        mb-3
                                                    "
                                                >
                                                    💳 Payment Details
                                                </h3>


                                                <div
                                                    className="
                                                        space-y-2
                                                        text-gray-600
                                                    "
                                                >

                                                    <p>

                                                        <strong>
                                                            Amount:
                                                        </strong>{" "}

                                                        <span
                                                            className="
                                                                text-green-600
                                                                font-bold
                                                            "
                                                        >
                                                            ₹
                                                            {
                                                                Number(
                                                                    booking.amount ||
                                                                    0
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )
                                                            }
                                                        </span>

                                                    </p>


                                                    <p
                                                        className="
                                                            break-all
                                                        "
                                                    >

                                                        <strong>
                                                            Payment ID:
                                                        </strong>{" "}

                                                        {
                                                            booking.razorpay_payment_id ||
                                                            "N/A"
                                                        }

                                                    </p>


                                                    <p
                                                        className="
                                                            break-all
                                                        "
                                                    >

                                                        <strong>
                                                            Order ID:
                                                        </strong>{" "}

                                                        {
                                                            booking.razorpay_order_id ||
                                                            "N/A"
                                                        }

                                                    </p>

                                                </div>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            BOOKING ID
                                        ================================================= */}

                                        <div
                                            className="
                                                border-t
                                                mt-6
                                                pt-5
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    flex-col
                                                    md:flex-row
                                                    md:items-center
                                                    md:justify-between
                                                    gap-3
                                                "
                                            >

                                                <p
                                                    className="
                                                        text-gray-500
                                                    "
                                                >

                                                    <strong>
                                                        Booking ID:
                                                    </strong>{" "}

                                                    <span
                                                        className="
                                                            text-gray-900
                                                            font-semibold
                                                        "
                                                    >
                                                        BK-
                                                        {
                                                            booking.id
                                                        }
                                                    </span>

                                                </p>


                                                <p
                                                    className="
                                                        text-sm
                                                        text-gray-400
                                                    "
                                                >

                                                    Booked on{" "}

                                                    {
                                                        booking.created_at
                                                            ? new Date(
                                                                booking.created_at
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )
                                                            : "N/A"
                                                    }

                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}