import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';
import Input from '../components/Input';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Prefill from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('rememberedEmail');
    const storedPass = localStorage.getItem('rememberedpass');
    if (storedEmail) {
      setEmail(storedEmail);
      setPassword(storedPass);
      setRememberMe(true);
    }
  }, []);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return '';
    if (pwd.length < 6) return 'Weak';
    if (/[A-Z]/.test(pwd) && /\d/.test(pwd) && /[@$!%*?&#]/.test(pwd)) return 'Strong';
    return 'Medium';
  };

  // Validate fields
  const validateForm = () => {
    if (!email || !password) {
      setError('Both fields are required.');
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  // Login handler
  const loginUser = async (ev) => {
    ev.preventDefault();
    setError('');
    if (!validateForm()) return;
    setLoading(true);
    try {
      const { data } = await axios.post('/login', { email, password });
      setUser(data);
      toast.success('Login successful');
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedpass', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedpass');
      }
      navigate('/');
    } catch (e) {
      setError('Login failed. Please check your credentials.');
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-full lg:ml-24 px-10 py-10 justify-between place-items-center mt-20">
      <div className="bg-white w-full sm:w-full md:w-1/2 lg:w-1/3 px-7 py-7 rounded-xl">
        <form className="flex flex-col items-center" onSubmit={loginUser}>
          <h1 className="px-3 font-extrabold mb-5 text-primarydark text-2xl">Sign In</h1>

          {error && <div className="text-red-600 mb-4 text-sm">{error}</div>}

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            label="Email"
            required
          />

          <div className="w-full relative mt-4">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
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

          {/* Remember Me + Forgot */}
          <div className="flex w-full justify-between mt-4 px-1">
            <label className="flex gap-2 items-center">
              <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe((prev) => !prev)} />
              Remember Me
            </label>
            <Link to="/forgotpassword">Forgot Password?</Link>
          </div>

          {/* Submit */}
          <div className="w-full py-4">
            <button type="submit" className="primary w-full" disabled={loading}>
              {loading ? <Loader small /> : 'Sign In'}
            </button>
          </div>

          {/* Register Button */}
          <div className="w-full text-center mt-6">
            <span className="text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold">
                Sign Up
              </Link>
            </span>
          </div>

          {/* Back Button */}
          <Link to="/" className="mt-4">
            <button className="secondary flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z" clipRule="evenodd" />
              </svg>
              Back
            </button>
          </Link>
        </form>
      </div>

      {/* Right Box (Desktop only) */}
      <div className="hidden lg:flex flex-col right-box">
        <div className="flex flex-col -ml-96 gap-3">
          <div className="text-3xl font-black">Welcome to</div>
          <img src="../src/assets/EventHubLogo12.png" alt="Logo" className="w-48" />
        </div>
        <div className="-ml-48 w-80 mt-12">
          <img src="../src/assets/signinpic.svg" alt="Signin" className="w-full" />
        </div>
      </div>
    </div>
  );
}
