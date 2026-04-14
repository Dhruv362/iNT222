import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdAssignment } from 'react-icons/md';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      if (response.user.role === 'student') {
        navigate('/student');
      } else {
        navigate('/teacher');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 w-96">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-blue-600 text-white p-3 rounded-full">
            <MdAssignment size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Homework Hub</h1>
        <p className="text-center text-gray-600 mb-8">Smart Learning Platform</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">Don't have an account?</p>
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-bold">
            Register here
          </Link>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm font-bold text-gray-700 mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-600 mb-1">
            <strong>Teacher:</strong> jane.smith@university.edu
          </p>
          <p className="text-xs text-gray-600">
            <strong>Student:</strong> john.doe@student.edu
          </p>
          <p className="text-xs text-gray-600">
            Password: password123
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
