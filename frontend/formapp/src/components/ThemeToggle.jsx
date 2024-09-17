import { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleToggle = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <button
      onClick={handleToggle}
      className="absolute top-3 right-60 p-2 rounded-full bg-gray-200 dark:bg-gray-900 "
      aria-label="Toggle theme"
    >
      {darkMode ? <FaSun className="text-yellow-500 text-xl " /> : <FaMoon className="text-blue-500 text-xl " />}
    </button>
  );
};

export default ThemeToggle;
