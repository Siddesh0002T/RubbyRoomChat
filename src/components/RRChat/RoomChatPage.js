import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { FaDoorOpen, FaRandom, FaGamepad, FaMusic, FaLaptopCode, FaBookOpen, FaFilm, FaCoffee } from 'react-icons/fa';
import './Css/RoomChatPage.css';

const DEFAULT_HUBS = [
  { id: 'Gaming', name: 'Gaming Zone', icon: <FaGamepad />, color: '#00D084' },
  { id: 'TechTalk', name: 'Tech & Code', icon: <FaLaptopCode />, color: '#3b82f6' },
  { id: 'Music', name: 'Music Lounge', icon: <FaMusic />, color: '#FF5C7C' },
  { id: 'Study', name: 'Study Session', icon: <FaBookOpen />, color: '#FFE500' },
  { id: 'Movies', name: 'Cinema & TV', icon: <FaFilm />, color: '#8C52FF' },
  { id: 'Chill', name: 'Coffee & Chill', icon: <FaCoffee />, color: '#f97316' },
];

const RoomChatPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('🦊');
  const [roomName, setRoomName] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedAvatar = localStorage.getItem('user_avatar') || '🦊';
    if (!storedUsername) {
      navigate('/start');
    } else {
      setUsername(storedUsername);
      setAvatar(storedAvatar);
    }
  }, [navigate]);

  const handleRoomSubmit = (e) => {
    e.preventDefault();
    if (!roomName.trim()) {
      addToast('Please enter a room name!', 'warning');
      return;
    }

    const cleanRoom = roomName.trim();
    localStorage.setItem('roomName', cleanRoom);
    navigate(`/chat?room=${encodeURIComponent(cleanRoom)}`);
  };

  const handleJoinHub = (hubId) => {
    localStorage.setItem('roomName', hubId);
    navigate(`/chat?room=${encodeURIComponent(hubId)}`);
  };

  const generateRandomRoom = () => {
    const prefixes = ['nexus', 'vibe', 'squad', 'orbit', 'cyber', 'room'];
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const generated = `${randomPrefix}-${randomNum}`;
    setRoomName(generated);
    addToast(`Generated: ${generated}`, 'info');
  };

  return (
    <div className="room-page-layout">
      {/* Profile banner */}
      <div className="profile-banner-card">
        <div className="profile-identity">
          <div className="profile-avatar-circle">{avatar}</div>
          <div className="profile-text-info">
            <h3>{username}</h3>
            <span>Online & Ready to Connect</span>
          </div>
        </div>
        <Link to="/start" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          Change Nickname / Avatar
        </Link>
      </div>

      <div className="room-creation-grid">
        {/* Custom Room Entry Box */}
        <div className="room-box">
          <h2 className="room-box-title">
            <FaDoorOpen /> Join or Create Room
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Enter any room name. If it exists, you'll join existing participants; if not, a new private room is created instantly.
          </p>

          <form onSubmit={handleRoomSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-field">
              <label className="form-label">Room Identifier</label>
              <input
                className="input-modern"
                type="text"
                placeholder="e.g. project-x, weekend-hangout"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                maxLength={36}
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                Enter Room
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={generateRandomRoom}
                title="Generate Random Room Name"
              >
                <FaRandom /> Random
              </button>
            </div>
          </form>
        </div>

        {/* Popular Hubs Box */}
        <div className="room-box">
          <h2 className="room-box-title">Popular Community Hubs</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Jump into our featured topic rooms:
          </p>

          <div className="hub-cards-container">
            {DEFAULT_HUBS.map((hub) => (
              <div key={hub.id} className="hub-card-item" onClick={() => handleJoinHub(hub.id)}>
                <span style={{ fontSize: '1.2rem', color: hub.color }}>{hub.icon}</span>
                <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{hub.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomChatPage;
