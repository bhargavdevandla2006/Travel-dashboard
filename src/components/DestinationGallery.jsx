import { useEffect,useState } from "react";

export default function DestinationGallery({place}) {
const [photos, setPhotos] = useState([]);

useEffect(() =>{
    fetchPhots();
}, [place]);

const fetchPhots = async () =>{
    try{
        const response  = await fetch(`https://api.pexels.com/v1/search?query=${place}&per_page=6`,
            {
            header :{
                Authorization:import.meta.env.VITE_PEXELS_API_KEY,
            },
        }
    )

    const data = await response.json();
    setPhotos(data.photos);
    }catch(error){
        console.log(error)
    }

};
 return (
    <div className="mt-12">

      <h1 className="text-3xl font-bold mb-6">
        Destination Gallery
      </h1>

      <div className="grid grid-cols-3 gap-4">

        {photos.map((photo) => (
          <img
            key={photo.id}
            src={photo.src.large}
            alt={place}
            className="h-60 w-full object-cover rounded-3xl"
          />
        ))}

      </div>

    </div>
  );
}
