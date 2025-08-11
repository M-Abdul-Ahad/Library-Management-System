import AdminHeader from "../../components/admin/AdminHeader";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchQuickOverview,
  fetchRecentActivities,
  fetchRecentTransactions, 
} from "../../store/admin/dashboardSlice.js";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, quickOverview, activities, transactions, loading } = useSelector(
    (state) => state.dashboard
  );

  const pieData = [
    { name: "Available", value: quickOverview.availableBooks || 0 },
    { name: "Issued", value: quickOverview.issuedBooks || 0 },
    { name: "Overdue", value: quickOverview.overdueBooks || 0 },
  ];

  const pieColors = ["#34D399", "#3B82F6", "#F87171"]; 

  // Data for Library Usage pie chart
  const usageData = [
    { name: "Used", value: quickOverview.libraryUsage || 0 },
    { name: "Remaining", value: 100 - (quickOverview.libraryUsage || 0) },
  ];
  const usageColors = ["#3B82F6", "#E5E7EB"]; // Blue for used, light gray for remaining

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchQuickOverview());
    dispatch(fetchRecentActivities());
    dispatch(fetchRecentTransactions()); 
  }, [dispatch]);

  const statColors = [
    "from-blue-500 to-blue-600",
    "from-green-500 to-green-600",
    "from-yellow-500 to-yellow-600",
    "from-purple-500 to-purple-600",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <AdminHeader />

      <div className="max-w-7xl mx-auto p-6 space-y-10">
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Total Books",
              value: stats.totalBooks,
              change: "+12 this month",
            },
            {
              label: "Available Books",
              value: stats.availableBooks,
              change:
                stats.totalBooks > 0
                  ? `${Math.round((stats.availableBooks / stats.totalBooks) * 100)}% available`
                  : "—",
            },
            {
              label: "Issued Books",
              value: stats.issuedBooks,
              change:
                stats.totalBooks > 0
                  ? `${Math.round((stats.issuedBooks / stats.totalBooks) * 100)}% issued`
                  : "—",
            },
            {
              label: "Total Members",
              value: stats.totalMembers,
              change: "+23 this month",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`bg-gradient-to-r ${statColors[i]} text-white rounded-xl shadow-lg p-5 transform hover:scale-105 transition-transform duration-300`}
            >
              <p className="text-sm opacity-90">{item.label}</p>
              <h2 className="text-4xl font-bold mt-2">{item.value ?? "—"}</h2>
              <p className="text-xs mt-1 opacity-80">{item.change}</p>
            </div>
          ))}
        </div>

        {/* Activities + Quick Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-xl p-5 lg:col-span-2 hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              📜 Recent Activities
            </h3>
            <ul className="space-y-4">
              {activities.slice(0, 5).map((act, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: act.color }}
                  ></span>
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium">{act.text}</p>
                    <p className="text-xs text-gray-400">{act.date}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Overview */}
          <div className="bg-white rounded-xl shadow-xl p-5 hover:shadow-2xl transition-shadow duration-300 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
              📊 Quick Overview
            </h3>
            <ul className="space-y-3 w-full mb-6">
              <li className="flex justify-between text-sm">
                <span className="font-medium">Overdue Books</span>
                <span className="text-red-500 font-semibold">{quickOverview.overdueBooks}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="font-medium">Due Today</span>
                <span className="text-yellow-500 font-semibold">{quickOverview.dueToday}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="font-medium">New Members</span>
                <span className="text-green-500 font-semibold">{quickOverview.newMembers}</span>
              </li>
              <li className="flex justify-between text-sm">
                <span className="font-medium">Active Members</span>
                <span className="text-blue-500 font-semibold">{quickOverview.activeMembers}</span>
              </li>
            </ul>

            {/* Pie Chart for Library Usage */}
            <div style={{ width: 150, height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usageData}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270} // To make it clockwise from top
                  >
                    {usageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={usageColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center mt-[-110px] font-semibold text-xl text-blue-600">
                {quickOverview.libraryUsage || 0}%
              </div>
              <p className="text-center mt-2 text-gray-500 font-medium text-sm">Library Usage</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white rounded-xl shadow-xl p-5 hover:shadow-2xl transition-shadow duration-300">
  <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
    📚 Recent Transactions
  </h3>
  <div className="overflow-x-auto rounded-lg border border-gray-100">
    <table className="w-full text-sm text-left">
      <thead>
        <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
          <th className="px-4 py-3 font-semibold">#</th>
          <th className="px-4 py-3 font-semibold">Member</th>
          <th className="px-4 py-3 font-semibold">Book</th>
          <th className="px-4 py-3 font-semibold">Issue Date</th>
          <th className="px-4 py-3 font-semibold">Due Date</th>
          <th className="px-4 py-3 font-semibold">Return Date</th>
          <th className="px-4 py-3 font-semibold">Fine</th>
        </tr>
      </thead>
      <tbody>
        {transactions?.length > 0 ? (
          [...transactions]
            .sort((a, b) => b.TransactionID - a.TransactionID) // Sort descending
            .map((t, idx) => (
              <tr
                key={t.TransactionID}
                className={`border-b last:border-0 hover:bg-blue-50 transition-colors duration-200 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <td className="px-4 py-3 font-medium text-gray-600">
                  {t.TransactionID}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  <span className="font-medium">{t.Member?.MemberName}</span>{" "}
                  <span className="text-gray-500 text-xs">({t.MemberID})</span>
                </td>
                <td className="px-4 py-3 text-gray-800">
                  <span className="font-medium">{t.Book?.Title}</span>{" "}
                  <span className="text-gray-500 text-xs">({t.BookID})</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{t.IssueDate}</td>
                <td className="px-4 py-3 text-gray-600">{t.DueDate}</td>
                <td className="px-4 py-3 text-gray-600">
                  {t.ReturnDate || <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3 font-semibold">
                  {t.Fine > 0 ? (
                    <span className="text-red-500">${t.Fine}</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))
        ) : (
          <tr>
            <td colSpan="7" className="px-4 py-5 text-center text-gray-500">
              No transactions found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

      </div>
    </div>
  );
};

export default Dashboard;
