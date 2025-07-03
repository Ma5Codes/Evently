import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
} from "date-fns";
import { useContext, useEffect, useState } from "react";
import { BsCaretLeftFill, BsFillCaretRightFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const DAYS_PER_PAGE = 35; // 5 weeks

export default function CalendarView() {
  const { user, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError(null);
    axios
      .get("/createEvent")
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch events.");
        setLoading(false);
        toast.error("Failed to fetch events.");
      });
  }, [user, userLoading, navigate]);

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  // Pagination for days (weeks)
  const totalPages = Math.ceil(daysInMonth.length / DAYS_PER_PAGE);
  const startIdx = (page - 1) * DAYS_PER_PAGE;
  const paginatedDays = daysInMonth.slice(startIdx, startIdx + DAYS_PER_PAGE);

  const firstDayOfWeek = firstDayOfMonth.getDay();
  const currentDate = new Date();

  // Group events by date
  const eventsByDate = events.reduce((acc, event) => {
    const eventDate = format(new Date(event.eventDate), "yyyy-MM-dd");
    if (!acc[eventDate]) acc[eventDate] = [];
    acc[eventDate].push(event);
    return acc;
  }, {});

  if (userLoading || loading) return <Loader count={7} />;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="p-4 md:mx-24 lg:mx-32 xl:mx-40">
      <div className="rounded-lg shadow-md bg-gray-50 p-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-center gap-8 mb-6">
          <button
            className="primary hover:bg-blue-600 transition duration-300 p-2 rounded-md"
            onClick={() => setCurrentMonth((prevMonth) => addMonths(prevMonth, -1))}
            aria-label="Previous Month"
          >
            <BsCaretLeftFill className="w-6 h-6" />
          </button>
          <span className="text-3xl font-bold text-gray-700">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          <button
            className="primary hover:bg-blue-600 transition duration-300 p-2 rounded-md"
            onClick={() => setCurrentMonth((prevMonth) => addMonths(prevMonth, 1))}
            aria-label="Next Month"
          >
            <BsFillCaretRightFill className="w-6 h-6" />
          </button>
        </div>
        {/* Pagination Controls for weeks */}
        {totalPages > 1 && (
          <div className="flex justify-center mb-4 gap-2">
            <button
              className="px-3 py-1 rounded border"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous Week"
            >
              Previous
            </button>
            <span className="px-3 py-1">Page {page} of {totalPages}</span>
            <button
              className="px-3 py-1 rounded border"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next Week"
            >
              Next
            </button>
          </div>
        )}
        {/* Week Header */}
        <div className="grid grid-cols-7 text-center" role="row">
          {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day) => (
            <div
              key={day}
              className="p-4 font-bold bg-gray-200 text-gray-800 uppercase tracking-wide text-sm"
              role="columnheader"
              aria-label={day}
            >
              {day}
            </div>
          ))}
        </div>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2" role="rowgroup">
          {/* Empty grid spaces before the first day */}
          {Array.from({ length: firstDayOfWeek }, (_, index) => (
            <div key={`empty-${index}`} className="p-4 bg-gray-100" aria-hidden="true" />
          ))}
          {/* Actual Dates */}
          {paginatedDays.map((date) => {
            const formattedDate = format(date, "yyyy-MM-dd");
            const isToday =
              format(date, "yyyy-MM-dd") === format(currentDate, "yyyy-MM-dd");
            const dayEvents = eventsByDate[formattedDate] || [];
            return (
              <div
                key={date.toISOString()}
                className={`group relative p-4 rounded border min-h-[140px] flex flex-col items-start justify-start shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isToday
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white border-gray-300 hover:bg-gray-100 transition"
                }`}
                tabIndex={0}
                role="gridcell"
                aria-label={`Day ${format(date, "dd")}, ${dayEvents.length} event${dayEvents.length !== 1 ? 's' : ''}`}
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
                      className={`text-white ${/^bg-/.test(event.color) ? event.color : "bg-blue-500"} hover:brightness-110 transition rounded px-2 py-1 text-xs font-medium block truncate`}
                      title={event.title}
                      tabIndex={0}
                      aria-label={event.title}
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
