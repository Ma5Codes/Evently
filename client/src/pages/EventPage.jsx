import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AiFillCalendar } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaCopy, FaWhatsappSquare, FaFacebook } from "react-icons/fa";
import { UserContext } from '../UserContext';
import Loader from '../components/Loader';
import ErrorBoundary from '../components/ErrorBoundary';

export default function EventPage() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [copySuccess, setCopySuccess] = useState("");

  // Fetch event data
  useEffect(() => {
    setLoading(true);
    setError(null);
    if (!id) return;
    axios
      .get(`/event/${id}`)
      .then((response) => {
        setEvent(response.data);
      })
      .catch(() => {
        setError("Failed to fetch event. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Copy Link
  const handleCopyLink = () => {
    const linkToShare = window.location.href;
    navigator.clipboard.writeText(linkToShare).then(() => {
      setCopySuccess("Link copied to clipboard!");
      setTimeout(() => setCopySuccess(""), 2000);
    });
  };

  // WhatsApp Share
  const handleWhatsAppShare = () => {
    const linkToShare = window.location.href;
    const whatsappMessage = encodeURIComponent(`${linkToShare}`);
    window.open(`whatsapp://send?text=${whatsappMessage}`);
  };

  // Facebook Share
  const handleFacebookShare = () => {
    const linkToShare = window.location.href;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      linkToShare
    )}`;
    window.open(facebookShareUrl);
  };

  if (loading) {
    return <Loader count={1} />;
  }

  if (error) {
    return <div className="text-center text-lg font-semibold mt-10 text-red-600">{error}</div>;
  }

  if (!event) {
    return <div className="text-center text-lg font-semibold mt-10 text-red-600">Event not found.</div>;
  }

  const truncatedDescription = event.description.slice(0, 300);
  const isDescriptionTruncated = event.description.length > 300;

  return (
    <ErrorBoundary>
      <div className="flex flex-col mx-5 xl:mx-32 md:mx-10 mt-5 flex-grow">
        {event.image && (
          <img
            src={`http://localhost:4000/${event.image.replace("\\", "/")}`}
            alt={`${event.title} poster`}
            height="500px"
            width="1440px"
            className="rounded object-fill aspect-16:9"
          />
        )}

        <div className="flex justify-between mt-8 mx-2">
          <h1 className="text-3xl md:text-5xl font-extrabold">
            {event.title.toUpperCase()}
          </h1>
          {user && (
            <Link to={`/event/${event._id}/ordersummary`}>
              <button className="primary">Register</button>
            </Link>
          )}
        </div>

        <div className="mx-2">
          <h2 className="text-md md:text-xl font-bold mt-3 text-primarydark">
            {event.ticketPrice === 0 ? "Free" : "₹. " + event.ticketPrice}
          </h2>
        </div>

        <div className="mx-2 mt-5 text-md md:text-lg">
          {showFullDescription || !isDescriptionTruncated ? (
            <>{event.description}</>
          ) : (
            <>
              {truncatedDescription}...
              <button
                onClick={() => setShowFullDescription(true)}
                className="text-primarydark font-bold ml-2 hover:underline"
              >
                Read more
              </button>
            </>
          )}
        </div>

        <div className="mx-2 mt-5 text-md md:text-xl font-bold text-primarydark">
          Organized By {event.organizedBy}
        </div>

        <div className="mx-2 mt-5">
          <h1 className="text-md md:text-xl font-extrabold">When and Where</h1>
          <div className="sm:mx-5 lg:mx-32 mt-6 flex flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <AiFillCalendar className="w-auto h-5 text-primarydark" />
              <div className="flex flex-col gap-1">
                <h1 className="text-md md:text-lg font-extrabold">Date and Time</h1>
                <div className="text-sm md:text-lg">
                  Date: {event.eventDate.split("T")[0]} <br />
                  Time: {event.eventTime}
                </div>
              </div>
            </div>
            <div className="">
              <div className="flex items-center gap-4">
                <MdLocationPin className="w-auto h-5 text-primarydark" />
                <div className="flex flex-col gap-1">
                  <h1 className="text-md md:text-lg font-extrabold">Location</h1>
                  <div className="text-sm md:text-lg">{event.location}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-2 mt-5 text-md md:text-xl font-extrabold">
          Share with friends
          <div className="mt-10 flex gap-5 mx-10 md:mx-32">
            <button
              onClick={handleCopyLink}
              aria-label="Copy event link to clipboard"
              title="Copy Link"
            >
              <FaCopy className="w-auto h-6" />
            </button>

            <button
              onClick={handleWhatsAppShare}
              aria-label="Share event via WhatsApp"
              title="Share on WhatsApp"
            >
              <FaWhatsappSquare className="w-auto h-6 text-green-600" />
            </button>

            <button
              onClick={handleFacebookShare}
              aria-label="Share event on Facebook"
              title="Share on Facebook"
            >
              <FaFacebook className="w-auto h-6 text-blue-700" />
            </button>
          </div>
          {copySuccess && (
            <div className="text-green-700 font-medium mt-3">{copySuccess}</div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom"
// import { AiFillCalendar } from "react-icons/ai";
// import { MdLocationPin } from "react-icons/md";
// import { FaCopy, FaWhatsappSquare, FaFacebook } from "react-icons/fa";

// export default function EventPage() {
//   const {id} = useParams();
//   const [event, setEvent] = useState(null);
//   const [showFullDescription, setShowFullDescription] = useState(false);

//   //! Fetching the event data from server by ID ------------------------------------------
//   useEffect(()=>{
//     if(!id){
//       return;
//     }
//     axios.get(`/event/${id}`).then(response => {
//       setEvent(response.data)
//     }).catch((error) => {
//       console.error("Error fetching events:", error);
//     });
//   }, [id])

//   //! Copy Functionalities -----------------------------------------------
//   const handleCopyLink = () => {
//     const linkToShare = window.location.href;
//     navigator.clipboard.writeText(linkToShare).then(() => {
//       alert('Link copied to clipboard!');
//     });
//   };

//   const handleWhatsAppShare = () => {
//     const linkToShare = window.location.href;
//     const whatsappMessage = encodeURIComponent(`${linkToShare}`);
//     window.open(`whatsapp://send?text=${whatsappMessage}`);
//   };

//   const handleFacebookShare = () => {
//     const linkToShare = window.location.href;
//     const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkToShare)}`;
//     window.open(facebookShareUrl);
//   };
  
//   if (!event) return '';

//   const truncatedDescription = event.description.slice(0, 300);
//   const isDescriptionTruncated = event.description.length > 300;

//   return (
//     <div className="flex flex-col mx-5 xl:mx-32 md:mx-10 mt-5 flex-grow">
//      <div >
//         {event.image &&(
//           <img src={`http://localhost:4000/${event.image.replace("\\", "/")}`} alt="" height="500px" width="1440px" className='rounded object-fill aspect-16:9'/>
//         )}
//       </div>

//       <div className="flex justify-between mt-8 mx-2">
//           <h1 className="text-3xl md:text-5xl font-extrabold">{event.title.toUpperCase()}</h1>
//           <Link to={'/event/'+event._id+ '/ordersummary'}>
//             <button className="primary">Register</button>  
//           </Link>
//       </div>
//       <div className="mx-2">
//           <h2 className="text-md md:text-xl font-bold mt-3 text-primarydark">{event.ticketPrice === 0? 'Free' : '₹. '+ event.ticketPrice}</h2>
//       </div>
//       <div className="mx-2 mt-5 text-md md:text-lg">
//         {showFullDescription || !isDescriptionTruncated ? (
//           <>{event.description}</>
//         ) : (
//           <>
//             {truncatedDescription}...
//             <button 
//               onClick={() => setShowFullDescription(true)} 
//               className="text-primarydark font-bold ml-2 hover:underline"
//             >
//               Read more
//             </button>
//           </>
//         )}
//       </div>
//       <div className="mx-2 mt-5 text-md md:text-xl font-bold text-primarydark">
//         Organized By {event.organizedBy}
        
//       </div>
//       <div className="mx-2 mt-5">
//         <h1 className="text-md md:text-xl font-extrabold">When and Where </h1>
//         <div className="sm:mx-5 lg:mx-32 mt-6 flex flex-row items-center justify-between gap-4">
//           <div className="flex items-center gap-4">
//             <AiFillCalendar className="w-auto h-5 text-primarydark "/>
//             <div className="flex flex-col gap-1">
              
//               <h1 className="text-md md:text-lg font-extrabold">Date and Time</h1>
//               <div className="text-sm md:text-lg">
//               Date: {event.eventDate.split("T")[0]} <br />Time: {event.eventTime}
//               </div>
//             </div>
            
//           </div>
//           <div className="">
//             <div className="flex items-center gap-4">
//             <MdLocationPin className="w-auto h-5 text-primarydark "/>
//             <div className="flex flex-col gap-1">
              
//               <h1 className="text-md md:text-lg font-extrabold">Location</h1>
//               <div className="text-sm md:text-lg">
//                 {event.location}
//               </div>
//             </div>
            
//           </div>
//           </div>
//         </div>
            
//       </div>
//       <div className="mx-2 mt-5 text-md md:text-xl font-extrabold">
//         Share with friends
//         <div className="mt-10 flex gap-5 mx-10 md:mx-32 ">
//         <button onClick={handleCopyLink}>
//             <FaCopy className="w-auto h-6" />
//           </button>

//           <button onClick={handleWhatsAppShare}>
//             <FaWhatsappSquare className="w-auto h-6" />
//           </button>

//           <button onClick={handleFacebookShare}>
//             <FaFacebook className="w-auto h-6" />
//           </button>

//         </div>
//       </div>


//     </div>
//   )
// }
