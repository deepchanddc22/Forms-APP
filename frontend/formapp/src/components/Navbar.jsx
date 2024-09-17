import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import ThemeToggle from './ThemeToggle'; // Adjust the path as necessary

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token'); // Handle logout logic
    navigate('/login'); // Redirect to login page
  };

  return (
    <nav className="relative z-10 bg-white dark:bg-zinc-900 shadow-md  shadow-sky-200 dark:shadow-md dark:shadow-sky-500 py-4 w-full">
      <div className="mx-4 flex justify-between items-center">
        {/* Form App (Aligned to the left) */}
        <div className="flex px-8 text-xl font-bold text-sky-500 dark:text-sky-500">
          <Link to="/">Form App</Link>
        </div>

        {/* Theme Toggle and Profile Icon in the same flex container aligned to the right */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <div className="relative">
            <button 
              onClick={toggleDropdown}
              className="text-blue-400"
              aria-label="Profile"
            >
              <FontAwesomeIcon icon={faUserCircle} className="text-2xl" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                <Link to="/profile" className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Profile
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="block w-full text-left px-4 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
