import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:8000/auth/users/login/', {
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
      localStorage.setItem('access_token', data.access_token);
      navigate('/');
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-950">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-zinc-900 shadow-lg rounded-xl">
        <h2 className="text-2xl font-bold text-center text-sky-500 dark:text-sky-500">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            {/* <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Employee ID</label> */}
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder='Employee ID'
              className="w-full px-3 py-2 text-sm bg-gray-200 dark:bg-zinc-950 rounded-md  dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
              required
            />
          </div>
          <div>
            {/* <label className="block text-sm font-medium text-gray-900 dark:text-gray-100">Password</label> */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password'
              className="w-full px-3 py-2 text-sm bg-gray-200 dark:bg-zinc-950 rounded-md dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-sky-600 rounded-md hover:bg-sky-400"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-900 dark:text-gray-100">
          Don't have an account? <a href="/register" className="text-sky-500 hover:text-sky-300">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
