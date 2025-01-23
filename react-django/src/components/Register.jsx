import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axiosInstance from "../utils/axiosCon";
import { LoadingSpinner } from "./LoadingSpinner";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirm_password) {
      toast.error("All fields are required.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email format.");
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirm_password) {
      toast.error("Passwords don't match.");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("register/", { username, email, password, confirm_password });
      toast.success("Registration successful! Please login.");
      setError(null);
      navigate("/login");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
      setError(error.response?.data?.username || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full bg-white rounded-md shadow-md p-8">
      <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
        Create an Account
      </h2>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <p className="text-sm text-red-600 text-center bg-red-100 rounded p-2 mb-4">
            {error}
          </p>
        )}

        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-600">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-100 focus:border-indigo-500 text-gray-700"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-600">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-100 focus:border-indigo-500 text-gray-700"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-100 focus:border-indigo-500 text-gray-700"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-100 focus:border-indigo-500 text-gray-700"
            placeholder="Confirm your password"
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow hover:bg-indigo-700 transition duration-200"
        >
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-indigo-600 hover:text-indigo-700 font-medium transition"
        >
          Login here
        </Link>
      </p>
    </div>
  </div>
);
}

export default Register;
