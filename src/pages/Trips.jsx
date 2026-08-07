import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TripCard from "../components/TripCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTrips } from "../services/api";


export default function Trips() {


  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);



  useEffect(() => {


    async function loadTrips() {

      try {

        const data = await getTrips();

        setTrips(Array.isArray(data) ? data : []);


      } catch (err) {

        console.error(err);

        setTrips([]);

      }


    }


    loadTrips();


  }, []);




  const tripsBtn = () => {

    navigate("/add-trip");

  };




  return (


    <div
      className="
bg-[#020B2D]
dark:bg-black

min-h-screen

p-6
transition
duration-300
"
    >


      <div
        className="
bg-[#F5F5F5]
dark:bg-gray-900

rounded-[40px]

overflow-hidden

flex

transition
duration-300
"
      >


        <Sidebar />



        <div
          className="
flex-1

p-12
"
        >


          <Navbar />





          <div
            className="
flex
justify-between
items-center

mt-14
"
          >



            <div>


              <h1
                className="
text-3xl

font-playfair
font-bold

text-gray-900
dark:text-white

tracking-tight
"
              >

                Explore Trips

              </h1>




              <p
                className="
text-gray-600
dark:text-gray-300

mt-3

text-lg

font-medium
"
              >

                Discover beautiful destinations around the world

              </p>


            </div>






            <button

              onClick={tripsBtn}

              className="
bg-blue-600

text-white

px-10

py-4

rounded-2xl

font-bold

hover:bg-blue-700

transition

shadow-lg

hover:shadow-xl
"

            >

              + Add New Trip

            </button>




          </div>







          <div
            className="
grid

grid-cols-1
md:grid-cols-2
xl:grid-cols-3

gap-10

mt-16
"
          >


            {


              trips.map((trip) => (


                <TripCard

                  id={trip.id}

                  key={trip.id}

                  title={trip.title}

                  location={trip.location}

                  price={trip.price}

                  image={trip.image}

                />


              ))


            }



          </div>





        </div>


      </div>


    </div>


  );


}