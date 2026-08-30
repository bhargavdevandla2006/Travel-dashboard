import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";
import FaceAuth from "../components/FaceAuth";

export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showFaceAuth, setShowFaceAuth] = useState(false);
    const [faceDescriptor, setFaceDescriptor] = useState(null);

    // Password checks
    const hasLength = formData.password.length >= 8;
    const hasLetter = /[A-Za-z]/.test(formData.password);
    const hasNumber = /[0-9]/.test(formData.password);

    const passwordValid =
        hasLength &&
        hasLetter &&
        hasNumber;

    // Password strength
    let passwordStrength = "Weak";

    if (hasLength && hasLetter) {
        passwordStrength = "Medium";
    }

    if (passwordValid) {
        passwordStrength = "Strong";
    }

    // -----------------------------
    // REGISTER
    // -----------------------------

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!passwordValid) {
            alert(
                "Password must contain at least 8 characters, one alphabet and one number."
            );
            return;
        }

        try {
            const receivedData = await registerUser(formData);

            console.log(receivedData);

            navigate("/");
        } catch (error) {
            console.log(error);

            alert(error.message || "Register failed");
        }
    };

    // -----------------------------
    // FACE DETECTED
    // -----------------------------

    const handleFaceDetected = (descriptor) => {
        console.log("Face captured:", descriptor);

        setFaceDescriptor(descriptor);

        setShowFaceAuth(false);
    };

    return (
        <div className="min-h-screen bg-black-50 flex items-center justify-center p-6 relative overflow-hidden">

            {/* ========================================= */}
            {/* BACKGROUND ANIMATIONS */}
            {/* ========================================= */}

            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                {/* Floating dots */}

                <div className="absolute top-20 left-[15%] w-4 h-4 bg-blue-500 rounded-full animate-bounce opacity-70"></div>

                <div className="absolute top-32 right-[18%] w-3 h-3 bg-indigo-400 rounded-full animate-pulse opacity-70"></div>

                <div className="absolute bottom-32 left-[18%] w-5 h-5 bg-blue-300 rounded-full animate-ping opacity-40"></div>

                <div className="absolute bottom-20 right-[20%] w-4 h-4 bg-purple-400 rounded-full animate-bounce opacity-50"></div>


                {/* Large decorative circles */}

                <div className="absolute -top-24 -left-24 w-80 h-80 border border-blue-100 rounded-full"></div>

                <div className="absolute -bottom-32 -right-24 w-96 h-96 border border-indigo-100 rounded-full"></div>


                {/* Decorative lines */}

                <div className="absolute top-28 left-0 w-72 h-[2px] bg-gradient-to-r from-transparent via-blue-300 to-transparent animate-pulse"></div>

                <div className="absolute bottom-28 right-0 w-72 h-[2px] bg-gradient-to-r from-transparent via-indigo-300 to-transparent animate-pulse"></div>

            </div>


            {/* ========================================= */}
            {/* MAIN CARD */}
            {/* ========================================= */}

            <div className="relative w-full max-w-md">

                {/* Glow */}

                <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 rounded-[35px] blur-xl opacity-40"></div>


                <div className="relative bg-white rounded-[32px] shadow-2xl border border-white p-8 sm:p-10">


                    {/* ========================================= */}
                    {/* ICON */}
                    {/* ========================================= */}

                    <div className="flex justify-center mb-6">

                        <div className="relative">

                            {/* Animated ring */}

                            <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-blue-200 animate-ping opacity-30"></div>


                            {/* Icon */}

                            <div className="relative w-24 h-24 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shadow-lg">

                                <span className="text-4xl">
                                    👤
                                </span>

                                {/* Plus */}

                                <span className="absolute bottom-1 right-1 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg shadow-md">
                                    +
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* ========================================= */}
                    {/* TITLE */}
                    {/* ========================================= */}

                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center tracking-tight">
                        Create Account 🎉
                    </h1>

                    <p className="text-center text-slate-500 mt-3 mb-8">
                        Fill in the details to get started
                    </p>


                    {/* ========================================= */}
                    {/* FORM */}
                    {/* ========================================= */}

                    <form onSubmit={handleRegister}>


                        {/* NAME */}

                        <div className="relative mb-4">

                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl">
                                👤
                            </div>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={formData.name}
                                required
                                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white text-slate-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-sm"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                            />

                        </div>


                        {/* EMAIL */}

                        <div className="relative mb-4">

                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl">
                                ✉
                            </div>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                required
                                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white text-slate-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-sm"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                            />

                        </div>


                        {/* PASSWORD */}

                        <div className="relative mb-4">

                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl">
                                🔒
                            </div>

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                value={formData.password}
                                required
                                className="w-full h-14 pl-12 pr-12 rounded-2xl border border-slate-200 bg-white text-slate-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-sm"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value,
                                    })
                                }
                            />


                            {/* SHOW PASSWORD */}

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>

                        </div>


                        {/* ========================================= */}
                        {/* PASSWORD STRENGTH */}
                        {/* ========================================= */}

                        <div className="mb-5">

                            <div className="flex items-center justify-between text-sm mb-2">

                                <span className="text-slate-500">
                                    Password strength
                                </span>

                                <span
                                    className={
                                        passwordStrength === "Strong"
                                            ? "text-green-600 font-semibold"
                                            : passwordStrength === "Medium"
                                                ? "text-yellow-600 font-semibold"
                                                : "text-red-500 font-semibold"
                                    }
                                >
                                    {passwordStrength}
                                </span>

                            </div>


                            {/* Strength bars */}

                            <div className="flex gap-2">

                                <div
                                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                                        formData.password.length > 0
                                            ? "bg-red-400"
                                            : "bg-slate-200"
                                    }`}
                                ></div>

                                <div
                                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                                        hasLength && hasLetter
                                            ? "bg-yellow-400"
                                            : "bg-slate-200"
                                    }`}
                                ></div>

                                <div
                                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                                        passwordValid
                                            ? "bg-green-500"
                                            : "bg-slate-200"
                                    }`}
                                ></div>

                                <div
                                    className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                                        passwordValid
                                            ? "bg-green-500"
                                            : "bg-slate-200"
                                    }`}
                                ></div>

                            </div>

                        </div>


                        {/* ========================================= */}
                        {/* PASSWORD REQUIREMENTS */}
                        {/* ========================================= */}

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">

                            <p className="text-sm font-semibold text-slate-700 mb-3">
                                Password must contain:
                            </p>


                            {/* LENGTH */}

                            <p
                                className={`text-sm mb-2 ${
                                    hasLength
                                        ? "text-green-600"
                                        : "text-slate-500"
                                }`}
                            >
                                {hasLength ? "✓" : "○"} At least 8 characters
                            </p>


                            {/* LETTER */}

                            <p
                                className={`text-sm mb-2 ${
                                    hasLetter
                                        ? "text-green-600"
                                        : "text-slate-500"
                                }`}
                            >
                                {hasLetter ? "✓" : "○"} At least 1 letter (A-Z, a-z)
                            </p>


                            {/* NUMBER */}

                            <p
                                className={`text-sm ${
                                    hasNumber
                                        ? "text-green-600"
                                        : "text-slate-500"
                                }`}
                            >
                                {hasNumber ? "✓" : "○"} At least 1 number (0-9)
                            </p>

                        </div>


                        {/* ========================================= */}
                        {/* REGISTER BUTTON */}
                        {/* ========================================= */}

                        <button
                            type="submit"
                            className="group w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3"
                        >

                            <span>
                                Register
                            </span>

                            <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">
                                →
                            </span>

                        </button>


                        {/* ========================================= */}
                        {/* OR */}
                        {/* ========================================= */}

                        <div className="flex items-center gap-4 my-7">

                            <div className="h-px bg-slate-200 flex-1"></div>

                            <span className="text-slate-400 font-medium">
                                OR
                            </span>

                            <div className="h-px bg-slate-200 flex-1"></div>

                        </div>


                        {/* ========================================= */}
                        {/* FACE REGISTER */}
                        {/* ========================================= */}

                        <button
                            type="button"
                            onClick={() => setShowFaceAuth(true)}
                            className="group w-full h-14 rounded-2xl border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-between px-5"
                        >

                            <div className="flex items-center gap-4">

                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                    👤
                                </div>

                                <span className="font-semibold text-slate-800">
                                    Register with Face ID
                                </span>

                            </div>

                            <span className="text-xl text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all">
                                →
                            </span>

                        </button>


                        {/* FACE STATUS */}

                        {faceDescriptor && (
                            <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-100 text-center">

                                <p className="text-green-600 font-semibold text-sm">
                                    Face captured successfully! ✅
                                </p>

                            </div>
                        )}


                        {/* ========================================= */}
                        {/* LOGIN LINK */}
                        {/* ========================================= */}

                        <p className="text-center text-slate-500 mt-8">

                            Already have an account?

                            <Link
                                to="/login"
                                className="text-blue-600 font-bold ml-2 hover:text-blue-700 transition"
                            >
                                Login →
                            </Link>

                        </p>

                    </form>

                </div>

            </div>


            {/* ========================================= */}
            {/* FACE AUTH POPUP */}
            {/* ========================================= */}

            {showFaceAuth && (
                <FaceAuth
                    onFaceDetected={handleFaceDetected}
                    onClose={() => setShowFaceAuth(false)}
                />
            )}

        </div>
    );
}