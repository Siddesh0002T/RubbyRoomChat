import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { FaUserCircle, FaArrowRight } from 'react-icons/fa';
import './Css/ChatStartPage.css';

const AVATAR_OPTIONS = ['🦊', '⚡', '🚀', '🐱', '🤖', '🎮', '🔥', '💎'];

const ChatStartPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();

  const queryParams = new URLSearchParams(location.search);
  const redirectRoom = queryParams.get('room') || '';

  const [username, setUsername] = useState(() => localStorage.getItem('username') || '');
  const [selectedAvatar, setSelectedAvatar] = useState(() => localStorage.getItem('user_avatar') || '🦊');

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      addToast('Please enter a username!', 'warning');
      return;
    }

    localStorage.setItem('username', username.trim());
    localStorage.setItem('user_avatar', selectedAvatar);
    addToast(`Welcome, ${username.trim()}!`, 'success');

    if (redirectRoom) {
      navigate(`/chat?room=${encodeURIComponent(redirectRoom)}`);
    } else {
      navigate('/rooms');
    }
  };

  return (
    <div className="start-page-container">
      <div className="start-card">
        <div className="start-header">
          <h1 className="start-title">Set Your Profile</h1>
          <p className="start-subtitle">
            Choose how you'll appear in chat rooms. No email or password needed.
          </p>
        </div>

        <form onSubmit={handleUsernameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <div className="avatar-selector-title">Pick an Avatar</div>
            <div className="avatar-chips-row">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  className={`avatar-chip ${selectedAvatar === emoji ? 'active' : ''}`}
                  onClick={() => setSelectedAvatar(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaUserCircle /> Display Nickname
            </label>
            <input
              className="input-modern"
              type="text"
              placeholder="e.g. CyberSamurai, PixelCoder"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={24}
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem' }}>
            Continue to Chat <FaArrowRight />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatStartPage;
