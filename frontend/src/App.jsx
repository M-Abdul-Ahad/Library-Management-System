import { Routes, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/admin/Dashboard';
import MembersManagement from './pages/admin/MembersManagement';
import BooksManagement from './pages/admin/BooksManagement';
import MemberRequests from './pages/admin/MemberRequests';
import Home from './pages/member/Home';
import MemberBooks from './pages/member/MemberBooks';
import Account from './pages/member/Account';
import NotFound from './pages/NotFound'

import { loadUserFromToken } from './store/auth/memberAuthSlice';
import { loadAdminFromToken } from './store/auth/adminAuthSlice';


function App() {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.memberAuth);

  const isAuthenticated = !!token;

  useEffect(() => {
  dispatch(loadUserFromToken());
  dispatch(loadAdminFromToken());
}, [dispatch]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/members" element={<MembersManagement />} />
        <Route path="/admin/books" element={<BooksManagement />} />
        <Route path="/admin/requests" element={<MemberRequests />} />

        {/* Member Routes */}
        <Route path="/member/home" element={<Home />} />
        <Route path="/member/books" element={<MemberBooks />} />
        <Route path="/member/account" element={<Account />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </>
  );
}

export default App;
