import { useEffect, useState } from "react";
import { loginUser, sendLoginOtp, verifyOtpLogin } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const isValidPhoneNumber = (value) => {
    const cleaned = String(value).replace(/\s+/g, "").replace(/[()\-]/g, "");
    return /^\+?[1-9]\d{8,14}$/.test(cleaned);
};

export default function Login() {
    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSendOtp = async () => {
        if (!phone.trim()) {
            alert("Please enter your mobile number");
            return;
        }

        if (!isValidPhoneNumber(phone)) {
            alert("Please enter a valid mobile number, for example +91 98765 43210");
            return;
        }

        try {
            setLoading(true);
            await sendLoginOtp({ phone });
            setOtpSent(true);
            setOtp("");
            setCountdown(30);
            alert("OTP sent to your mobile number");
        } catch (error) {
            alert(error.message || "Unable to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyLogin = async (e) => {
        e.preventDefault();

        if (!phone.trim() || !otp.trim()) {
            alert("Please enter your mobile number and OTP");
            return;
        }

        try {
            setLoading(true);
            await verifyOtpLogin({ phone, otp });
            navigate("/");
        } catch (error) {
            alert(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black-50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* ================================================= */}
            {/* BACKGROUND ANIMATIONS */}
            {/* ================================================= */}

            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                {/* Floating circles */}

                <div className="absolute top-20 left-[15%] w-4 h-4 bg-blue-500 rounded-full animate-bounce opacity-70"></div>

                <div className="absolute top-40 right-[18%] w-3 h-3 bg-indigo-400 rounded-full animate-pulse opacity-70"></div>

                <div className="absolute bottom-32 left-[20%] w-5 h-5 bg-blue-300 rounded-full animate-ping opacity-40"></div>

                <div className="absolute bottom-20 right-[20%] w-4 h-4 bg-purple-400 rounded-full animate-bounce opacity-50"></div>


                {/* Decorative circles */}

                <div className="absolute -top-20 -left-20 w-72 h-72 border border-blue-100 rounded-full"></div>

                <div className="absolute -bottom-32 -right-20 w-96 h-96 border border-indigo-100 rounded-full"></div>


                {/* Moving blue line */}

                <div className="absolute top-24 left-0 w-72 h-[2px] bg-gradient-to-r from-transparent via-blue-300 to-transparent animate-pulse"></div>

                <div className="absolute bottom-32 right-0 w-72 h-[2px] bg-gradient-to-r from-transparent via-indigo-300 to-transparent animate-pulse"></div>

            </div>


            {/* ================================================= */}
            {/* MAIN CARD */}
            {/* ================================================= */}

            <div className="relative w-full max-w-md">

                {/* Glow behind card */}

                <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 rounded-[35px] blur-xl opacity-40"></div>


                <div className="relative bg-white rounded-[32px] shadow-2xl border border-white p-8 sm:p-10">


                    {/* ================================================= */}
                    {/* FACE ICON */}
                    {/* ================================================= */}

                    <div className="flex justify-center mb-6">

                        <div className="relative">

                            {/* Outer animated ring */}

                            <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-blue-200 animate-ping opacity-30"></div>

                            {/* Icon circle */}

                            <div className="relative w-24 h-24 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shadow-lg">

                                <div className="text-4xl">
                                    👤
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* TITLE */}
                    {/* ================================================= */}

                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center tracking-tight">
                        Welcome Back 👋
                    </h1>

                    <p className="text-center text-slate-500 mt-3 mb-8">
                        Login to continue to your account
                    </p>


                    {/* ================================================= */}
                    {/* LOGIN FORM */}
                    {/* ================================================= */}

                    <form onSubmit={handleVerifyLogin}>
                        <div className="relative mb-5">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl">
                                📱
                            </div>
                            <input
                                type="tel"
                                placeholder="Enter your mobile number"
                                value={phone}
                                required
                                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white text-slate-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-sm"
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        {!otpSent ? (
                            <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={loading}
                                className="group w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? "Sending..." : "Send OTP"}
                            </button>
                        ) : (
                            <>
                                <div className="relative mb-5">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl">
                                        🔐
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        required
                                        className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white text-slate-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-sm"
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                                >
                                    {loading ? "Verifying..." : "Verify & Login"}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={loading || countdown > 0}
                                    className="mt-3 w-full h-11 rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold hover:bg-slate-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                                </button>
                            </>
                        )}

                        <p className="text-center text-slate-500 mt-8">
                            Don't have an account?
                            <Link
                                to="/register"
                                className="text-blue-600 font-bold ml-2 hover:text-blue-700 transition"
                            >
                                Register →
                            </Link>
                        </p>
                    </form>
                </div>
            </div>

        </div>
    );
}