import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { emailRegister } from "../features/auth/authSlice";
import Footer from "./Footer";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });





  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(emailRegister(form));
      if (emailRegister.fulfilled.match(resultAction)) {
        
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
    }
  };















  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex flex-1">
        {/* Left side: Logo / visual */}
        <div className="hidden md:flex w-1/2 items-center justify-center">
          <h1 className="text-9xl font-extrabold text-blue-400">U</h1>
        </div>

        {/* Right side: Registration form */}
        <div className="flex flex-col w-full md:w-1/2 justify-center px-8">
          <h2 className="text-5xl font-bold mb-6">Create your account</h2>
          <h3 className="text-2xl font-semibold mb-8">Join UniFeed today.</h3>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="p-3 rounded-full bg-gray-800 text-white placeholder-gray-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="p-3 rounded-full bg-gray-800 text-white placeholder-gray-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="p-3 rounded-full bg-gray-800 text-white placeholder-gray-400"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full py-3 transition-colors"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>

          <p className="text-sm text-gray-400 mt-6 w-80">
            By signing up, you agree to the Terms of Service and Privacy Policy.
          </p>

          <div className="mt-6">
            <p className="text-lg font-semibold mb-3">Already have an account?</p>
            <Link
              to="/login"
              className="border border-gray-500 hover:bg-gray-800 text-white font-semibold rounded-full px-6 py-3 w-80 text-center inline-block"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
