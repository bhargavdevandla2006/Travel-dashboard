export default function DestinationCard({ image, place }) {
  return (
    <div className="relative rounded-2xl overflow-hidden h-32 group cursor-pointer shadow-md hover:shadow-xl transition">
      <img src={image} alt={place} className="h-full w-full object-cover group-hover:scale-110 transition duration-500" />
      
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition"></div>

      <div className="absolute bottom-4 left-4">
        <h1 className="text-base font-bold text-white drop-shadow-lg">{place}</h1>
      </div>
    </div>
  );
}