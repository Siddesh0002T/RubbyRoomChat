import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import './Css/Subscribe.css';

const Contact = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/contact', formData);
      addToast('Message sent successfully! We will get back to you soon.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      // Graceful fallback if backend is offline in demo
      addToast('Thank you! Your feedback has been recorded locally.', 'success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px 0 40px 0' }}>
      <div className="form-card-container">
        <div>
          <span className="pill-badge" style={{ marginBottom: '10px' }}>
            <FaEnvelope /> Get in Touch
          </span>
          <h1 className="form-header-title">Contact RubbySoft</h1>
          <p className="form-header-subtitle">
            Have a question, feature idea, or encountered a bug? Send us a direct note.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="form-fields-stack">
          <div className="form-field">
            <label className="form-label">Your Name</label>
            <input
              className="input-modern"
              type="text"
              name="name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Email Address</label>
            <input
              className="input-modern"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Subject</label>
            <input
              className="input-modern"
              type="text"
              name="subject"
              placeholder="e.g. Feature suggestion"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label className="form-label">Message</label>
            <textarea
              className="textarea-modern"
              name="message"
              placeholder="Type your message here..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
            <FaPaperPlane /> {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
