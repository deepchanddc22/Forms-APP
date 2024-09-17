import React from 'react';
import ThemeToggle from './ThemeToggle';

const Layout = ({ children }) => {
  return (
    <div>
      <header>
        <ThemeToggle />
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
