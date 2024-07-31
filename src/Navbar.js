import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="website-name">Perspective</div>
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;