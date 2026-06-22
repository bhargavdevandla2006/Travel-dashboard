import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTrip() {
  const navigate = useNavigate();

  const [destination ,  setDestination]= useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try{
      setLoading(true)

      const wiki = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${destination}`

      )
      const wikiData = await wiki.json();
         const tripData = {
        title: wikiData.title || destination,
        location: destination,
        price: Math.floor(Math.random() * 5000) + 500,
        image:
          wikiData.thumbnail?.source ||
          "https://via.placeholder.com/400x250",
      };
      console.log(tripData);
      await fetch(
        "https://travel-dashboard-backend-2.onrender.com/trips",
        {
          method:"post",
          headers:{
            "Content-type" : "application/json", 
          },
          body: JSON.stringify(tripData),
        }
      )

      alert("Trip added succesfully");
      navigate('/trips')

    }catch(error){
      alert("cant fetch destinations details")
    }finally{
      setLoading(false)
    }
  };

  
 return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-10"
    >
      <input
        type="text"
        placeholder="Enter Destination (Ex: Charminar)"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="border p-3 rounded-xl"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white p-3 rounded-xl"
      >
        {loading ? "Generating..." : "Generate Trip"}
      </button>
    </form>
  );
}