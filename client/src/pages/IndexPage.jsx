import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import EventSlider from "./EventSlider";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../UserContext';
import Loader from '../components/Loader';
import Card from '../components/Card';
import ErrorBoundary from '../components/ErrorBoundary';

const EVENTS_PER_PAGE = 8;

export default function IndexPage() {
  const { user } = useContext(UserContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liking, setLiking] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError(null);
    axios
      .get("/createEvent")
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch events.");
        setLoading(false);
        toast.error("Failed to fetch events.");
      });
  }, []);

  const handleLike = (eventId) => {
    if (liking === eventId) return;
    setLiking(eventId);
    axios
      .post(`/event/${eventId}`)
      .then(() => {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId
              ? { ...event, likes: event.likes + 1 }
              : event
          )
        );
        toast.success("You liked this event!");
      })
      .catch(() => {
        toast.error("Error liking the event.");
      })
      .finally(() => {
        setLiking(null);
      });
  };

  const handleDelete = (eventId) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setDeleting(eventId);
      axios
        .delete(`/event/${eventId}`)
        .then(() => {
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event._id !== eventId)
          );
          toast.success("Event deleted successfully.");
        })
        .catch(() => {
          toast.error("Failed to delete the event.");
        })
        .finally(() => {
          setDeleting(null);
        });
    }
  };

  // Pagination logic
  const startIdx = (page - 1) * EVENTS_PER_PAGE;
  const paginatedEvents = events.slice(startIdx, startIdx + EVENTS_PER_PAGE);
  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE);

  return (
    <ErrorBoundary>
      <ToastContainer position="top-center" />
      <div className="mt-1 flex flex-col">
        <div className="hidden sm:block">
          <EventSlider events={events} />
        </div>
        {loading ? (
          <Loader count={EVENTS_PER_PAGE} />
        ) : error ? (
          <div className="text-center text-red-600 mt-10">{error}</div>
        ) : (
          <>
            <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
              {paginatedEvents.length > 0 ? (
                paginatedEvents.map((event) => {
                  const eventDate = new Date(event.eventDate);
                  const currentDate = new Date();
                  if (
                    eventDate > currentDate ||
                    eventDate.toDateString() === currentDate.toDateString()
                  ) {
                    return (
                      <Card key={event._id}>
                        {/* Image */}
                        {event.image && (
                          <div className="aspect-video overflow-hidden rounded-t-xl">
                            <img
                              src={`http://localhost:4000/${event.image.replace("\\", "/")}`}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        {/* Event Details */}
                        <div className="p-3 grid gap-2">
                          <div className="flex justify-between items-center">
                            <h1 className="font-bold text-lg">
                              {event.title ? event.title.toUpperCase() : "Untitled Event"}
                            </h1>
                            <button
                              className={`flex items-center gap-1 px-2 py-1 text-sm rounded-full ${
                                liking === event._id ? "opacity-50 cursor-not-allowed" : "hover:text-primary"
                              }`}
                              onClick={() => handleLike(event._id)}
                              disabled={liking === event._id}
                            >
                              <BiLike className="text-xl" />
                              <span>{event.likes}</span>
                            </button>
                          </div>
                          <div className="text-sm text-primarydark font-bold flex justify-between">
                            <span>
                              {event.eventDate.split("T")[0]}, {event.eventTime}
                            </span>
                            <span>
                              {event.ticketPrice === 0 ? "Free" : `Rs. ${event.ticketPrice}`}
                            </span>
                          </div>
                          <div className="text-xs line-clamp-3 text-gray-700">{event.description}</div>
                          <div className="flex justify-between text-xs text-primarydark">
                            <div>
                              <span className="font-semibold">Organized by:</span> {event.organizedBy}
                            </div>
                            <div>
                              <span className="font-semibold">Created by:</span> {event.owner?.toUpperCase() || "Unknown"}
                            </div>
                          </div>
                          {/* Register Link */}
                          <Link to={`/event/${event._id}`} className="flex justify-center">
                            <button className="primary flex items-center gap-2 w-full justify-center mt-1">
                              Register <BsArrowRightShort className="w-6 h-6" />
                            </button>
                          </Link>
                          {/* Delete button only if current user is the owner */}
                          {user && event.owner?.toLowerCase() === user.name?.toLowerCase() && (
                            <button
                              onClick={() => handleDelete(event._id)}
                              disabled={deleting === event._id}
                              className={`bg-red-500 text-white px-4 py-2 rounded-md mt-2 transition-all ${
                                deleting === event._id ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
                              }`}
                            >
                              {deleting === event._id ? "Deleting..." : "Delete"}
                            </button>
                          )}
                        </div>
                      </Card>
                    );
                  }
                  return null;
                })
              ) : (
                <div className="text-center col-span-full text-gray-600 font-medium">
                  No upcoming events found.
                </div>
              )}
            </div>
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                <button
                  className="px-3 py-1 rounded border"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span className="px-3 py-1">Page {page} of {totalPages}</span>
                <button
                  className="px-3 py-1 rounded border"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
