import { Link } from "react-router-dom";
import { useState } from "react";
import Input from '../components/Input';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/forgot-password', { email });
      toast.success('If this email is registered, a password reset link has been sent.');
    } catch (err) {
      toast.error('Failed to send reset email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen px-4 py-10 justify-center items-center bg-gray-100">
      <div className="bg-white w-full max-w-md px-8 py-10 rounded-xl shadow-md">
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <h1 className="font-extrabold mb-6 text-primarydark text-2xl">
            Forgot Password
          </h1>

          <div className="w-full mb-4 relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              label="Email Address"
              required
            />
          </div>

          <button
            type="submit"
            className="primary w-full py-2 mt-2 bg-primary text-white rounded hover:bg-primarydark transition duration-200"
            disabled={loading}
          >
            {loading ? <Loader small /> : 'Submit'}
          </button>

          <Link
            to="/login"
            className="flex gap-2 items-center mt-6 text-primary py-2 px-4 bg-primarylight ring-1 ring-primarylight rounded hover:bg-primarydark hover:text-white hover:ring-primarydark transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-4 h-4" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
            </svg>
            <span>Back</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
