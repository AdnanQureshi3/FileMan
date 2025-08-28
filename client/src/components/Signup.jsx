import { CloudUpload } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'

function Signup() {
  const [input, setInput] = useState({
    email: "",
    password: "",
    username: ""
  });
  const navigate = useNavigate();

  const ChangeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  async function signupHandler(e) {
    e.preventDefault(); // prevent page reload
    try {
      const res = await axios.post(`http://localhost:3000/api/user/register`, input, {
        headers: { "Content-Type": "application/json" }
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 p-4">
      <div className="flex w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden bg-white">
        
        {/* Left: Signup Form */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-8">
          <div className="w-full max-w-sm">
            <CloudUpload className="w-14 h-14 text-purple-600 mb-4 mx-auto" />
            <h2 className="text-center text-3xl font-bold mb-6 text-purple-700">Create Account</h2>
            
            <form className="space-y-5" onSubmit={signupHandler}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Username</label>
                <input 
                  id="name"
                  name="username"   
                  type="text" 
                  value={input.username}
                  onChange={ChangeEventHandler}
                  placeholder="John Doe" 
                  className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  id="email"
                  name="email"      
                  type="email" 
                  autoComplete="email"
                  value={input.email}
                  onChange={ChangeEventHandler}
                  placeholder="you@example.com" 
                  className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input 
                  id="password"
                  name="password"   
                  type="password" 
                  value={input.password}
                  onChange={ChangeEventHandler}
                  placeholder="••••••••" 
                  className="w-full border rounded-xl px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-purple-500" 
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-purple-600 text-white rounded-xl py-2.5 font-semibold hover:bg-purple-700 transition-colors"
              >
                Sign Up
              </button>
              <p className="text-sm text-center text-gray-600">
                Already have an account?{" "}
                <a href="/login" className="text-purple-600 font-medium hover:underline">Login</a>
              </p>
            </form>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="hidden md:flex w-[65%] bg-purple-50 items-center justify-center p-6">
          <img
            src='/themeImg.png'
            alt="File Sharing Illustration"
            className="w-full drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  )
}

export default Signup
