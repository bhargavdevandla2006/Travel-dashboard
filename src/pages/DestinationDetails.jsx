import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function DestinationDetails() {
const {id} = useParams();
const [destination,  setDestination]= useState(null);
const [weather, setWeather] = useState(null);

 useEffect(() =>{
    loadDestination();
 }, [])

const loadDestination = async () => {
  try{
    const response = await fetch(`http://localhost:3000/destinations/${id}`)
    const data =  await response.json();
    setDestination(data)
    loadWeather(data.name);
  }catch (err) {
   console.log(err)
  }
  
}
const loadWeather = async (city) =>{
try{
    const apiKey =  import.meta.env.VITE_WEATHER_API_KEY;
    const response = await fetch( `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
    const data = await response.json();

    setWeather(data);
}catch(err){
    console.log(err)
}
} 
if(!destination) return<h1>Loading ...</h1>

 return (

    <div className="min-h-screen bg-gray-100">

      <img
        src={destination.image}
        className="w-full h-[450px] object-cover"
      />

      <div className="max-w-6xl mx-auto p-10">

        <h1 className="text-5xl font-bold">
          {destination.name}
        </h1>

        <p className="text-xl text-gray-500 mt-2">
          {destination.country}
        </p>

        <div className="grid grid-cols-3 gap-8 mt-10">

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="font-bold text-2xl mb-5">

              🌤 Live Weather

            </h2>

            {

              weather && (

                <>

                  <p>🌡 Temperature : {weather.main.temp}°C</p>

                  <p className="mt-3">

                    🤒 Feels Like : {weather.main.feels_like}°C

                  </p>

                  <p className="mt-3">

                    💧 Humidity : {weather.main.humidity}%

                  </p>

                  <p className="mt-3">

                    🌬 Wind : {weather.wind.speed} m/s

                  </p>

                  <p className="mt-3">

                    ☁ Condition : {weather.weather[0].main}

                  </p>

                </>

              )

            }

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold">

              📅 Best Time

            </h2>

            <p className="mt-4">

              April - October

            </p>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-2xl font-bold">

              💰 Budget

            </h2>

            <p className="mt-4">

              ₹40,000 - ₹70,000

            </p>

          </div>

        </div>

      </div>

    </div>

  );
}