import { useContext, useEffect, useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Dashboard() {
  const { user, loading: userLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError(null);
    axios.get('/createEvent')
      .then(res => {
        // Filter events created by the current user
        setUserEvents(res.data.filter(e => e.owner?.toLowerCase() === user.name?.toLowerCase()));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch events.');
        setLoading(false);
        toast.error('Failed to fetch events.');
      });
  }, [user, userLoading, navigate]);

  if (userLoading || loading) return <Loader count={3} />;
  if (error) return <div className="text-center text-red-600 mt-10">{error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 bg-gray-50 p-6">
        <h1 className="text-3xl font-bold mb-6 text-primary">🎉 Welcome to Your Dashboard</h1>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-700">Total Events</h2>
            <p className="text-3xl font-bold text-primary">{userEvents.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-700">Tickets Sold</h2>
            <p className="text-3xl font-bold text-primary">
              {userEvents.reduce((sum, e) => sum + (e.ticketsSold || 0), 0)}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-700">Upcoming</h2>
            <p className="text-3xl font-bold text-primary">
              {userEvents.filter(e => new Date(e.eventDate) > new Date()).length}
            </p>
          </div>
        </div>
        {/* My Events */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">📅 My Events</h2>
            <Link to="/createEvent" className="text-sm text-white bg-primary px-4 py-2 rounded hover:bg-primarydark transition">
              + Create New Event
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userEvents.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No events found.</div>
            ) : (
              userEvents.map(event => (
                <div key={event._id} className="bg-white p-5 rounded-xl shadow-md">
                  <h3 className="text-lg font-bold text-primary">{event.title}</h3>
                  <p className="text-gray-600">📍 {event.location}</p>
                  <p className="text-gray-600">🗓️ {event.eventDate?.split('T')[0]}</p>
                  <p className="text-gray-600">🎟️ {event.ticketsSold || 0} tickets sold</p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
