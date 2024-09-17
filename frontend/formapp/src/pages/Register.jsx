import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError(''); // Clear previous error if any

    const response = await fetch('http://localhost:8000/auth/users/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'employee_id': employeeId,
        'password': password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage(data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000); // Redirect after showing success message
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-950">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-zinc-900 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center text-sky-500 dark:text-sky-500">Register</h2>
        {message && <p className="text-green-500 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder='Employee ID'
              className="w-full px-3 py-2 text-sm bg-gray-200 dark:bg-zinc-950 rounded-md  dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
              required
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              className="w-full px-3 py-2 text-sm bg-gray-200 dark:bg-zinc-950 rounded-md dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            >
              {showPassword ? <FaEyeSlash className="text-gray-500 dark:text-gray-400" /> : <FaEye className="text-gray-500 dark:text-gray-400" />}
            </span>
          </div>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm Password'
              className="w-full px-3 py-2 text-sm bg-gray-200 dark:bg-zinc-950 rounded-md dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
              required
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            >
              {showConfirmPassword ? <FaEyeSlash className="text-gray-500 dark:text-gray-400" /> : <FaEye className="text-gray-500 dark:text-gray-400" />}
            </span>
          </div>
          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-2 text-white bg-sky-600 rounded-md hover:bg-sky-400"
          >
            Register
          </button>
        </form>
        <p className="text-center text-gray-900 dark:text-gray-100">
          Already have an account? 
          <a href="/login" className="px-2 text-sky-500 hover:text-sky-300 dark:text-sky-400 dark:hover:text-sky-300">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
