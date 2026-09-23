import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConfig';
import { collection, addDoc, serverTimestamp, query, onSnapshot, orderBy } from 'firebase/firestore';
import { useNetwork } from '../../context/NetworkContext';
import { useToast } from '../../context/ToastContext';
import { FaPaperPlane, FaShareAlt, FaArrowLeft, FaBolt, FaComments, FaCheck, FaCheckDouble } from 'react-icons/fa';
import './Css/CR.css';

const QUICK_EMOJIS = ['👋', '🔥', '❤️', '👍', '😂', '🚀', '🎉', '💯'];

const ChatRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { isOnline, dataSaver, toggleDataSaver } = useNetwork();
  const messagesEndRef = useRef(null);

  // Retrieve room name and username
  const queryParams = new URLSearchParams(location.search);
  const roomName = queryParams.get('room') || localStorage.getItem('roomName') || 'general';
  const username = localStorage.getItem('username') || '';
  const avatar = localStorage.getItem('user_avatar') || '🦊';

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(() => {
    // 1. Instant Cache Load for Low Speed / Offline
    try {
      const cached = localStorage.getItem(`rrc_cache_${roomName}`);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  // Check if username is set
  useEffect(() => {
    if (!username) {
      addToast('Please pick a nickname to join this room!', 'info');
      navigate(`/start?room=${encodeURIComponent(roomName)}`);
    }
  }, [username, roomName, navigate, addToast]);

  // Firestore Real-time Listener & Local Cache Sync
  useEffect(() => {
    if (!roomName) return;

    try {
      const messagesRef = collection(db, 'rooms', roomName, 'messages');
      const q = query(messagesRef, orderBy('timestamp'));

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const msgs = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            msgs.push({
              id: doc.id,
              text: data.text,
              username: data.username || 'Anonymous',
              avatar: data.avatar || '💬',
              timestamp: data.timestamp ? data.timestamp.toDate().toISOString() : new Date().toISOString(),
              status: 'delivered',
            });
          });

          setMessages(msgs);
          // Save to local cache for 0ms loads next time
          try {
            localStorage.setItem(`rrc_cache_${roomName}`, JSON.stringify(msgs.slice(-100)));
          } catch (e) {
            console.warn('Failed to cache messages to localStorage:', e);
          }
        },
        (error) => {
          console.warn('Firestore snapshot error (using offline cache):', error);
          addToast('Working offline or on slow network. Using cached messages.', 'warning');
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore subscription failed:', err);
    }
  }, [roomName, addToast]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: dataSaver ? 'auto' : 'smooth' });
  }, [messages, dataSaver]);

  // Send Message with Optimistic UI
  const handleSendMessage = async (textToSend) => {
    const content = (textToSend || message).trim();
    if (!content || !roomName) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      text: content,
      username: username,
      avatar: avatar,
      timestamp: new Date().toISOString(),
      status: 'sending',
    };

    // Optimistic insert into UI immediately!
    setMessages((prev) => [...prev, optimisticMsg]);
    if (!textToSend) setMessage('');

    try {
      const messagesRef = collection(db, 'rooms', roomName, 'messages');
      await addDoc(messagesRef, {
        text: content,
        timestamp: serverTimestamp(),
        username: username,
        avatar: avatar,
      });

      // Update status to delivered once Firestore confirms
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: 'delivered' } : m))
      );
    } catch (e) {
      console.error('Error sending message:', e);
      addToast('Message queued locally. Will send when connection improves.', 'warning');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyInviteLink = () => {
    const inviteUrl = `${window.location.origin}/chat?room=${encodeURIComponent(roomName)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl);
      addToast('Invite link copied to clipboard! Share it with friends.', 'success');
    } else {
      addToast(`Share link: ${inviteUrl}`, 'info');
    }
  };

  const formatDateHeader = (isoDate) => {
    if (!isoDate) return 'Today';
    const date = new Date(isoDate);
    const today = new Date();
    if (today.toDateString() === date.toDateString()) {
      return 'Today';
    }
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (yesterday.toDateString() === date.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (isoDate) => {
    if (!isoDate) return '';
    try {
      return new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = formatDateHeader(msg.timestamp);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {});

  return (
    <div className="chat-window">
      {/* Header Bar */}
      <div className="chat-header-bar">
        <div className="chat-header-left">
          <button
            className="btn-header-action"
            onClick={() => navigate('/rooms')}
            title="Leave Room & Back to Lobby"
            aria-label="Back to Lobby"
          >
            <FaArrowLeft />
          </button>

          <div className="chat-room-avatar-badge">
            #{roomName.charAt(0).toUpperCase()}
          </div>

          <div className="chat-room-title-info">
            <div className="chat-room-name">
              <span>#{roomName}</span>
            </div>
            <div className="chat-status-indicator">
              <span className={isOnline ? 'status-dot-live' : 'status-dot-offline'}></span>
              <span>{isOnline ? 'Live Room' : 'Offline'}</span>
              <span>• {messages.length} msgs</span>
            </div>
          </div>
        </div>

        <div className="chat-header-actions">
          <button
            className={`btn-header-action ${dataSaver ? 'active-saver' : ''}`}
            onClick={toggleDataSaver}
            title={dataSaver ? "Data Saver: ON" : "Toggle Data Saver"}
            aria-label="Toggle Data Saver"
          >
            <FaBolt />
          </button>

          <button
            className="btn-primary"
            onClick={copyInviteLink}
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
            title="Copy One-Click Room Invite Link"
          >
            <FaShareAlt /> <span className="share-link-text">Share Link</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="messages-stream-container">
        {messages.length === 0 ? (
          <div className="empty-chat-placeholder">
            <FaComments className="empty-chat-icon" />
            <h3>No messages in #{roomName} yet</h3>
            <p>Be the first to say hello or click a quick reaction below!</p>
          </div>
        ) : (
          Object.keys(groupedMessages).map((date) => (
            <React.Fragment key={date}>
              <div className="date-divider-row">
                <span className="date-divider-pill">{date}</span>
              </div>

              {groupedMessages[date].map((msg) => {
                const isMe = msg.username === username;
                return (
                  <div key={msg.id} className={`message-row ${isMe ? 'me' : 'other'}`}>
                    <div className="message-avatar-bubble">
                      {msg.avatar || (msg.username ? msg.username.charAt(0).toUpperCase() : '?')}
                    </div>

                    <div className="message-bubble-body">
                      {!isMe && <div className="message-author-tag">{msg.username}</div>}
                      <div className="message-text-content">{msg.text}</div>
                      <div className="message-meta-footer">
                        <span>{formatMessageTime(msg.timestamp)}</span>
                        {isMe && (
                          <span>
                            {msg.status === 'sending' ? (
                              <FaCheck style={{ opacity: 0.5 }} />
                            ) : (
                              <FaCheckDouble style={{ color: 'var(--success)' }} />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reactions Bar */}
      <div className="quick-reactions-bar">
        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>Quick:</span>
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            className="quick-emoji-chip"
            onClick={() => handleSendMessage(emoji)}
            title={`Send ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <form
        className="chat-input-area"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <input
          type="text"
          className="chat-input-box"
          placeholder={`Message #${roomName}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={1000}
        />
        <button
          type="submit"
          className="btn-send-message"
          disabled={!message.trim()}
          aria-label="Send message"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
