
import { FaBell, FaSearch } from "react-icons/fa";

export default function Navbar({search, setSearch}) {
 

const handleClick = () => {
  alert(`Searching for: ${search}`);
};
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-5xl font-black text-black">Travel Dashboard</h1>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition w-[320px] border border-gray-100">
          <button onClick={handleClick}>
            <FaSearch className="text-gray-400 text-lg cursor-pointer" />
          </button>
          
          <input type="text" placeholder="Search destinations..." value = {search} onChange={(e) => setSearch(e.target.value)} className="outline-none w-full bg-white text-gray-900 placeholder-gray-500 font-medium" />
        </div>

        <button className="bg-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition text-lg hover:bg-gray-50">
          <FaBell className="text-gray-500 " />
        </button>

        <img src="https://i.pravatar.cc/50" alt="" className="w-14 h-14 rounded-full object-cover shadow-lg hover:shadow-xl transition hover:scale-110" />
      </div>
    </div>
  );
}