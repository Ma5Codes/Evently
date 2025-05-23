import { Link } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { RiDeleteBinLine } from "react-icons/ri";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function TicketPage() {
  const { user } = useContext(UserContext);
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tickets when user is available
  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/tickets/user/${user._id}`);
      setUserTickets(response.data);
    } catch (error) {
      console.error("Error fetching user tickets:", error);
      setError("Failed to fetch tickets.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTicket = async (ticketId) => {
    try {
      const response = await axios.delete(`/tickets/${ticketId}`);
      if (response.status === 200) {
        fetchTickets(); // Refresh after deletion
        alert("Ticket deleted.");
      } else {
        alert("Failed to delete ticket.");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert("Error deleting ticket.");
    }
  };

  return (
    <div className="flex flex-col flex-grow">
      {/* Header / Back Button */}
      <div className="mb-5 flex justify-between items-center">
        <Link to="/">
          <button className="inline-flex mt-12 gap-2 p-3 ml-12 bg-gray-100 justify-center items-center text-blue-700 font-bold rounded-md">
            <IoMdArrowBack className="w-6 h-6" />
            Back
          </button>
        </Link>
      </div>

      {/* Error Handling */}
      {error && <div className="text-center text-red-600 mt-4">{error}</div>}

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-gray-500 mt-4">Loading tickets...</div>
      ) : userTickets.length === 0 ? (
        <div className="text-center text-gray-500 mt-4">You have no tickets.</div>
      ) : (
        <div className="mx-12 grid grid-cols-1 xl:grid-cols-2 gap-5">
          {userTickets.map((ticket) => (
            <div key={ticket._id}>
              <div className="h-48 mt-2 gap-2 p-5 bg-gray-100 font-bold rounded-md relative">
                {/* Delete Button */}
                <button
                  onClick={() => deleteTicket(ticket._id)}
                  className="absolute right-2 top-2"
                  title="Delete Ticket"
                >
                  <RiDeleteBinLine className="h-6 w-6 text-red-700 hover:text-red-900 transition" />
                </button>

                <div className="flex justify-start items-center text-sm md:text-base font-normal">
                  {/* QR Code */}
                  <div className="w-28 h-28">
                    <img
                      src={ticket.ticketDetails.qr}
                      alt="QR Code"
                      className="aspect-square object-cover rounded-md"
                    />
                  </div>

                  {/* Ticket Info */}
                  <div className="ml-6 grid grid-cols-2 gap-x-6 gap-y-2 text-xs md:text-sm">
                    <div>
                      Event Name: <br />
                      <span className="font-extrabold text-primarydark">
                        {ticket.ticketDetails.eventname?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      Date & Time: <br />
                      <span className="font-extrabold text-primarydark">
                        {ticket.ticketDetails.eventdate?.split("T")[0]},{" "}
                        {ticket.ticketDetails.eventtime}
                      </span>
                    </div>
                    <div>
                      Name:{" "}
                      <span className="font-extrabold text-primarydark">
                        {ticket.ticketDetails.name?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      Price:{" "}
                      <span className="font-extrabold text-primarydark">
                        Rs. {ticket.ticketDetails.ticketprice}
                      </span>
                    </div>
                    <div>
                      Email:{" "}
                      <span className="font-extrabold text-primarydark">
                        {ticket.ticketDetails.email}
                      </span>
                    </div>
                    <div>
                      Ticket ID: <br />
                      <span className="font-extrabold text-primarydark">
                        {ticket.ticketDetails._id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}





// import { Link } from "react-router-dom";
// import {IoMdArrowBack} from 'react-icons/io'
// import {RiDeleteBinLine} from 'react-icons/ri'
// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import { UserContext } from "../UserContext";

// export default function TicketPage() {
//     const {user} = useContext(UserContext);
  
//     const [userTickets, setUserTickets] = useState([]);
  
//     useEffect(() => {
//       if (user) {
//         fetchTickets()
//       }
//     }, );
  
//     const fetchTickets = async()=>{
//       axios.get(`/tickets/user/${user._id}`)
//           .then(response => {
//             setUserTickets(response.data);
//           })
//           .catch(error => {
//             console.error('Error fetching user tickets:', error);
//           })
//     }
  
//     const deleteTicket = async (ticketId) => {
//       try {
//          const response = await axios.delete(`/tickets/${ticketId}`);
//          if (response.status === 200) {
//             fetchTickets(); // Refresh ticket list
//             alert('Ticket Deleted');
//          } else {
//             alert('Failed to delete ticket');
//          }
//       } catch (error) {
//          console.error('Error deleting ticket:', error);
//          alert('Error deleting ticket');
//       }
//    }
   
  
//     return (
//       <div className="flex flex-col flex-grow">
//       <div className="mb-5 flex justify-between place-items-center">
//         <div>
//           <Link to='/'>
//             <button 
//                 // onClick={handleBackClick}
//                 className='
//                 inline-flex 
//                 mt-12
//                 gap-2
//                 p-3 
//                 ml-12
//                 bg-gray-100
//                 justify-center 
//                 items-center 
//                 text-blue-700
//                 font-bold
//                 rounded-md'
//                 >
//               <IoMdArrowBack 
//               className='
//               font-bold
//               w-6
//               h-6
//               gap-2'/> 
//               Back
//             </button>
//           </Link>
//         </div>
//         <div className=" place-item-center hidden">
          
//             <RiDeleteBinLine className="h-6 w-10 text-red-700 "/>
          
//         </div>
        
//         </div>
//         <div className="mx-12 grid grid-cols-1 xl:grid-cols-2 gap-5">
          
//         {userTickets.map(ticket => (
          
//         <div key={ticket._id} >
//           <div className="">
            
//             <div className="h-48 mt-2 gap-2 p-5 bg-gray-100 font-bold rounded-md relative">
//               <button onClick={()=>deleteTicket(ticket._id)} className="absolute cursor-pointer right-0 mr-2">
//                 <RiDeleteBinLine className=" h-6 w-10 text-red-700 "/>
//               </button>
//               <div className="flex justify-start place-items-center text-sm md:text-base font-normal">
                
//                 <div className=" h-148 w-148">
//                   <img src={ticket.ticketDetails.qr} alt="QRCode" className="aspect-square object-fill "/>
//                 </div>
//                 <div className="ml-6 grid grid-cols-2 gap-x-6 gap-y-2">
//                   <div className="">
//                     Event Name : <br /><span className=" font-extrabold text-primarydark">{ticket.ticketDetails.eventname.toUpperCase()}</span>
//                   </div>
                  
//                   <div>
//                     Date & Time:<br /> <span className="font-extrabold text-primarydark">{ticket.ticketDetails.eventdate.toUpperCase().split("T")[0]}, {ticket.ticketDetails.eventtime}</span>
//                   </div>
//                   <div>
//                     Name: <span className="font-extrabold text-primarydark">{ticket.ticketDetails.name.toUpperCase()}</span>
//                   </div>
//                   <div>
//                     Price: <span className="font-extrabold text-primarydark"> Rs. {ticket.ticketDetails.ticketprice}</span>
//                   </div>
//                   <div>
//                     Email: <span className="font-extrabold text-primarydark">{ticket.ticketDetails.email}</span>
//                   </div>
//                   <div>
//                     Ticket ID:<br /><span className="font-extrabold text-primarydark">{ticket.ticketDetails._id}</span>
//                   </div>
//                 </div>
//               </div>
              
//             </div>
//           </div>
//           </div>
        
//          ))}
//          </div>
  
      
//       </div>
//     )
// }
