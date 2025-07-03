import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Input from '../components/Input';
import Loader from '../components/Loader';
import { toast } from "react-toastify";
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();

  const getPasswordStrength = (pwd) => {
    if (!pwd) return "";
    if (pwd.length < 8) return "Weak";
    if (/[A-Z]/.test(pwd) && /\d/.test(pwd) && /[@$!%*?&#]/.test(pwd)) return "Strong";
    return "Medium";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("❌ Passwords do not match!");
      return;
    }
    if (getPasswordStrength(password) !== 'Strong') {
      toast.error("Password is not strong enough.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`/reset-password/${token}`, { password });
      toast.success("✅ Password successfully reset!");
      setPassword('');
      setConfirmPassword('');
      navigate('/login');
    } catch (err) {
      toast.error("Failed to reset password. The link may be invalid or expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-full px-10 py-10 justify-center items-center mt-20">
      <div className="bg-white w-1/3 px-7 py-7 rounded-xl">
        <form className="flex flex-col w-auto items-center" onSubmit={handleSubmit}>
          <h1 className="px-3 font-extrabold mb-5 text-primarydark text-2xl">Reset Password</h1>
          <div className="w-full relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              label="Password"
              required
            />
            <span
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
            {password && (
              <div className={`text-sm mt-1 ${getPasswordStrength(password) === 'Strong' ? 'text-green-600' : getPasswordStrength(password) === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                Strength: {getPasswordStrength(password)}
              </div>
            )}
          </div>
          <div className="w-full relative mt-4">
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              label="Confirm Password"
              required
            />
            <span
              className="absolute right-3 top-10 cursor-pointer text-gray-500"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showConfirm ? "🙈" : "👁️"}
            </span>
          </div>
          <div className="w-full py-4">
            <button type="submit" className="primary w-full" disabled={loading}>
              {loading ? <Loader small /> : 'Submit'}
            </button>
          </div>
          <Link to="/login" className="flex gap-2 items-center text-primary py-2 px-4 bg-primarylight ring-1 ring-primarylight rounded hover:bg-primarydark hover:shadow-lg duration-75 hover:ring-primarydark hover:text-white">
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

// // import React from 'react'

// import { Link } from "react-router-dom";

// export default function ResetPassword() {
//   return (
//     <div className ="flex w-full h-full px-10 py-10 justify-center place-items-center mt-20">
//       <div className= "bg-white w-1/3 px-7 py-7 rounded-xl">
    
//         <form className="flex flex-col w-auto items-center" onSubmit={ResetPassword}>
//             <h1 className='px-3 font-extrabold mb-5 text-primarydark text-2xl '>Reset Password</h1>

//             <div className= "input">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
//                 <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clipRule="evenodd" />
//               </svg>                  
//               <input type ="password"  placeholder="Password" className="input-et" />
//             </div>

//             <div className= "input">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
//                 <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clipRule="evenodd" />
//               </svg>  
//               <input type ="password"  placeholder="Confirm Password" className="input-et" />
//             </div>

//             <div className="w-full py-4">
//               <button type="submit" className="primary w-full"> Submit </button>
//             </div>

//             <Link to={'/login'} className="flex gap-2 items-center text-primary py-2 px-4 bg-primarylight cursor-pointer ring-1 ring-primarylight rounded  hover:bg-primarydark hover:shadow-lg duration-75 hover:ring-primarydark hover:text-white">
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
//                 <path fillRule="evenodd" d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
//               </svg>

//               <button className=""> Back </button>

//             </Link>
//         </form>
        
//       </div>
//     </div>
//   )
// }
