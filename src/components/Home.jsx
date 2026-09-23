import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Type from './Type';
import { useToast } from '../context/ToastContext';
import { FaComments, FaBolt, FaPalette, FaShieldAlt, FaUsers, FaArrowRight, FaGamepad, FaMusic, FaLaptopCode, FaBookOpen } from 'react-icons/fa';
import './Css/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [roomName, setRoomName] = useState('');

  const handleQuickJoin = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      addToast('Please enter your nickname', 'warning');
      return;
    }
    if (!roomName.trim()) {
      addToast('Please enter a room name', 'warning');
      return;
    }

    localStorage.setItem('username', username.trim());
    localStorage.setItem('roomName', roomName.trim());
    addToast(`Entering ${roomName.trim()}...`, 'success');
    navigate(`/chat?room=${encodeURIComponent(roomName.trim())}`);
  };

  const handleCategoryClick = (category) => {
    const currentUsername = username.trim() || localStorage.getItem('username');
    if (!currentUsername) {
      addToast('Please choose a username first!', 'warning');
      navigate('/start');
      return;
    }
    localStorage.setItem('roomName', category);
    navigate(`/chat?room=${encodeURIComponent(category)}`);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="pill-badge">
            <FaBolt /> Real-Time • No Signup • Free Forever
          </div>

          <h1 className="hero-headline">
            Instant Rooms. <br />
            <span className="hero-typewriter-highlight">
              <Type />
            </span>
          </h1>

          <p className="hero-subhead">
            Rubby Room Chat is built for instant, zero-friction communication. Create or join any chat room in seconds with custom share links, markdown formatting, syntax-highlighted code sharing, and a responsive Neo-Brutalist design that stays snappy on any network.
          </p>

          <div className="hero-stats-row">
            <div className="stat-item">
              <span className="stat-number">0s</span>
              <span className="stat-label">No Registration</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">0ms</span>
              <span className="stat-label">Local Cache Load</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Private & Ephemeral</span>
            </div>
          </div>
        </div>

        {/* Quick Join Card */}
        <div className="hero-join-card">
          <div className="join-card-header">
            <h2 className="join-card-title">
              <FaComments /> Quick Enter Room
            </h2>
            <p className="join-card-subtitle">
              Jump straight into a conversation in seconds.
            </p>
          </div>

          <form className="join-form" onSubmit={handleQuickJoin}>
            <div className="form-field">
              <label className="form-label">Your Nickname</label>
              <input
                type="text"
                className="input-modern"
                placeholder="e.g. Alex, NeonRider"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={24}
                required
              />
            </div>

            <div className="form-field">
              <label className="form-label">Room Name or Code</label>
              <input
                type="text"
                className="input-modern"
                placeholder="e.g. general, squad, crypto"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                maxLength={32}
                required
              />
            </div>

            <button type="submit" className="btn-primary join-submit-btn">
              Join or Create Room <FaArrowRight />
            </button>
          </form>
        </div>
      </section>

      {/* Bento Grid Features (Inspired by reference images) */}
      <section className="bento-section">
        <div className="section-header">
          <h2 className="section-title">Designed for Instant Flow</h2>
          <p className="section-subtitle">
            Built from the ground up for modern speed, responsive mobile-first feel, and playful aesthetics.
          </p>
        </div>

        <div className="bento-grid">
          {/* Card 1: Themes */}
          <div className="bento-card">
            <div className="bento-tab-header">
              <div className="bento-folder-tab" style={{ background: '#FFE500', color: '#121212' }}>
                <FaPalette />
              </div>
              <span className="bento-tag" style={{ background: 'rgba(255, 229, 0, 0.2)', color: 'var(--text-main)' }}>
                Visual Style
              </span>
            </div>
            <div>
              <h3 className="bento-title">Neo-Brutalist Design</h3>
              <p className="bento-desc">
                Tactile 2.5px solid borders, hard offset drop-shadows, and playful folder tabs inspired by modern retro design.
              </p>
            </div>
          </div>

          {/* Card 2: Low Speed Ready */}
          <div className="bento-card">
            <div className="bento-tab-header">
              <div className="bento-folder-tab" style={{ background: '#00D084', color: '#121212' }}>
                <FaBolt />
              </div>
              <span className="bento-tag" style={{ background: 'rgba(0, 208, 132, 0.2)', color: 'var(--text-main)' }}>
                High Performance
              </span>
            </div>
            <div>
              <h3 className="bento-title">Low-Speed Internet Ready</h3>
              <p className="bento-desc">
                Optimistic message sending, automatic local caching, and a Lite / Data Saver mode for spotty 2G/3G networks.
              </p>
            </div>
          </div>

          {/* Card 3: Privacy */}
          <div className="bento-card">
            <div className="bento-tab-header">
              <div className="bento-folder-tab" style={{ background: '#FF5C7C', color: '#ffffff' }}>
                <FaShieldAlt />
              </div>
              <span className="bento-tag" style={{ background: 'rgba(255, 92, 124, 0.2)', color: 'var(--text-main)' }}>
                Ephemeral
              </span>
            </div>
            <div>
              <h3 className="bento-title">Private & Disposable</h3>
              <p className="bento-desc">
                No passwords, no personal data harvesting. Create ad-hoc rooms for teams, friends, or study groups.
              </p>
            </div>
          </div>

          {/* Card 4: Wide Card */}
          <div className="bento-card span-2">
            <div className="bento-tab-header">
              <div className="bento-folder-tab" style={{ background: '#8C52FF', color: '#ffffff' }}>
                <FaUsers />
              </div>
              <span className="bento-tag" style={{ background: 'rgba(140, 82, 255, 0.2)', color: 'var(--text-main)' }}>
                One-Click Share
              </span>
            </div>
            <div>
              <h3 className="bento-title">Instant Shareable Invite Links</h3>
              <p className="bento-desc">
                Generate instant room links. Anyone with the URL can hop straight into the room in one tap, without downloading any app or setting up an account.
              </p>
            </div>
          </div>

          {/* Card 5: Rooms Hub */}
          <div className="bento-card">
            <div className="bento-tab-header">
              <div className="bento-folder-tab" style={{ background: '#3b82f6', color: '#ffffff' }}>
                <FaComments />
              </div>
              <Link to="/rooms" className="bento-tag" style={{ background: 'var(--primary-light)', color: 'var(--primary)', textDecoration: 'none' }}>
                Browse All →
              </Link>
            </div>
            <div>
              <h3 className="bento-title">Public Lobby</h3>
              <p className="bento-desc">
                Discover popular hubs like Gaming, Music, Tech Talk, and Study Lounge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Quick Rooms Section */}
      <section className="rooms-quick-section">
        <div className="section-header">
          <h2 className="section-title">Popular Room Hubs</h2>
          <p className="section-subtitle">
            Click any channel below to join instantly.
          </p>
        </div>

        <div className="quick-rooms-grid">
          <div className="quick-room-card" onClick={() => handleCategoryClick('Gaming')}>
            <span className="quick-room-icon" style={{ color: '#00D084' }}><FaGamepad /></span>
            <div className="quick-room-info">
              <span className="quick-room-name"># Gaming</span>
              <span className="quick-room-meta">Active Community</span>
            </div>
          </div>

          <div className="quick-room-card" onClick={() => handleCategoryClick('TechTalk')}>
            <span className="quick-room-icon" style={{ color: '#3b82f6' }}><FaLaptopCode /></span>
            <div className="quick-room-info">
              <span className="quick-room-name"># TechTalk</span>
              <span className="quick-room-meta">Code & Architecture</span>
            </div>
          </div>

          <div className="quick-room-card" onClick={() => handleCategoryClick('Music')}>
            <span className="quick-room-icon" style={{ color: '#FF5C7C' }}><FaMusic /></span>
            <div className="quick-room-info">
              <span className="quick-room-name"># Music</span>
              <span className="quick-room-meta">Beats & Vibes</span>
            </div>
          </div>

          <div className="quick-room-card" onClick={() => handleCategoryClick('Study')}>
            <span className="quick-room-icon" style={{ color: '#FFE500' }}><FaBookOpen /></span>
            <div className="quick-room-info">
              <span className="quick-room-name"># Study</span>
              <span className="quick-room-meta">Quiet & Focused</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;