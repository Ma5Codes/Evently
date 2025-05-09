import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import EventSlider from "./EventSlider";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function IndexPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(null); // Stores the eventId being liked
  const [deleting, setDeleting] = useState(null); // Stores the eventId being deleted

  const currentUser = "john_doe"; // Replace this with actual authenticated username

  useEffect(() => {
    axios
      .get("/createEvent")
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error("Failed to fetch events.");
        setLoading(false);
        console.error("Error fetching events:", error);
      });
  }, []);

  const handleLike = (eventId) => {
    if (liking === eventId) return; // Prevent spam

    setLiking(eventId);
    axios
      .post(`/event/${eventId}`)
      .then((response) => {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId
              ? { ...event, likes: event.likes + 1 }
              : event
          )
        );
        toast.success("You liked this event!");
      })
      .catch((error) => {
        toast.error("Error liking the event.");
        console.error("Error liking:", error);
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
        .then((response) => {
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event._id !== eventId)
          );
          toast.success("Event deleted successfully.");
        })
        .catch((error) => {
          toast.error("Failed to delete the event.");
          console.error("Error deleting event:", error);
        })
        .finally(() => {
          setDeleting(null);
        });
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="mt-1 flex flex-col">
        <div className="hidden sm:block">
          <EventSlider events={events} />
        </div>

        {loading ? (
          <div className="text-center text-xl font-semibold text-gray-600 mt-10">
            Loading events...
          </div>
        ) : (
          <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
            {events.length > 0 ? (
              events.map((event) => {
                const eventDate = new Date(event.eventDate);
                const currentDate = new Date();

                if (
                  eventDate > currentDate ||
                  eventDate.toDateString() === currentDate.toDateString()
                ) {
                  return (
                    <div className="bg-white rounded-xl shadow-md" key={event._id}>
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
                        {event.owner?.toLowerCase() === currentUser.toLowerCase() && (
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
                    </div>
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
        )}
      </div>
    </>
  );
}

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { BsArrowRightShort } from "react-icons/bs";
// import { BiLike } from "react-icons/bi";
// import EventSlider from "./EventSlider"; // Import the EventSlider component

// export default function IndexPage() {
//   const [events, setEvents] = useState([]);

//   //! Fetch events from the server ---------------------------------------------------------------
//   useEffect(() => {
//     axios
//       .get("/createEvent")
//       .then((response) => {
//         setEvents(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching events:", error);
//       });
//   }, []);

//   //! Like Functionality --------------------------------------------------------------
//   const handleLike = (eventId) => {
//     axios
//       .post(`/event/${eventId}`)
//       .then((response) => {
//         setEvents((prevEvents) =>
//           prevEvents.map((event) =>
//             event._id === eventId
//               ? { ...event, likes: event.likes + 1 }
//               : event
//           )
//         );
//         console.log("done", response);
//       })
//       .catch((error) => {
//         console.error("Error liking ", error);
//       });
//   };

//   // Delete Functionality ---------------------------------------------------------------
//   const handleDelete = (eventId) => {
//     // Confirm before deleting
//     if (window.confirm("Are you sure you want to delete this event?")) {
//       axios
//         .delete(`/event/${eventId}`)
//         .then((response) => {
//           // Update local state to reflect deletion
//           setEvents((prevEvents) =>
//             prevEvents.filter((event) => event._id !== eventId)
//           );
//           console.log("Event deleted successfully:", response);
//         })
//         .catch((error) => {
//           console.error("Error deleting event:", error);
//           alert("Failed to delete the event. Please try again.");
//         });
//     }
//   };

//   return (
//     <>
//       <div className="mt-1 flex flex-col">
//         <div className="hidden sm:block">
//           {/* Replace the video with the EventSlider component */}
//           <EventSlider events={events} />
//         </div>

//         <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
//           {/* Checking whether there are events or not */}
//           {events.length > 0 &&
//             events.map((event) => {
//               const eventDate = new Date(event.eventDate);
//               const currentDate = new Date();

//               //! Check the event date is passed or not
//               if (eventDate > currentDate || eventDate.toDateString() === currentDate.toDateString()) {
//                 return (
//                   <div className="bg-white rounded-xl relative" key={event._id}>
//                     <div className="rounded-tl-[0.75rem] rounded-tr-[0.75rem] rounded-br-[0] rounded-bl-[0] object-fill aspect-16:9">
//                       {event.image && (
//                         <div className="event-card-image-container">
//                           <img
//                             src={`http://localhost:4000/${event.image.replace("\\", "/")}`}
//                             alt={event.title}
//                             className="event-image"
//                           />
//                         </div>
//                       )}
//                     </div>
//                     <div className="m-2 grid gap-2">
//                       <div className="flex justify-between items-center">
//                         <h1 className="font-bold text-lg mt-2">{event.title ? event.title.toUpperCase() : "Untitled Event"}</h1>
//                         <div className="flex gap-2 items-center mr-4 text-red-600">
//                           <BiLike /> {event.likes}
//                         </div>

//                         <button onClick={() => handleLike(event._id)}>
//                   <BiLike className="w-auto h-12 lg:h-10 sm:h-12 md:h-10 bg-white p-2 rounded-full shadow-md transition-all hover:text-primary" />
//                 </button>
//                       </div>

//                       <div className="flex text-sm flex-nowrap justify-between text-primarydark font-bold mr-4">
//                         <div>{event.eventDate.split("T")[0]}, {event.eventTime}</div>
//                         <div>{event.ticketPrice === 0 ? "Free" : "Rs. " + event.ticketPrice}</div>
//                       </div>

//                       <div className="text-xs flex flex-col flex-wrap truncate-text">{event.description}</div>
//                       <div className="flex justify-between items-center my-2 mr-4">
//                         <div className="text-sm text-primarydark">
//                           Organized By: <br />
//                           <span className="font-bold">{event.organizedBy}</span>
//                         </div>
//                         <div className="text-sm text-primarydark">
//                           Created By: <br />
//                           <span className="font-semibold">{event.owner ? event.owner.toUpperCase() : "Unknown Owner"}</span>

//                         </div>
//                       </div>

//                       <Link to={"/event/" + event._id} className="flex justify-center">
//                         <button className="primary flex items-center gap-2">
//                           Register <BsArrowRightShort className="w-6 h-6" />
//                         </button>
//                       </Link>
//                       <button onClick={() => handleDelete(event._id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all">
//                         Delete
//                       </button>
//                     </div>
//                   </div>
//                 );
//               }
//               return null;
//             })}
//         </div>
//       </div>
//     </>
//   );
// }
