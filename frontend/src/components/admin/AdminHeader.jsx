import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/auth/adminAuthSlice";
import { useNavigate } from "react-router-dom";
import { FaBook, FaChevronDown } from "react-icons/fa";

const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin } = useSelector((state) => state.adminAuth);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-blue-900 text-white shadow-md">
      {/* Left - Logo */}
      <div className="flex items-center gap-2">
        <FaBook className="text-white text-lg" />
        <span className="font-bold text-white">LibraryMS</span>
        <span className="bg-blue-200 text-blue-900 text-xs font-bold px-2 py-1 rounded-full ml-2">Admin</span>
      </div>

      {/* Center - Navigation */}
      <nav className="flex items-center gap-6 text-sm text-blue-100">
        <a href="/admin/dashboard" className="hover:text-white transition">Dashboard</a>
        <a href="/admin/books" className="hover:text-white transition">Books</a>
        <a href="/admin/members" className="hover:text-white transition">Members</a>
        <a href="/admin/requests" className="hover:text-white transition">Requests</a>
      </nav>

      {/* Right - Profile */}
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-2 text-sm font-semibold focus:outline-none"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
       <img
          src="/images/admin-avatar.jpeg"
          alt="Admin Avatar"
          className="w-8 h-8 rounded-full shadow-sm object-cover"
        />

          <span>{admin?.email || "Admin"}</span>
          <FaChevronDown className="text-xs" />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-gray-700 rounded-md shadow-lg z-50">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-blue-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
