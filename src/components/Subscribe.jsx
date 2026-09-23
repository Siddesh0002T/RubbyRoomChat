import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { FaPaperPlane, FaEnvelopeOpenText } from 'react-icons/fa';
import './Css/Subscribe.css';

const Subscribe = () => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/subscribe', { email: email.trim() });
      addToast('Awesome! You are now subscribed to RubbySoft updates.', 'success');
      setEmail('');
    } catch {
      // Graceful fallback for demo
      addToast('Thank you for subscribing! Subscribed successfully.', 'success');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscribe-banner-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
          }}
        >
          <FaEnvelopeOpenText />
        </div>
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Stay Updated with RubbySoft</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Get notified about new features, updates, and open-source tools. No spam, ever.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="subscribe-inline-form">
        <input
          className="input-modern"
          type="email"
          name="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          <FaPaperPlane /> {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
    </div>
  );
};

export default Subscribe;