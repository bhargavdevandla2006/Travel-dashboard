export default function StatsCard({
    title,
    value,
    icon,
    color
}) {

    return (

        <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition duration-300">

            <div className="flex justify-between items-center">

                <div>

                    <p className="text-gray-500 text-sm">
                        {title}
                    </p>

                    <h1 className="text-4xl font-bold mt-2">
                        {value}
                    </h1>

                </div>

                <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl ${color}`}
                >
                    {icon}
                </div>

            </div>

        </div>

    );

}