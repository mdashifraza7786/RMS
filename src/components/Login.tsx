"use client";

import { useState, FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { signIn } from "next-auth/react";
import { FaUser, FaLock, FaArrowRight } from 'react-icons/fa';

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

      const result = await signIn('credentials', {
        userid,
        password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success('Login successful');
        window.location.href = '/';
      } else {
        toast.error(result?.error === 'CredentialsSignin' ? 'Invalid user ID or password' : 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col items-center justify-center p-16 relative overflow-hidden">
        {/* Subtle pattern circles */}
        <div className="absolute top-[-80px] right-[-80px] w-72 h-72 bg-white/5 rounded-full" />
        <div className="absolute bottom-[-60px] left-[-60px] w-56 h-56 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.03] rounded-full" />

        <div className="relative z-10 text-center text-white space-y-6 max-w-sm">
          <div className="w-20 h-20 bg-white/15 rounded-3xl flex items-center justify-center mx-auto">
            <span className="text-4xl font-black tracking-tighter">R</span>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Restaurant</h1>
            <h1 className="text-4xl font-black tracking-tight opacity-70">Management</h1>
            <h1 className="text-4xl font-black tracking-tight opacity-40">System</h1>
          </div>
          <p className="text-white/60 text-sm leading-relaxed">
            Manage orders, staff, inventory, and finances — all in one place.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile brand */}
          <div className="lg:hidden text-center">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-black text-white">R</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Restaurant Management</h1>
          </div>

          {/* Heading */}
          <div className="lg:pt-0">
            <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
            <p className="text-gray-500 text-sm mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* User ID */}
            <div>
              <label htmlFor="userid" className="block text-sm font-medium text-gray-700 mb-1.5">
                User ID
              </label>
              <div
                className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-all duration-150 ${
                  focusedField === 'userid'
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FaUser
                  size={13}
                  className={`flex-shrink-0 transition-colors duration-150 ${
                    focusedField === 'userid' ? 'text-primary' : 'text-gray-400'
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
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 text-sm outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div
                className={`flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-all duration-150 ${
                  focusedField === 'password'
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <FaLock
                  size={13}
                  className={`flex-shrink-0 transition-colors duration-150 ${
                    focusedField === 'password' ? 'text-primary' : 'text-gray-400'
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
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-400 text-sm outline-none"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2 group"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <FaArrowRight size={12} className="transition-transform duration-150 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs">
            Authorised personnel only
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </div>
  );
}

export default Login;
