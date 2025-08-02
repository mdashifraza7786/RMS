"use client";

import { useState, FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { Bars } from 'react-loader-spinner';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

function Login() {
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const userid = formData.get('userid') as string;
      const password = formData.get('password') as string;
      
      const response = await axios.post('/api/login', {
        userid,
        password
      });

      const data = response.data;
      if(data.success){
        localStorage.setItem('user', data.userdata);
        toast.success(data.message);
        window.location.href = "/";
      }else{
        toast.error(data.message || 'Login Failed');
      }
      
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to login');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden animate-scaleIn">
        <div className="bg-primary text-white p-6 text-center">
          <h1 className="text-2xl font-bold tracking-wider">RESTAURANT MANAGEMENT SYSTEM</h1>
          <p className="mt-2 text-white/80">Sign in to your account</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="userid" className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="userid"
                  name="userid"
                  type="text"
                  required
                  className="pl-10 block w-full border border-gray-300 rounded-lg py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Enter your user ID"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-10 block w-full border border-gray-300 rounded-lg py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/80 focus:outline-none transition duration-150 ease-in-out"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Bars
                      height="22"
                      width="20"
                      color="white"
                      ariaLabel="bars-loading"
                      visible={true}
                    />
                    <span className="ml-2">Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <FaSignInAlt className="mr-2" />
                    Sign In
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />

      <style jsx global>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Login;