export default function TripCard({ image, title, location, price }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition transform hover:scale-105 hover:-translate-y-2">
      <img src={image} alt={title} className="h-44 w-full object-cover hover:scale-110 transition duration-300" />

      <div className="p-6">
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>

        <p className="text-sm text-gray-600 mt-2 flex items-center gap-1"> {location}</p>

        <h2 className="text-xl text-blue-600 font-bold mt-4">{price}</h2>

        <button className="w-full bg-blue-600 text-white py-3 rounded-xl mt-5 text-sm font-bold hover:bg-blue-700 hover:shadow-lg transition transform hover:scale-105">
          Book Now
        </button>
      </div>
    </div>
  );
}