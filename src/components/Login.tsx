"use client";

import { useState, FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';
import { MdOutlineRestaurantMenu } from 'react-icons/md';

function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      const userid = formData.get('userid') as string;
      const password = formData.get('password') as string;

      const response = await axios.post('/api/login', { userid, password });
      const data = response.data;

      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data));
        toast.success('Login successful');
        window.location.href = '/';
      } else {
        toast.error(data.message || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-16 relative overflow-hidden">
        {/* Decorative background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span
            className="font-display font-bold text-white/[0.04] leading-none"
            style={{ fontSize: 'clamp(80px, 18vw, 220px)', whiteSpace: 'nowrap' }}
          >
            RMS
          </span>
        </div>

        {/* Subtle accent circles */}
        <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-80px] left-[-80px] w-64 h-64 bg-white/5 rounded-full" />

        <div className="relative z-10 text-white space-y-8 max-w-sm">
          {/* Logo mark */}
          <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center">
            <MdOutlineRestaurantMenu className="text-white text-3xl" />
          </div>

          {/* Staggered brand name */}
          <div>
            <p className="text-white/50 text-xs uppercase tracking-[0.3em] mb-3 font-medium">
              Point of Sale
            </p>
            <h1 className="font-display font-bold leading-[1.1]" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
              Restaurant
            </h1>
            <h1 className="font-display font-bold leading-[1.1] text-white/70" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
              Management
            </h1>
            <h1 className="font-display font-bold leading-[1.1] text-white/40" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
              System
            </h1>
          </div>

          <div className="space-y-3 text-white/50 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-white/40" />
              <span>Order & table management</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-white/40" />
              <span>Real-time kitchen queue</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-white/40" />
              <span>Revenue & inventory tracking</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8 animate-slide-up">
          {/* Mobile brand */}
          <div className="lg:hidden text-center">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MdOutlineRestaurantMenu className="text-white text-2xl" />
            </div>
            <h1 className="font-display text-2xl font-bold text-gray-900">Restaurant Management</h1>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-gray-900">Sign in</h2>
            <p className="text-gray-400 text-sm mt-1.5">Enter your credentials to access the system</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="userid" className="block text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">
                User ID
              </label>
              <div
                className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 transition-all duration-150 ${
                  focusedField === 'userid'
                    ? 'border-primary ring-2 ring-primary/15'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FaUser
                  size={13}
                  className={`flex-shrink-0 transition-colors duration-150 ${
                    focusedField === 'userid' ? 'text-primary' : 'text-gray-300'
                  }`}
                />
                <input
                  id="userid"
                  name="userid"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Enter your user ID"
                  onFocus={() => setFocusedField('userid')}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-300 text-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-widest text-gray-400 font-medium mb-2">
                Password
              </label>
              <div
                className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 transition-all duration-150 ${
                  focusedField === 'password'
                    ? 'border-primary ring-2 ring-primary/15'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FaLock
                  size={13}
                  className={`flex-shrink-0 transition-colors duration-150 ${
                    focusedField === 'password' ? 'text-primary' : 'text-gray-300'
                  }`}
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-300 text-sm outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primaryhover text-white font-semibold py-3.5 rounded-xl transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2 group"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <FaArrowRight size={12} className="transition-transform duration-150 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-300 text-xs tracking-wide">
            Authorised personnel only
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}

export default Login;
