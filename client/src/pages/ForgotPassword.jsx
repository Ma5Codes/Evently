import { Link } from "react-router-dom";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Email submitted:', email);
  };

  return (
    <div className="flex w-full min-h-screen px-4 py-10 justify-center items-center bg-gray-100">
      <div className="bg-white w-full max-w-md px-8 py-10 rounded-xl shadow-md">
        <form className="flex flex-col items-center" onSubmit={handleSubmit}>
          <h1 className="font-extrabold mb-6 text-primarydark text-2xl">
            Forgot Password
          </h1>

          <div className="w-full mb-4 relative">
            <label htmlFor="email" className="text-sm block mb-2 text-gray-700">
              Email Address
            </label>
            <div className="flex items-center gap-2 border rounded-md px-3 py-2 focus-within:ring-2 ring-primary transition">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5 text-gray-500" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M17.834 6.166a8.25 8.25 0 100 11.668.75.75 0 011.06 1.06c-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788 3.807-3.808 9.98-3.808 13.788 0A9.722 9.722 0 0121.75 12c0 .975-.296 1.887-.809 2.571-.514.685-1.28 1.179-2.191 1.179-.904 0-1.666-.487-2.18-1.164a5.25 5.25 0 11-.82-6.26V8.25a.75.75 0 011.5 0V12c0 .682.208 1.27.509 1.671.3.401.659.579.991.579.332 0 .69-.178.991-.579.3-.4.509-.99.509-1.671a8.222 8.222 0 00-2.416-5.834zM15.75 12a3.75 3.75 0 10-7.5 0 3.75 3.75 0 007.5 0z" clipRule="evenodd" />
              </svg>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="w-full focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="primary w-full py-2 mt-2 bg-primary text-white rounded hover:bg-primarydark transition duration-200"
          >
            Submit
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
