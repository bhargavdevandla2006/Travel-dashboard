import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


export default function Destinations() {
  
  const navigate = useNavigate();
  
  const [destinations, setDestinations] = useState([]);
  
  useEffect(()=>{
    loadDestinations();
  }, []);

  async function loadDestinations() {
    try{
      const response = await fetch("http://localhost:3000/destinations")
      const data =  await response.json();
      setDestinations(data);
    } catch (error){
      console.log(error)
    }
  }

  return (

    <div className="bg-[#020B2D] min-h-screen p-6">

      <div className="bg-[#F5F5F5] rounded-[40px] overflow-hidden flex">

        <Sidebar />

        <div className="flex-1 p-12">

          <Navbar />

          <div className="flex justify-between items-center mt-14">

            <div>

              <h1 className="text-6xl font-playfair font-black text-gray-900 tracking-tight">
                Explore Destinations
              </h1>

              <p className="text-gray-600 mt-3 text-lg font-medium">
                Discover your dream vacation spots
              </p>

            </div>

            <button className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl">

              + Add Destination

            </button>

          </div>

          <div className="grid grid-cols-2 gap-10 mt-16">

            {
              destinations.map((place) => (

                <div
                  key={place.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition hover:scale-105"
                >

                  <img
                    src={place.image}
                    alt=""
                    className="h-72 w-full object-cover"
                  />

                  <div className="p-6">

                    <h1 className="text-3xl font-bold">
                      {place.name}
                    </h1>

                    <p className="text-gray-500 mt-2">
                      {place.country}
                    </p>

                    <div className="flex gap-4 mt-6">
                     
                      <button className="bg-blue-600 text-white px-6 py-3 rounded-2xl hover:bg-blue-700 transition" onClick={() => navigate(`/destinations/${place.id}`)}>

                        View Details

                      </button>

                      <button className="bg-gray-200 px-6 py-3 rounded-2xl hover:bg-gray-300 transition">

                        Save 

                      </button>

                    </div>

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