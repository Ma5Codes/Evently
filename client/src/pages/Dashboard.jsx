import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  // Mock events - you can replace this with data from your backend
  const userEvents = [
    {
      id: 1,
      title: 'Tech Summit 2025',
      date: '2025-06-15',
      location: 'Nairobi',
      ticketsSold: 120,
    },
    {
      id: 2,
      title: 'Music Fest Carnival',
      date: '2025-07-10',
      location: 'Mombasa',
      ticketsSold: 85,
    },
  ];

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
              {userEvents.reduce((sum, e) => sum + e.ticketsSold, 0)}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="text-lg font-semibold text-gray-700">Upcoming</h2>
            <p className="text-3xl font-bold text-primary">
              {userEvents.filter(e => new Date(e.date) > new Date()).length}
            </p>
          </div>
        </div>

        {/* My Events */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">📅 My Events</h2>
            <Link to="/create-event" className="text-sm text-white bg-primary px-4 py-2 rounded hover:bg-primarydark transition">
              + Create New Event
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userEvents.map(event => (
              <div key={event.id} className="bg-white p-5 rounded-xl shadow-md">
                <h3 className="text-lg font-bold text-primary">{event.title}</h3>
                <p className="text-gray-600">📍 {event.location}</p>
                <p className="text-gray-600">🗓️ {event.date}</p>
                <p className="text-gray-600">🎟️ {event.ticketsSold} tickets sold</p>
              </div>
            ))}
          </div>
        </section>
      </main>


    </div>
  );
};

export default Dashboard;
