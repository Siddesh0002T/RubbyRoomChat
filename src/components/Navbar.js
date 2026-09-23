import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useNetwork } from '../context/NetworkContext';
import { FaBolt, FaBars, FaTimes, FaComments, FaSun, FaMoon } from 'react-icons/fa';
import './Css/Navbar.css';

const Navbar = () => {
  const { isDark, toggleMode } = useTheme();
  const { dataSaver, toggleDataSaver } = useNetwork();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <div className="brand-icon-box">
            <FaComments />
          </div>
          <span className="brand-name">
            Rubby<span>Room</span>
          </span>
          <span className="brand-badge">PRO</span>
        </Link>

        {/* Navigation Links */}
        <nav className={`navbar-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/rooms" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Chat Rooms
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Features
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            Contact
          </NavLink>
        </nav>

        {/* Actions: Animated Dark Mode Toggle & Data Saver */}
        <div className="navbar-actions">
          {/* Animated Dark/Light Mode Switcher */}
          <button
            className={`theme-mode-toggle-btn ${isDark ? 'dark-active' : ''}`}
            onClick={(e) => toggleMode(e)}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark Mode"
          >
            <div className="toggle-track">
              <span className="toggle-icon toggle-sun">
                <FaSun />
              </span>
              <span className="toggle-icon toggle-moon">
                <FaMoon />
              </span>
              <div className="toggle-thumb">
                {isDark ? <FaMoon className="thumb-icon" /> : <FaSun className="thumb-icon" />}
              </div>
            </div>
          </button>

          {/* Data Saver / Low-speed Mode Toggle */}
          <button
            className={`action-btn-pill ${dataSaver ? 'active-saver' : ''}`}
            onClick={toggleDataSaver}
            title={dataSaver ? "Data Saver: ON (Lite Mode)" : "Toggle Data Saver (Lite Mode for slow internet)"}
            aria-label="Toggle Data Saver"
          >
            <FaBolt className="btn-icon" />
            <span className="action-btn-text">{dataSaver ? 'Lite Mode' : 'Data Saver'}</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
