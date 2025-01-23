import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { login, clearUser } from "../store/authSlice"; // Assuming `login` and `clearUser` are in authSlice

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearUser());
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex for email validation
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Invalid email format.");
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap(); // Ensure Redux action returns a promise
      toast.success("Logged in successfully!");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed: " + (err.message || "Unknown error."));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-md shadow-md p-8">
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
          Login to Your Account
        </h2>
  
        {error && (
          <p className="text-sm text-red-600 text-center bg-red-100 rounded p-2 mb-4">
            {error}
          </p>
        )}
  
        <form className="space-y-6" onSubmit={handleSubmit}>
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
  
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-medium rounded-md shadow hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
        </form>
  
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-700 font-medium transition"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
  
};

export default Login;
