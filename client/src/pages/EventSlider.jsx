import React, { useState, useEffect, useCallback } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./EventSlider.css";

const EventSlider = ({ events = [], autoPlay = true, intervalTime = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Set loading to false once events are loaded
  useEffect(() => {
    if (events.length > 0) {
      setIsLoading(false);
    }
  }, [events]);

  // Move to the next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  }, [events.length]);

  // Move to the previous slide
  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  }, [events.length]);

  // Autoplay functionality
  useEffect(() => {
    if (!autoPlay || events.length === 0) return;
    const interval = setInterval(nextSlide, intervalTime);
    return () => clearInterval(interval);
  }, [autoPlay, intervalTime, nextSlide, events.length]);

  // Keyboard arrow key support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Position logic for slide animations
  const getSlideIndex = (index) => (index + events.length) % events.length;

  // Fallback image path
  const defaultImage = "/assets/EventHubLogo12.png";

  // Show loading spinner
  if (isLoading) return <div className="loading-spinner">Loading...</div>;

  // Show message if no events are found
  if (events.length === 0) return <div className="no-events-message">No events available.</div>;

  return (
    <div
      className="event-slider-container"
      role="region"
      aria-label="Event slider"
      tabIndex={0}
    >
      {/* Left Arrow */}
      <button
        className="slider-arrow left"
        onClick={prevSlide}
        aria-label="Previous Slide"
      >
        <BsArrowLeft />
      </button>

      {/* Slider Section */}
      <div className="event-slider">
        {events.map((event, index) => {
          const position =
            index === currentIndex
              ? "active"
              : index === getSlideIndex(currentIndex - 1)
              ? "previous"
              : index === getSlideIndex(currentIndex + 1)
              ? "next"
              : "hidden";

          const imageUrl = event.image
            ? `http://localhost:4000/${event.image.replace("\\", "/")}`
            : defaultImage;

          return (
            <div
              key={event._id || index}
              className={`slide ${position}`}
              aria-hidden={position !== "active"}
            >
              <Link
                to={`/event/${event._id || "#"}`}
                aria-label={`Go to ${event.title || "Event"} details`}
              >
                <img
                  src={imageUrl}
                  alt={event.title || "Event"}
                  className="event-slider-image"
                  loading="lazy"
                  onError={(e) => (e.target.src = defaultImage)} // fallback if image fails
                />
                {position === "active" && (
                  <p className="event-slider-title">
                    {event.title || "Untitled Event"}
                  </p>
                )}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Right Arrow */}
      <button
        className="slider-arrow right"
        onClick={nextSlide}
        aria-label="Next Slide"
      >
        <BsArrowRight />
      </button>
    </div>
  );
};

export default EventSlider;

 // import React, { useState, useEffect } from "react";
  // import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
  // import { Link } from "react-router-dom";
  // import "./EventSlider.css";

  // const EventSlider = ({ events = [], autoPlay = true, intervalTime = 3000 }) => {
  //   const [currentIndex, setCurrentIndex] = useState(0);
  //   const [isLoading, setIsLoading] = useState(true);

  //   useEffect(() => {
  //     if (events.length > 0) {
  //       setIsLoading(false); // Stop loading once events are available
  //     }
  //   }, [events]);

  //   const nextSlide = () => {
  //     setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
  //   };

  //   const prevSlide = () => {
  //     setCurrentIndex((prevIndex) => (prevIndex - 1 + events.length) % events.length);
  //   };

  //   useEffect(() => {
  //     if (!autoPlay || events.length === 0) return;

  //     const interval = setInterval(nextSlide, intervalTime);
  //     return () => clearInterval(interval);
  //   }, [autoPlay, intervalTime, currentIndex, events.length]);

  //   const handleKeyDown = (e) => {
  //     if (e.key === "ArrowRight") nextSlide();
  //     if (e.key === "ArrowLeft") prevSlide();
  //   };

  //   useEffect(() => {
  //     window.addEventListener("keydown", handleKeyDown);
  //     return () => window.removeEventListener("keydown", handleKeyDown);
  //   }, []);

  //   const getSlideIndex = (index) => (index + events.length) % events.length;
  //   const defaultImage = "/assets/EventHubLogo12.png"; // Ensure this path is correct

  //   if (isLoading) {
  //     return <div className="loading-spinner">Loading...</div>; // Add a spinner while loading
  //   }

  //   if (events.length === 0) {
  //     return <div className="no-events-message">No events available.</div>;
  //   }

  //   return (
  //     <div className="event-slider-container">
  //       <button className="slider-arrow left" onClick={prevSlide}>
  //         <BsArrowLeft />
  //       </button>
  //       <div className="event-slider">
  //         {events.map((event, index) => {
  //           const position =
  //             index === currentIndex
  //               ? "active"
  //               : index === getSlideIndex(currentIndex - 1)
  //               ? "previous"
  //               : index === getSlideIndex(currentIndex + 1)
  //               ? "next"
  //               : "hidden";

  //           return (
  //             <div key={event._id || index} className={`slide ${position}`}>
  //               <Link to={`/event/${event._id || "#"}`}>
  //                 <img
  //                   src={
  //                     event.image
  //                       ? `http://localhost:4000/${event.image.replace("\\", "/")}`
  //                       : defaultImage
  //                   }
  //                   alt={event.title || "Event"}
  //                   className="event-slider-image"
  //                   loading="lazy" // Lazy load the images
  //                 />
  //                 {position === "active" && (
  //                   <p className="event-slider-title">{event.title || "Untitled Event"}</p>
  //                 )}
  //               </Link>
  //             </div>
  //           );
  //         })}
  //       </div>
  //       <button className="slider-arrow right" onClick={nextSlide}>
  //         <BsArrowRight />
  //       </button>
  //     </div>
  //   );
  // };

  // export default EventSlider;
