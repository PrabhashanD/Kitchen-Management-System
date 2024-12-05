import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import logoImage from '../assets/OIP.png';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Ensure user is redirected if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true }); // Redirect to dashboard if token exists
    }
  }, []); // Run only once on component mount

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Both username and password are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token); // Store token in localStorage
        navigate('/dashboard', { replace: true }); // Redirect to dashboard
      } else {
        setError(data.message || 'Invalid username or password'); // Display backend error
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred while logging in. Please try again.');
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-blue-900">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* Header */}
        <header className="flex flex-col items-center justify-center mb-6">
          <img src={logoImage} alt="Logo" className="w-20 h-20 mb-4 rounded-full shadow-md" />
          <h1 className="text-2xl font-extrabold text-center text-gray-800">
            Kitchen Management System
          </h1>
        </header>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
          <FaSignInAlt className="inline-block mr-2" />
          Login
        </h2>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Username Field */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded mt-1">
              <FaUser className="text-gray-500 ml-2" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 pl-4 border-none rounded-r-lg"
                placeholder="Username"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded mt-1">
              <FaLock className="text-gray-500 ml-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 pl-4 border-none rounded-r-lg"
                placeholder="Password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 mr-2"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-500 hover:underline"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
