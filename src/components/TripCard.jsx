import { useNavigate } from "react-router-dom";

export default function TripCard({ image, title, location, price }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition">

      <img src={image} className="h-44 w-full object-cover" />

      <div className="p-6">

        <h1 className="text-lg font-bold">{title}</h1>

        <p className="text-sm text-gray-600">{location}</p>

        <h2 className="text-xl text-blue-600 font-bold mt-2">
          {price}
        </h2>

        <button
          onClick={() =>
            navigate(`/trip/${title}`, {
              state: {
                title,
                location,
                price,
                image,
              },
            })
          }
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          Book Now
        </button>

      </div>
    </div>
  );
}