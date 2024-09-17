// src/pages/Home.js
import React from 'react';
import Navbar from '../components/Navbar'; // Import Navbar

const Home = ({ darkMode, handleToggle }) => {
  return (
    <>
      {/* Include Navbar at the top of the Home page */}
      <Navbar darkMode={darkMode} handleToggle={handleToggle} />
      
      <div className="flex items-center bg-grey-100  dark:bg-zinc-950 justify-center h-screen">
        <h1 className="text-4xl font-bold text-sky-600 dark:text-sky-500">
          Welcome to the Home Page!
        </h1>
      </div>
    </>
  );
};

export default Home;
