export default function StatsCard({ title, value, color, icon }) {
  return (
    <div className="bg-white rounded-3xl p-6 flex items-center gap-5 shadow-md hover:shadow-xl transition transform hover:scale-105">
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white text-3xl flex-shrink-0 ${color} shadow-lg`}>
        {icon}
      </div>

      <div>
        <p className="text-xs tracking-[3px] text-gray-500 uppercase font-bold">{title}</p>
        <h1 className="text-4xl font-bold text-gray-900 mt-2">{value}</h1>
      </div>
    </div>
  );
}