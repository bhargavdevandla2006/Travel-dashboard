export default function StatsCard({ title, value, color, icon }) {
  return (
    <div className="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-md hover:shadow-xl transition transform hover:scale-105">
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white text-2xl flex-shrink-0 ${color} shadow-lg`}>
        {icon}
      </div>

      <div>
        <p className="text-[11px] tracking-[2px] text-gray-500 uppercase font-bold">{title}</p>
        <h1 className="text-3xl font-bold text-gray-900 mt-2">{value}</h1>
      </div>
    </div>
  );
}


