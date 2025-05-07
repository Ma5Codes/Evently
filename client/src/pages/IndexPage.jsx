import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import EventSlider from "./EventSlider"; // Import the EventSlider component

export default function IndexPage() {
  const [events, setEvents] = useState([]);

  //! Fetch events from the server ---------------------------------------------------------------
  useEffect(() => {
    axios
      .get("/createEvent")
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  //! Like Functionality --------------------------------------------------------------
  const handleLike = (eventId) => {
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
        console.log("done", response);
      })
      .catch((error) => {
        console.error("Error liking ", error);
      });
  };

  // Delete Functionality ---------------------------------------------------------------
  const handleDelete = (eventId) => {
    // Confirm before deleting
    if (window.confirm("Are you sure you want to delete this event?")) {
      axios
        .delete(`/event/${eventId}`)
        .then((response) => {
          // Update local state to reflect deletion
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event._id !== eventId)
          );
          console.log("Event deleted successfully:", response);
        })
        .catch((error) => {
          console.error("Error deleting event:", error);
          alert("Failed to delete the event. Please try again.");
        });
    }
  };

  return (
    <>
      <div className="mt-1 flex flex-col">
        <div className="hidden sm:block">
          {/* Replace the video with the EventSlider component */}
          <EventSlider events={events} />
        </div>

        <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
          {/* Checking whether there are events or not */}
          {events.length > 0 &&
            events.map((event) => {
              const eventDate = new Date(event.eventDate);
              const currentDate = new Date();

              //! Check the event date is passed or not
              if (eventDate > currentDate || eventDate.toDateString() === currentDate.toDateString()) {
                return (
                  <div className="bg-white rounded-xl relative" key={event._id}>
                    <div className="rounded-tl-[0.75rem] rounded-tr-[0.75rem] rounded-br-[0] rounded-bl-[0] object-fill aspect-16:9">
                      {event.image && (
                        <div className="event-card-image-container">
                          <img
                            src={`http://localhost:4000/${event.image.replace("\\", "/")}`}
                            alt={event.title}
                            className="event-image"
                          />
                        </div>
                      )}
                    </div>
                    <div className="m-2 grid gap-2">
                      <div className="flex justify-between items-center">
                        <h1 className="font-bold text-lg mt-2">{event.title ? event.title.toUpperCase() : "Untitled Event"}</h1>
                        <div className="flex gap-2 items-center mr-4 text-red-600">
                          <BiLike /> {event.likes}
                        </div>

                        <button onClick={() => handleLike(event._id)}>
                  <BiLike className="w-auto h-12 lg:h-10 sm:h-12 md:h-10 bg-white p-2 rounded-full shadow-md transition-all hover:text-primary" />
                </button>
                      </div>

                      <div className="flex text-sm flex-nowrap justify-between text-primarydark font-bold mr-4">
                        <div>{event.eventDate.split("T")[0]}, {event.eventTime}</div>
                        <div>{event.ticketPrice === 0 ? "Free" : "Rs. " + event.ticketPrice}</div>
                      </div>

                      <div className="text-xs flex flex-col flex-wrap truncate-text">{event.description}</div>
                      <div className="flex justify-between items-center my-2 mr-4">
                        <div className="text-sm text-primarydark">
                          Organized By: <br />
                          <span className="font-bold">{event.organizedBy}</span>
                        </div>
                        <div className="text-sm text-primarydark">
                          Created By: <br />
                          <span className="font-semibold">{event.owner ? event.owner.toUpperCase() : "Unknown Owner"}</span>

                        </div>
                      </div>

                      <Link to={"/event/" + event._id} className="flex justify-center">
                        <button className="primary flex items-center gap-2">
                          Register <BsArrowRightShort className="w-6 h-6" />
                        </button>
                      </Link>
                      <button onClick={() => handleDelete(event._id)} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all">
                        Delete
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
        </div>
      </div>
    </>
  );
}
