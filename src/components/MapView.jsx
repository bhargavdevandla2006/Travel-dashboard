import { useMap } from "../context/MapContext";

export default function MapView() {

  const { location } = useMap();

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold mb-4">
        Live Location: {location.name}
      </h2>

      <iframe
        title="Map"
        className="w-full h-[400px] rounded-3xl shadow-lg"
        src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=8&output=embed`}
      />
    </div>
  );
}