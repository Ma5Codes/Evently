/* eslint-disable no-unused-vars */
import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage'
import RegisterPage from './pages/RegisterPage'
import Layout from './Layout'
import LoginPage from './pages/LoginPage'
import axios from 'axios'
import { UserContextProvider, UserContext } from './UserContext'
import UserAccountPage from './pages/UserAccountPage'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import AddEvent from './pages/AddEvent'
import EventPage from './pages/EventPage'
import CalendarView from './pages/CalendarView'
import OrderSummary from './pages/OrderSummary'
import PaymentSummary from './pages/PaymentSummary'
import TicketPage from './pages/TicketPage'
import Dashboard from './pages/Dashboard'
import CreatEvent from './pages/CreateEvent'
import Loader from './components/Loader'
import ErrorBoundary from './components/ErrorBoundary'
import { useContext } from 'react'

axios.defaults.baseURL = 'http://localhost:4000/';
axios.defaults.withCredentials=true;

function RequireAuth({ children }) {
  const { user, loading } = useContext(UserContext);
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <UserContextProvider>
      <ErrorBoundary>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path='/useraccount' element={<RequireAuth><UserAccountPage /></RequireAuth>} />
            <Route path='/createEvent' element={<RequireAuth><AddEvent /></RequireAuth>} />
            <Route path='/event/:id' element={<EventPage />} />
            <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path='/calendar' element={<CalendarView />} />
            <Route path='/wallet' element={<RequireAuth><TicketPage /></RequireAuth>} />
            <Route path='/event/:id/ordersummary' element={<RequireAuth><OrderSummary /></RequireAuth>} />
          </Route>
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/forgotpassword' element={<ForgotPassword />} />
          <Route path='/resetpassword' element={<ResetPassword />} />
          <Route path='/event/:id/ordersummary/paymentsummary' element={<RequireAuth><PaymentSummary /></RequireAuth>} />
        </Routes>
      </ErrorBoundary>
    </UserContextProvider>
  )
}

export default App
