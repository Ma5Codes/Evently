import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
} from "date-fns";
import { useEffect, useState } from "react";
import { BsCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get("/events")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const firstDayOfWeek = firstDayOfMonth.getDay();
  const currentDate = new Date();

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const eventDate = format(new Date(event.eventDate), "yyyy-MM-dd");
    if (!acc[eventDate]) acc[eventDate] = [];
    acc[eventDate].push(event);
    return acc;
  }, {});

  return (
    <div className="p-4 md:mx-24 lg:mx-32 xl:mx-40">
      <div className="rounded-lg shadow-md bg-gray-50 p-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-center gap-8 mb-6">
          <button
            className="primary hover:bg-blue-600 transition duration-300 p-2 rounded-md"
            onClick={() =>
              setCurrentMonth((prevMonth) => addMonths(prevMonth, -1))
            }
          >
            <BsCaretLeftFill className="w-6 h-6" />
          </button>
          <span className="text-3xl font-bold text-gray-700">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            className="primary hover:bg-blue-600 transition duration-300 p-2 rounded-md"
            onClick={() =>
              setCurrentMonth((prevMonth) => addMonths(prevMonth, 1))
            }
          >
            <BsFillCaretRightFill className="w-6 h-6" />
          </button>
        </div>

        {/* Week Header */}
        <div className="grid grid-cols-7 text-center">
          {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day) => (
            <div
              key={day}
              className="p-4 font-bold bg-gray-200 text-gray-800 uppercase tracking-wide text-sm"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty grid spaces before the first day */}
          {Array.from({ length: firstDayOfWeek }, (_, index) => (
            <div key={`empty-${index}`} className="p-4 bg-gray-100" />
          ))}

          {/* Actual Dates */}
          {daysInMonth.map((date) => {
            const formattedDate = format(date, "yyyy-MM-dd");
            const isToday =
              format(date, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd");
            const dayEvents = eventsByDate[formattedDate] || [];

            return (
              <div
                key={date.toISOString()}
                className={`group relative p-4 rounded border min-h-[140px] flex flex-col items-start justify-start shadow-inner
                ${
                  isToday
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white border-gray-300 hover:bg-gray-100 transition"
                }`}
              >
                {/* Date Number */}
                <div className="font-semibold text-gray-700 mb-2 text-lg">
                  {format(date, "dd")}
                </div>

                {/* Event Count Badge */}
                {dayEvents.length > 0 && (
                  <span className="absolute top-2 right-2 text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    {dayEvents.length}
                  </span>
                )}

                {/* Events */}
                <div className="space-y-1 overflow-y-auto max-h-[100px] w-full">
                  {dayEvents.map((event) => (
                    <Link
                      key={event._id}
                      to={`/event/${event._id}`}
                      className={`text-white ${
                        event.color
                          ? event.color
                          : "bg-blue-500"
                      } hover:brightness-110 transition rounded px-2 py-1 text-xs font-medium block truncate`}
                      title={event.title}
                    >
                      {event.title.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// import axios from "axios";
// import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isBefore } from "date-fns";
// import { useEffect, useState } from "react";
// import { BsCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
// import { Link } from "react-router-dom";

// export default function CalendarView() {
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [events, setEvents] = useState([]);
  
//   //! Fetch events from the server
//   useEffect(() => {
//     axios
//       .get("/events")
//       .then((response) => {
//         setEvents(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching events:", error);
//       });
//   }, []);

//   const firstDayOfMonth = startOfMonth(currentMonth);
//   const lastDayOfMonth = endOfMonth(currentMonth);
//   const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

//   const firstDayOfWeek = firstDayOfMonth.getDay();

//   const currentDate = new Date();

//   // Mapping events by date for quick lookup
//   const eventsByDate = events.reduce((acc, event) => {
//     const eventDate = format(new Date(event.eventDate), "yyyy-MM-dd");
//     if (!acc[eventDate]) acc[eventDate] = [];
//     acc[eventDate].push(event);
//     return acc;
//   }, {});

//   return (
//     <div className="p-8 md:mx-24 lg:mx-32 xl:mx-40">
//       <div className="rounded-lg shadow-md bg-gray-50 p-6">
//         <div className="flex items-center mb-6 justify-center gap-8">
//           <button
//             className="primary hover:bg-blue-600 transition duration-300"
//             onClick={() => setCurrentMonth((prevMonth) => addMonths(prevMonth, -1))}
//           >
//             <BsCaretLeftFill className="w-6 h-6" />
//           </button>
//           <span className="text-3xl font-bold text-gray-700">{format(currentMonth, "MMMM yyyy")}</span>
//           <button
//             className="primary hover:bg-blue-600 transition duration-300"
//             onClick={() => setCurrentMonth((prevMonth) => addMonths(prevMonth, 1))}
//           >
//             <BsFillCaretRightFill className="w-6 h-6" />
//           </button>
//         </div>

//         <div className="grid grid-cols-7 text-center">
//           {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day) => (
//             <div key={day} className="p-4 font-bold bg-gray-200 text-gray-800 uppercase tracking-wide">
//               {day}
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-7 gap-2">
//           {/* Empty Cells to Align Days */}
//           {Array.from({ length: firstDayOfWeek }, (_, index) => (
//             <div key={`empty-${index}`} className="p-4 bg-gray-100"></div>
//           ))}

//           {/* Days and Events */}
//           {daysInMonth.map((date) => {
//             const formattedDate = format(date, "yyyy-MM-dd");
//             const isToday = isBefore(date, currentDate) && format(date, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd");

//             return (
//               <div
//                 key={date.toISOString()}
//                 className={`p-6 relative bg-white shadow-inner rounded border border-gray-300 flex flex-col items-start justify-start min-w-[140px] w-auto
//                 ${isToday ? 'bg-blue-100 border-blue-500' : ''}`}
//               >
//                 <div className="font-semibold text-gray-700 mb-2 text-lg">{format(date, "dd")}</div>

//                 <div className="absolute top-12 left-2 space-y-1 overflow-y-auto max-h-[100px]">
//                   {eventsByDate[formattedDate]?.map((event) => (
//                     <Link
//                       key={event._id}
//                       to={`/event/${event._id}`}
//                       className="text-white bg-blue-500 hover:bg-blue-600 transition duration-300 rounded px-3 py-1 text-xs font-medium block truncate"
//                       aria-label={`View event: ${event.title}`}
//                     >
//                       {event.title.toUpperCase()}
//                     </Link>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }
