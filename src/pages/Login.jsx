import { useState } from "react";
import { loginUser, faceLogin } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import FaceAuth from "../components/FaceAuth";
import { getBrowserId } from "../utils/browserAuth";


export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showFaceAuth, setShowFaceAuth] = useState(false);
    const [faceDescriptor, setFaceDescriptor] = useState(null);

    // -------------------------------
    // NORMAL LOGIN
    // -------------------------------

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const browserId = getBrowserId();

            const receivedData = await loginUser({
                ...formData,
                browserId: browserId
            });

            console.log(receivedData);

            navigate("/");
        } catch (error) {
            console.log(error);

            alert(error.message || "Login failed");
        }
    };

    // -------------------------------
    // FACE DETECTED
    // -------------------------------
    const handleFaceDetected = async (descriptor) => {
        console.log("Face detected:", descriptor);

        // Save the face descriptor in state
        setFaceDescriptor(descriptor);

        try {
            const browserId = getBrowserId();

            const receivedData = await faceLogin({
                browserId: browserId,
                faceDescriptor: descriptor,
            });

            console.log(receivedData);

            navigate("/");

        } catch (error) {
            console.error(error);

            alert(
                error.message ||
                "Face authentication failed"
            );
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

                    <form onSubmit={handleLogin}>


                        {/* EMAIL */}

                        <div className="relative mb-5">

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

                        <div className="relative mb-5">

                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl">
                                🔒
                            </div>

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
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

                            {/* Show / Hide password */}

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


                        {/* REMEMBER + FORGOT */}

                        <div className="flex items-center justify-between mb-6 text-sm">

                            <label className="flex items-center gap-2 text-slate-500 cursor-pointer">

                                <input
                                    type="checkbox"
                                    className="w-4 h-4 accent-blue-600"
                                />

                                Remember me

                            </label>

                            <button
                                type="button"
                                className="text-blue-600 font-semibold hover:text-blue-700 transition"
                            >
                                Forgot Password?
                            </button>

                        </div>


                        {/* ================================================= */}
                        {/* LOGIN BUTTON */}
                        {/* ================================================= */}

                        <button
                            type="submit"
                            className="group w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3"
                        >

                            <span>
                                Login
                            </span>

                            <span className="text-2xl group-hover:translate-x-2 transition-transform duration-300">
                                →
                            </span>

                        </button>


                        {/* ================================================= */}
                        {/* OR */}
                        {/* ================================================= */}

                        <div className="flex items-center gap-4 my-7">

                            <div className="h-px bg-slate-200 flex-1"></div>

                            <span className="text-slate-400 font-medium">
                                OR
                            </span>

                            <div className="h-px bg-slate-200 flex-1"></div>

                        </div>


                        {/* ================================================= */}
                        {/* FACE LOGIN */}
                        {/* ================================================= */}

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
                                    Login with Face ID
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


                        {/* ================================================= */}
                        {/* REGISTER */}
                        {/* ================================================= */}

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


            {/* ================================================= */}
            {/* FACE AUTH POPUP */}
            {/* ================================================= */}

            {showFaceAuth && (
                <FaceAuth
                    onFaceDetected={handleFaceDetected}
                    onClose={() => setShowFaceAuth(false)}
                />
            )}

        </div>
    );
}