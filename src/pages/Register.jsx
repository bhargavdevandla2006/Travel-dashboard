import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom'


export default function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3000/register",
                {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            )
            const receivedData = await response.json();

            localStorage.setItem(
                "token",
                receivedData.token
            )
            navigate('/')
        } catch (error) {
            alert("Invalid Brooo")
        }
    };

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">

            <form
                onSubmit={handleRegister}
                className="bg-white p-10 rounded-3xl shadow-2xl w-[400px]"
            >

                <h1 className="text-5xl font-bold text-center mb-3">
                    Create Account
                </h1>

                <p className="text-center text-gray-500 mb-8">

                    Register to continue
                </p>
                <input
                    type="text"
                    placeholder="Enter Name"
                    className="w-full border p-4 rounded-2xl mb-5 outline-none"
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            name: e.target.value,
                        })
                    }
                />

                <input
                    type="email"
                    placeholder="Enter Email"
                    className="w-full border p-4 rounded-2xl mb-5 outline-none"
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            email: e.target.value,
                        })
                    }
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    className="w-full border p-4 rounded-2xl mb-5 outline-none"
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            password: e.target.value,
                        })
                    }
                />

                <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition">
                    Register
                </button>

                <p className="text-center mt-6">

                    Already have account?

                    <Link
                        to="/login"
                        className="text-blue-600 font-bold ml-2"
                    >
                        Login
                    </Link>

                </p>

            </form>

        </div>
    );



};