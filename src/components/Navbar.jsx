
import { FaBell, FaSearch } from "react-icons/fa";

export default function Navbar({search, setSearch}) {
 

const handleClick = () => {
  alert(`Searching for: ${search}`);
};
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-black">Travel Dashboard</h1>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition w-[260px] border border-gray-100">
          <button onClick={handleClick}>
            <FaSearch className="text-gray-400 text-lg cursor-pointer" />
          </button>
          
          <input type="text" placeholder="Search destinations..." value = {search} onChange={(e) => setSearch(e.target.value)} className="outline-none w-full bg-white text-gray-900 placeholder-gray-500 font-medium" />
        </div>

        <button className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition text-base hover:bg-gray-50">
          <FaBell className="text-gray-500 " />
        </button>

        <img src="https://i.pravatar.cc/50" alt="" className="w-10 h-10 rounded-full object-cover shadow-lg hover:shadow-xl transition hover:scale-110" />
      </div>
    </div>
  );
}