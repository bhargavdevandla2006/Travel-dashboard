import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import apiUrl from "../services/api";


export default function Travelers() {

    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {

        try {

            const response = await fetch(`${apiUrl}/users`, {
                credentials: "include",
            });


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

                    <h1 className="text-2xl font-bold mt-10">
                        Travel Community
                    </h1>

                    <p className="text-gray-500 mt-2 text-xs">
                        Discover amazing travelers around the world.
                    </p>

                    <div className="grid grid-cols-3 gap-6 mt-8">

                        {
                            users.map((user) => (

                                <div
                                    key={user.id}
                                    onClick={() => navigate(`/traveler/${user.id}`)}
                                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition cursor-pointer overflow-hidden hover:scale-105"
                                >

                                    <img
                                        src={user.photo}
                                        alt=""
                                        className="w-full h-48 object-cover"
                                    />

                                    <div className="p-4">

                                        <h2 className="text-lg font-bold">
                                            {user.name}
                                        </h2>

                                        <p className="text-gray-500 mt-1 text-xs">
                                            {user.city}, {user.country}
                                        </p>

                                        <button
                                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm"
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