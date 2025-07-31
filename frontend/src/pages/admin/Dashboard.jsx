// src/pages/Dashboard.jsx
import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Books</h2>
            <p className="text-gray-500 text-sm">Manage and view books.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Members</h2>
            <p className="text-gray-500 text-sm">View and manage members.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Transactions</h2>
            <p className="text-gray-500 text-sm">Issue and return books.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
