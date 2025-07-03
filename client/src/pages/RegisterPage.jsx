/* eslint-disable no-empty */
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import logo from '../assets/EventHubLogo12.png';
import signupImage from '../assets/signuppic.svg';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return '';
    if (pwd.length < 6) return 'Weak';
    if (/[A-Z]/.test(pwd) && /\d/.test(pwd) && /[@$!%*?&#]/.test(pwd)) return 'Strong';
    return 'Medium';
  };

  async function registerUser(ev){
    ev.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try{
      await axios.post('/register', {
        name,
        email,
        password,
      });
      toast.success('Registration Successful');
      setRedirect(true);
    } catch(e){
      if (e.response && e.response.data && e.response.data.message) {
        toast.error(e.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (redirect){
    return <Navigate to={'/login'} />
  }

  return (
    <div className ="flex w-full h-full lg:-ml-24 px-10 py-10 justify-between place-items-center mt-12">
      <div className= "hidden lg:flex flex-col right-box ">
        <div className="flex flex-col gap-3">
          <div className="text-3xl font-black">Welcome to</div>
          <div>
            <img src={logo} alt="Logo" className="w-48" />
          </div>
        </div>
        <div className="ml-48 w-80 mt-6">
          <img src={signupImage} alt="Signup Illustration" className="w-full" />
        </div>
      </div>
      <div className= "bg-white w-full sm:w-full md:w-1/2 lg:w-1/3 px-7 py-7 rounded-xl justify-center align-middle ">
        <form className="flex flex-col w-auto items-center" onSubmit={registerUser}>
          <h1 className='px-3 font-extrabold mb-5 text-primarydark text-2xl'>Sign Up</h1>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={ev => setName(ev.target.value)}
            label="Name"
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={ev => setEmail(ev.target.value)}
            label="Email"
            required
          />
          <div className="w-full relative mt-4">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={ev => setPassword(ev.target.value)}
              label="Password"
              required
            />
            <span
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.274.857-.687 1.664-1.212 2.39M15.54 15.54A5.978 5.978 0 0112 17c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.042-3.362"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.042-3.362M9.88 9.88A3 3 0 0115 12m-3 3a3 3 0 01-3-3m0 0a3 3 0 013-3m0 0a3 3 0 013 3m0 0a3 3 0 01-3 3z"/></svg>
              )}
            </span>
            {password && (
              <div className={`text-sm mt-1 ${getPasswordStrength(password) === 'Strong' ? 'text-green-600' : getPasswordStrength(password) === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                Strength: {getPasswordStrength(password)}
              </div>
            )}
          </div>
          <div className="w-full relative mt-4">
            <Input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={ev => setConfirmPassword(ev.target.value)}
              label="Confirm Password"
              required
            />
            <span
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
              onClick={() => setShowConfirm((prev) => !prev)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showConfirm ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.274.857-.687 1.664-1.212 2.39M15.54 15.54A5.978 5.978 0 0112 17c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.042-3.362"/></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.042-3.362M9.88 9.88A3 3 0 0115 12m-3 3a3 3 0 01-3-3m0 0a3 3 0 013-3m0 0a3 3 0 013 3m0 0a3 3 0 01-3 3z"/></svg>
              )}
            </span>
          </div>
          <div className="w-full py-4">
            <button type="submit" className="primary w-full" disabled={loading}>
              {loading ? <Loader small /> : 'Create Account'}
            </button>
          </div>
          <div className="container2">
            <div className="w-full h-full p-1">
              <Link to="/login" className="text-black font-bold rounded w-full h-full flex items-center justify-center border border-gray-300 p-2">
                Sign In
              </Link>
            </div>
          </div>
          <Link to={'/'} className="">
            <button className="secondary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
              </svg>
              Back
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
