"use client"

import { FormEvent } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

function Login() {
  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
        
      }else{
        toast.error(data.message || 'Login Failed');
      }
      
      window.location.href = "/";
    } catch (error: any) {
      console.error('Error logging in:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to login');
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      
      <div className="w-[400px] px-5 py-6 bg-white rounded-md flex flex-col gap-7">
        <h1 className="font-medium uppercase text-3xl text-center tracking-widest">Login</h1>
        <div>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-5">
              <input
                className="py-3 px-3 border-2 border-gray-300"
                type="text"
                name="userid"
                placeholder="Enter UserID"
                required
              />
              <input
                className="py-3 px-3 border-2 border-gray-300"
                type="password"
                name="password"
                placeholder="Enter Password"
                required
              />
              <button className="bg-primary py-3 px-5 text-center text-white font-semibold border-none">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
