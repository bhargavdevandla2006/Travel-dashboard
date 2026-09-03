import { useState } from "react";
import FaceAuth from "../components/FaceAuth";
import { faceLogin, loginUser } from "../services/api";
import { getBrowserId } from "../utils/browserAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showFaceAuth, setShowFaceAuth] = useState(false);

    const handleFaceLogin = async (faceDescriptor) => {
        try {
            setLoading(true);
            await faceLogin({
                email: email.trim(),
                faceDescriptor,
                browserId: getBrowserId(),
            });
            navigate("/");
        } catch (error) {
            alert(error.message || "Face login failed");
        } finally {
            setLoading(false);
            setShowFaceAuth(false);
        }
    };

    const handleOpenFaceLogin = (e) => {
        e.preventDefault();

        if (!email.trim()) {
            alert("Enter your registered email before using Face ID");
            return;
        }

        setShowFaceAuth(true);
    };

    const handlePasswordLogin = async (e) => {
        e.preventDefault();

        if (!email.trim() || !password) {
            alert("Please enter your email and password");
            return;
        }

        try {
            setLoading(true);
            await loginUser({ email, password });
            navigate("/");
        } catch (error) {
            alert(error.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black-50 flex items-center justify-center p-6 relative overflow-hidden">
            
            
            

            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                

                <div className="absolute top-20 left-[15%] w-4 h-4 bg-blue-500 rounded-full animate-bounce opacity-70"></div>

                <div className="absolute top-40 right-[18%] w-3 h-3 bg-indigo-400 rounded-full animate-pulse opacity-70"></div>

                <div className="absolute bottom-32 left-[20%] w-5 h-5 bg-blue-300 rounded-full animate-ping opacity-40"></div>

                <div className="absolute bottom-20 right-[20%] w-4 h-4 bg-purple-400 rounded-full animate-bounce opacity-50"></div>


                

                <div className="absolute -top-20 -left-20 w-72 h-72 border border-blue-100 rounded-full"></div>

                <div className="absolute -bottom-32 -right-20 w-96 h-96 border border-indigo-100 rounded-full"></div>


                

                <div className="absolute top-24 left-0 w-72 h-[2px] bg-gradient-to-r from-transparent via-blue-300 to-transparent animate-pulse"></div>

                <div className="absolute bottom-32 right-0 w-72 h-[2px] bg-gradient-to-r from-transparent via-indigo-300 to-transparent animate-pulse"></div>

            </div>


            
            
            

            <div className="relative w-full max-w-md">

                

                <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 rounded-[35px] blur-xl opacity-40"></div>


                <div className="relative bg-white rounded-[32px] shadow-2xl border border-white p-8 sm:p-10">


                    
                    
                    

                    <div className="flex justify-center mb-6">

                        <div className="relative">

                            

                            <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-blue-200 animate-ping opacity-30"></div>

                            

                            <div className="relative w-24 h-24 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shadow-lg">

                                <div className="text-4xl">
                                    👤
                                </div>

                            </div>

                        </div>

                    </div>


                    
                    
                    

                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 text-center tracking-tight">
                        Welcome Back 👋
                    </h1>

                    <p className="text-center text-slate-500 mt-3 mb-8">
                        Login to continue to your account
                    </p>


                    
                    
                    

                    <form onSubmit={handlePasswordLogin}>
                        <div className="relative mb-4">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl">
                                ✉
                            </div>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                required
                                autoComplete="email"
                                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white text-slate-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-sm"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="relative mb-5">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 text-xl">
                                🔒
                            </div>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                required
                                autoComplete="current-password"
                                className="w-full h-14 pl-12 pr-4 rounded-2xl border border-slate-200 bg-white text-slate-800 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-sm"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 hover:-translate-y-1 active:translate-y-0 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-slate-400">
                            <span className="h-px flex-1 bg-slate-200" />
                            <span>or</span>
                            <span className="h-px flex-1 bg-slate-200" />
                        </div>

                        <button
                            type="button"
                            onClick={handleOpenFaceLogin}
                            disabled={loading}
                            className="group w-full h-14 rounded-2xl border-2 border-blue-600 text-blue-700 font-bold text-lg hover:bg-blue-50 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Login with Face ID
                        </button>

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

            {showFaceAuth && (
                <FaceAuth
                    onFaceDetected={handleFaceLogin}
                    onClose={() => setShowFaceAuth(false)}
                />
            )}

        </div>
    );
}