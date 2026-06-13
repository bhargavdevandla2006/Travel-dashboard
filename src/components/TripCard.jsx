import { useNavigate } from "react-router-dom";

export default function TripCard({ image, title, location, price }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition">

      <img src={image} className="h-28 w-full object-cover" />

     <div className="p-4">

  <h2 className="text-xl font-bold text-gray-900">
    {title}
  </h2>

  <p className="text-base font-semibold text-gray-600 mt-1">
    {location}
  </p>

  <h2 className="text-lg text-blue-600 font-bold mt-2">
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
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-2xl text-sm"
        >
          Book Now
        </button>

      </div>
    </div>
  );
}