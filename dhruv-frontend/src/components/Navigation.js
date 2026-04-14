import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { MdDashboard, MdAssignment, MdGrade, MdAnalytics } from 'react-icons/md';

function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl">
            <MdAssignment size={24} />
            <span>Homework Hub</span>
          </Link>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {user?.role === 'student' && (
              <>
                <Link to="/student" className="hover:bg-blue-700 px-3 py-2 rounded flex items-center space-x-1">
                  <MdDashboard /> <span>Dashboard</span>
                </Link>
                <Link to="/grades" className="hover:bg-blue-700 px-3 py-2 rounded flex items-center space-x-1">
                  <MdGrade /> <span>Grades</span>
                </Link>
              </>
            )}

            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <>
                <Link to="/teacher" className="hover:bg-blue-700 px-3 py-2 rounded flex items-center space-x-1">
                  <MdDashboard /> <span>Dashboard</span>
                </Link>
                <Link to="/analytics" className="hover:bg-blue-700 px-3 py-2 rounded flex items-center space-x-1">
                  <MdAnalytics /> <span>Analytics</span>
                </Link>
              </>
            )}

            <div className="flex items-center space-x-3 border-l pl-6">
              <span className="text-sm">{user?.firstName} {user?.lastName}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded flex items-center space-x-1"
              >
                <FiLogOut /> <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {user?.role === 'student' && (
              <>
                <Link 
                  to="/student" 
                  className="block px-3 py-2 hover:bg-blue-700 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/grades" 
                  className="block px-3 py-2 hover:bg-blue-700 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Grades
                </Link>
              </>
            )}

            {(user?.role === 'teacher' || user?.role === 'admin') && (
              <>
                <Link 
                  to="/teacher" 
                  className="block px-3 py-2 hover:bg-blue-700 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/analytics" 
                  className="block px-3 py-2 hover:bg-blue-700 rounded"
                  onClick={() => setIsOpen(false)}
                >
                  Analytics
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 hover:bg-red-500 rounded flex items-center space-x-1"
            >
              <FiLogOut /> <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
