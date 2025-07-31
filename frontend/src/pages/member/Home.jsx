// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-6">
      <div className="max-w-4xl bg-white p-10 rounded-3xl shadow-xl text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to SmartLibrary Portal
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Manage books, members, and transactions all in one place.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            to="/login"
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-xl hover:bg-gray-400 transition"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
