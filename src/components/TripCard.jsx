import { useNavigate } from "react-router-dom";

export default function TripCard({ image, title, location, price, }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition">

      <img src={image} className="h-24 w-full object-cover" />

      <div className="p-3">

        <h2 className="text-lg font-bold text-black-900">
          {title}
        </h2>

        <p className="text-sm font-semibold text-gray-600 mt-1">
          {location}
        </p>

        <h2 className="text-base text-blue-600 font-bold mt-2">
          ₹{price}
        </h2>
    <div className="flex flex-wrap gap-2 mt-3">
        <button onClick={() => navigate(`/hotels/${location}`)}
          className="bg-green-100 text-green-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
        >Hotels</button>

        <button onClick={() => navigate(`/transport/${location}`)} className="bg-orange-100 text-orange-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold">Transport</button>

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
          className="mt-3 bg-blue-600 text-white px-3 py-1.5 rounded-xl text-xs"
        >
          Book Now
        </button>
</div>
      </div>
    </div>
  );
}