import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaInstagram, FaHeart } from 'react-icons/fa';
import './Css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand-col">
            <div className="footer-logo">
              Rubby<span>Room</span>
            </div>
            <p className="footer-description">
              High-speed, ephemeral chat rooms designed for real-time messaging, zero logins, and barrier-free communication across any network speed.
            </p>
            <div className="footer-status-pill">
              <span className="status-indicator-dot"></span>
              <span>All systems operational & low-bandwidth ready</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/">Home Landing</Link></li>
              <li><Link to="/rooms">Join / Create Room</Link></li>
              <li><Link to="/services">Capabilities</Link></li>
              <li><Link to="/about">About RubbySoft</Link></li>
            </ul>
          </div>

          {/* Legal / Social */}
          <div className="footer-social-col">
            <h4>Connect</h4>
            <p>Developed with passion by Siddhesh More.</p>
            <div className="social-icons-row">
              <a
                href="https://github.com/RubbySoft/rubby-room-chat"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                aria-label="GitHub Repository"
              >
                <FaGithub />
              </a>
              <a
                href="https://www.linkedin.com/in/siddhesh0002t"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://www.instagram.com/siddhesh0002t"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon-btn"
                aria-label="Instagram Profile"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-copy">
            &copy; {new Date().getFullYear()} <strong>RubbySoft</strong>. Built with <FaHeart className="heart-icon" /> for the open web.
          </p>
          <div className="footer-features-badges">
            <span className="badge-micro">⚡ Offline Ready</span>
            <span className="badge-micro">🔒 Encrypted Transport</span>
            <span className="badge-micro">🎨 Neo-Brutalist Pop</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
