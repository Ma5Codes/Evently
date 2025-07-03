import { Link, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const TICKETS_PER_PAGE = 4;

function TicketCard({ ticket, onDelete }) {
  return (
    <div className="h-48 mt-2 gap-2 p-5 bg-gray-100 font-bold rounded-md relative">
      <button
        onClick={() => onDelete(ticket._id)}
        className="absolute right-2 top-2"
        title="Delete Ticket"
        aria-label="Delete Ticket"
      >
        <svg className="h-6 w-6 text-red-700 hover:text-red-900 transition" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
      </button>
      <div className="flex justify-start items-center text-sm md:text-base font-normal">
        <div className="w-28 h-28">
          <img
            src={ticket.ticketDetails.qr}
            alt="QR Code"
            className="aspect-square object-cover rounded-md"
          />
        </div>
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
              {ticket.ticketDetails.eventdate?.split("T")[0]}, {ticket.ticketDetails.eventtime}
            </span>
          </div>
          <div>
            Name: <span className="font-extrabold text-primarydark">
              {ticket.ticketDetails.name?.toUpperCase()}
            </span>
          </div>
          <div>
            Price: <span className="font-extrabold text-primarydark">
              Rs. {ticket.ticketDetails.ticketprice}
            </span>
          </div>
          <div>
            Email: <span className="font-extrabold text-primarydark">
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
  );
}

export default function TicketPage() {
  const { user, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [userTickets, setUserTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTickets();
    // eslint-disable-next-line
  }, [user, userLoading]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/tickets/user/${user._id}`);
      setUserTickets(response.data);
    } catch (error) {
      setError("Failed to fetch tickets.");
      toast.error("Failed to fetch tickets.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTicket = async (ticketId) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      const response = await axios.delete(`/tickets/${ticketId}`);
      if (response.status === 200) {
        fetchTickets();
        toast.success("Ticket deleted.");
      } else {
        toast.error("Failed to delete ticket.");
      }
    } catch (error) {
      toast.error("Error deleting ticket.");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(userTickets.length / TICKETS_PER_PAGE);
  const startIdx = (page - 1) * TICKETS_PER_PAGE;
  const paginatedTickets = userTickets.slice(startIdx, startIdx + TICKETS_PER_PAGE);

  if (userLoading || loading) return <Loader count={TICKETS_PER_PAGE} />;

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
      {/* Tickets */}
      {paginatedTickets.length === 0 ? (
        <div className="text-center text-gray-500 mt-4">You have no tickets.</div>
      ) : (
        <div className="mx-12 grid grid-cols-1 xl:grid-cols-2 gap-5">
          {paginatedTickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} onDelete={deleteTicket} />
          ))}
        </div>
      )}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            className="px-3 py-1 rounded border"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous Page"
          >
            Previous
          </button>
          <span className="px-3 py-1">Page {page} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded border"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next Page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
