import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ token, handleLogout, isAdmin }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <nav>
        <ul>
          <li>
            <Link to="/">Portfolio</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          {token && (
            <li>
              <button onClick={toggleMenu} className="admin-menu-button">
                Admin Menu
              </button>
              {menuOpen && (
                <ul className="admin-dropdown">
                  <li>
                    <Link to="/add-project">Add Project</Link>
                  </li>
                  <li>
                    <Link to="/contact-form">Contact Form</Link>
                  </li>
                  <li>
                    <Link to="/about-form">About Us Form</Link>
                  </li>
                </ul>
              )}
            </li>
          )}
          {token && (
            <li>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
