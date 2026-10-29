export default function StatsCard({
  title,
  value,
  icon,
  color,
}) {

  return (

    <div
      className="
      bg-white
      dark:bg-gray-900

      border
      border-gray-200
      dark:border-gray-700

      rounded-3xl

      p-5

      shadow-md
      hover:shadow-xl

      transition-all
      duration-300

      group
      "
    >

      <div className="flex items-center justify-between">


        <div>

          <p
            className="
            text-gray-500
            dark:text-gray-400

            text-sm
            font-medium
            "
          >
            {title}
          </p>



          <h2
            className="
            text-3xl
            font-extrabold
            mt-3

            text-gray-900
            dark:text-white
            "
          >
            {value}
          </h2>



          <div className="flex items-center gap-2 mt-4">


            <span
              className="
              text-green-600
              dark:text-green-400

              text-sm
              font-bold
              "
            >
              ↑ 12%
            </span>


            <span
              className="
              text-gray-400
              dark:text-gray-500

              text-sm
              "
            >
              this month
            </span>


          </div>


        </div>



        <div
          className={`
          ${color}

          w-16
          h-16

          rounded-2xl

          flex
          items-center
          justify-center

          text-white

          text-3xl

          shadow-lg

          group-hover:scale-110

          transition-all
          duration-300
          `}
        >

          {icon}

        </div>


      </div>


    </div>

  );

}