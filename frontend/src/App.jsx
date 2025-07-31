import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/admin/Dashboard';
import Home from './pages/member/Home';

function App() {

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />

      {/* Admin Routes */}
      <Route path="/dashboard" element={<Dashboard/>} />
      

      {/* Member Routes */}
      <Route path="/home" element={<Home/>} />
    </Routes>
  )
}

export default App
