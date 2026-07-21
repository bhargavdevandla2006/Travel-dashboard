import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Travelers() {

    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {

        try {

            const response = await fetch(
                "http://localhost:3000/users")
            

            const data = await response.json();

            setUsers(data);

        } catch (err) {

            console.log(err);

        }

    }

    return (

        <div className="bg-[#020B2D] min-h-screen p-6">

            <div className="bg-[#F5F5F5] rounded-[40px] overflow-hidden flex">

                <Sidebar />

                <div className="flex-1 p-10">

                    <Navbar />

                    <h1 className="text-5xl font-bold mt-10">
                         Travel Community
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Discover amazing travelers around the world.
                    </p>

                    <div className="grid grid-cols-3 gap-8 mt-12">

                        {
                            users.map((user) => (

                                <div
                                    key={user.id}
                                    onClick={() => navigate(`/traveler/${user.id}`)}
                                    className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition cursor-pointer overflow-hidden hover:scale-105"
                                >

                                    <img
                                        src={user.photo}
                                        alt=""
                                        className="w-full h-60 object-cover"
                                    />

                                    <div className="p-6">

                                        <h1 className="text-2xl font-bold">
                                            {user.name}
                                        </h1>

                                        <p className="text-gray-500 mt-2">
                                             {user.city}, {user.country}
                                        </p>

                                        <button
                                            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-2xl hover:bg-blue-700"
                                        >
                                            View Profile
                                        </button>

                                    </div>

                                </div>

                            ))
                        }

                    </div>

                </div>

            </div>

        </div>

    );

}