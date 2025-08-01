import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { IoMdArrowBack } from "react-icons/io";
import { Link, useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Loader from '../components/Loader';
import ErrorBoundary from '../components/ErrorBoundary';
import { toast } from 'react-toastify';

export default function OrderSummary() {
  const { user, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError(null);
    axios.get(`/event/${id}/ordersummary`)
      .then(response => {
        setEvent(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load event data.");
        setLoading(false);
        toast.error("Failed to load event data.");
      });
  }, [id, user, userLoading, navigate]);

  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
  };

  if (userLoading || loading) return <Loader count={1} />;

  return (
    <ErrorBoundary>
      {error ? (
        <div className="text-red-500 text-center mt-10">{error}</div>
      ) : !event ? (
        <Loader count={1} />
      ) : (
        <div>
          <Link to={`/event/${event._id}`}>
            <button className='
              inline-flex 
              mt-12
              gap-2
              p-3 
              ml-12
              bg-gray-100
              justify-center 
              items-center 
              text-blue-700
              font-bold
              rounded-md'>
              <IoMdArrowBack className='w-6 h-6' />
              Back
            </button>
          </Link>
          <div className='flex flex-col'>
            <div className='inline-flex gap-5 mt-8'>
              {/* Terms & Conditions */}
              <div className="p-4 ml-12 bg-gray-100 w-3/4 mb-12">
                <h2 className='text-left font-bold mb-4'>Terms & Conditions</h2>
                <ul className="custom-list space-y-2 text-sm">
                  <li>Refunds will be provided for ticket cancellations made up to 14 days before the event date. After this period, no refunds will be issued. To request a refund, please contact our customer support team.</li>
                  <li>Tickets will be delivered to your registered email address as e-tickets. You can print the e-ticket or show it on your mobile device for entry to the event.</li>
                  <li>Each individual is allowed to purchase a maximum of 2 tickets for this event to ensure fair distribution.</li>
                  <li>In the rare event of cancellation or postponement, attendees will be notified via email. Refunds will be automatically processed for canceled events.</li>
                  <li>Tickets for postponed events will not be refunded and the ticket will be considered a valid ticket on the date of postponement.</li>
                  <li>Your privacy is important to us. Our privacy policy outlines how we collect, use, and protect your personal information. By using our app, you agree to our privacy policy.</li>
                  <li>Before proceeding with your ticket purchase, please review and accept our terms and conditions, which govern the use of our app and ticketing services.</li>
                </ul>
              </div>
              {/* Booking Summary */}
              <div className="w-1/4 pl-4 h-1/4 mr-12 bg-blue-100">
                <h2 className='mt-4 font-bold'>Booking Summary</h2>
                <div className='text-sm flex justify-between'>
                  <div className='text-left mt-5'>{event.title}</div>
                  <div className='text-right mt-5 mb-6 pr-5'>₹. {event.ticketPrice}</div>
                </div>
                <hr className="my-2 pt-2 border-gray-300" />
                <div className='text-sm font-bold flex justify-between'>
                  <div className='text-left mt-5'>SUB TOTAL</div>
                  <div className='text-right mt-5 mb-6 pr-5'>₹. {event.ticketPrice}</div>
                </div>
                <div className='flex justify-between items-start gap-2 mb-3'>
                  <input
                    className='h-5 mt-1'
                    type='checkbox'
                    checked={isCheckboxChecked}
                    onChange={handleCheckboxChange}
                  />
                  <div className='text-sm'>
                    I have verified the Event name, date and time before proceeding to payment. I accept terms and conditions.
                  </div>
                </div>
                <div className='mb-5'>
                  <Link to={`/event/${event._id}/ordersummary/paymentsummary`}>
                    <button
                      className={`mt-5 p-3 ml-2 w-36 text-gray-100 ${
                        isCheckboxChecked ? 'bg-blue-700' : 'bg-gray-300'
                      } gap-2 rounded-md`}
                      disabled={!isCheckboxChecked}
                    >
                      Proceed
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
}

// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { IoMdArrowBack } from "react-icons/io";
// import { Link, useParams } from 'react-router-dom';

// export default function OrderSummary() {
//     const {id} = useParams();
//     const [event, setEvent] = useState(null);
//     const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  
//     useEffect(()=>{
//       if(!id){
//         return;
//       }
//       axios.get(`/event/${id}/ordersummary`).then(response => {
//         setEvent(response.data)
//       }).catch((error) => {
//         console.error("Error fetching events:", error);
//       });
//     }, [id])
    
//     //! Handle checkbox change
//     const handleCheckboxChange = (e) => {
//       setIsCheckboxChecked(e.target.checked)
//     }
  
//     if (!event) return '';
//     return (
//       <div>
//           <Link to={'/event/'+event._id}>
//           <button 
//               // onClick={handleBackClick}
//               className='
//               inline-flex 
//               mt-12
//               gap-2
//               p-3 
//               ml-12
//               bg-gray-100
//               justify-center 
//               items-center 
//               text-blue-700
//               font-bold
//               rounded-md'
//               >
//           <IoMdArrowBack 
//             className='
//             font-bold
//             w-6
//             h-6
//             gap-2'/> 
//             Back
//           </button>
//           </Link>
//           <div className='flex flex-col'>
//                 <div className= 'inline-flex gap-5 mt-8'> 
//                     <div className="
//                       p-4
//                       ml-12 
//                       bg-gray-100
//                       w-3/4
//                       mb-12"
//                       >
//                       <h2
//                           className='
//                             text-left
//                             font-bold
//                             '> 
//                             Terms & Conditions </h2>
//                             <br/>
  
//                               <div>
//                               <ul className="custom-list">
//                                   <li> Refunds will be provided for ticket cancellations made up to 14 days before the event date. After this period, no refunds will be issued. To request a refund, please contact our customer support team. </li>
  
//                                   <li> Tickets will be delivered to your registered email address as e-tickets. You can print the e-ticket or show it on your mobile device for entry to the event. </li>
  
//                                   <li> Each individual is allowed to purchase a maximum of 2 tickets for this event to ensure fair distribution. </li>
  
//                                   <li> In the rare event of cancellation or postponement, attendees will be notified via email. Refunds will be automatically processed for canceled events. </li>
  
//                                   <li> Tickets for postponed events will not be refunded and the ticket will be considered a valid ticket on the date of postponement.</li>
  
//                                   <li> Your privacy is important to us. Our privacy policy outlines how we collect, use, and protect your personal information. By using our app, you agree to our privacy policy. </li>
  
//                                   <li> Before proceeding with your ticket purchase, please review and accept our terms and conditions, which govern the use of our app and ticketing services. </li>
//                               </ul>
  
//                               <br/>
//                             </div>
                                    
//                     </div>
                    
//                     <div className="
//                       w-1/4
//                       pl-4
//                       h-1/4
//                       mr-12 
//                       bg-blue-100
//                     "
//                       >
//                         <h2 className='
//                             mt-4
//                             font-bold
//                         '>Booking Summary
//                         </h2>
//                         <div className='text-sm flex justify-between' >
//                               <div className='text-left mt-5'>{event.title}</div>
//                               <div className='text-right mt-5 mb-6 pr-5'>₹. {event.ticketPrice}</div>
//                         </div>
                        
//                         <hr className=" my-2 pt-2 border-gray-300" />
//                         <div className='text-sm font-bold flex justify-between' >
//                           <div className='text-left mt-5'>SUB TOTAL</div>
//                           <div className='text-right mt-5 mb-6 pr-5'>₹. {event.ticketPrice}</div>
//                         </div>
//                         <div className='flex justify-between'>
//                           <input className='h-5 ' type='checkbox' onChange={handleCheckboxChange}/>
//                           <div className='px-2 text-sm'>
//                             I have verified the Event name, date and time before proceeding to payment. I accept terms and conditions. 
//                           </div>
//                         </div>
  
//                         <div className='mb-5'>
//                                   <Link to={'/event/'+event._id+ '/ordersummary'+'/paymentsummary'}>
//                                     <button 
//                                     className={`mt-5 p-3 ml-2 w-36 text-gray-100 items-center ${
//                                       isCheckboxChecked ? 'bg-blue-700' : 'bg-gray-300'} gap-2 rounded-md`}
//                                     disabled={!isCheckboxChecked}
//                                     >
//                                       Proceed
//                                     </button>
//                                   </Link>
//                             </div>
                          
//                             </div>
//                           </div>
                          
//                           </div> 
              
//                     </div>
  
//     );
// }
