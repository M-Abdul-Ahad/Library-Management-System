import AdminHeader from "../../components/admin/AdminHeader";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBorrowRequests,
  fetchReturnRequests,
  issueBook,
  rejectBorrowRequest,
  acceptBookReturn,
  fetchRequestsByStatus
} from "../../store/admin/requestsSlice.js";
import toast from 'react-hot-toast';

const MemberRequests = () => {
  const [activeTab, setActiveTab] = useState("borrow");
  const [statusFilter, setStatusFilter] = useState("pending");
  const dispatch = useDispatch();

  const {
    borrowRequests,
    returnRequests,
    requestsByStatus,
    loading,
    error
  } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchRequestsByStatus(statusFilter));
  }, [dispatch, statusFilter]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

 const handleAction = async (requestId, type, action) => {
  try {
    let result;
    if (action === "confirm") {
      if (type === "borrow") {
        result = await dispatch(issueBook(requestId)).unwrap();
        toast.success("Book issued successfully!");
      } else {
        result = await dispatch(acceptBookReturn(requestId)).unwrap();
        toast.success("Book returned successfully!");
      }
    } else if (action === "cancel" && type === "borrow") {
      result = await dispatch(rejectBorrowRequest(requestId)).unwrap();
      toast("Borrow request cancelled.");
    }
     dispatch(fetchRequestsByStatus(statusFilter));
  } catch (err) {
    toast.error(err?.message || "Something went wrong!");
  }
};

// Filter and sort requests
const requests =
  (requestsByStatus || [])
    .filter((req) => req.RequestType === activeTab)
    .sort((a, b) => a.RequestID - b.RequestID) || [];


  const typeColors = {
    borrow: "bg-green-100 text-green-700 border-green-300",
    return: "bg-yellow-100 text-yellow-700 border-yellow-300"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Member Requests</h1>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none"
          >
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleTabChange("borrow")}
            className={`px-4 py-2 rounded-lg font-semibold shadow ${
              activeTab === "borrow"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Borrow Requests
          </button>
          <button
            onClick={() => handleTabChange("return")}
            className={`px-4 py-2 rounded-lg font-semibold shadow ${
              activeTab === "return"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Return Requests
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {requests.length === 0 && !loading && !error && (
            <p className="text-gray-500">No requests found.</p>
          )}

         {requests.map((req) => (
            <div
              key={req.RequestID}
              className="relative flex items-center justify-between p-4 bg-white rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              {/* Request ID in top-right */}
              <span className="absolute top-2 right-3 text-xs text-gray-400 font-medium">
                ID: {req.RequestID}
              </span>

              {/* Left - Avatar + Details */}
              <div className="flex items-center gap-4">
                <img
                  src={req.avatar || "/images/default-avatar.png"}
                  alt={req.Member?.MemberName}
                  className="w-14 h-14 rounded-full object-cover shadow-sm"
                />
                <div>
                  <h2 className="font-semibold text-gray-900 text-lg">
                    {req.Member?.MemberName} 
                  </h2>
                  <p className="text-sm text-gray-500">
                    Request Date: {req.RequestDate}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    {req.Book?.Title} 
                  </p>
                  {req.DaysToBorrow && (
                    <p className="text-xs text-gray-500">
                      Days to Borrow: {req.DaysToBorrow}
                    </p>
                  )}
                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full border ${typeColors[req.RequestType] || ""}`}
                  >
                    {req.RequestType === "borrow"
                      ? "📚 Borrow Request"
                      : "🔄 Return Request"}
                  </span>
                </div>
              </div>

              {/* Right - Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleAction(req.RequestID, activeTab, "confirm")
                  }
                  className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg shadow-sm"
                >
                  {activeTab === "borrow" ? "Issue" : "Return"}
                </button>
                {activeTab === "borrow" && (
                  <button
                    onClick={() =>
                      handleAction(req.RequestID, activeTab, "cancel")
                    }
                    className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg shadow-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
};

export default MemberRequests;
