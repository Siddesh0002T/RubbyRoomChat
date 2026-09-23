import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaGlobe, FaRocket } from 'react-icons/fa';
import Subscribe from './Subscribe';
import './Css/About.css';

const About = () => {
  return (
    <div className="about-page-layout">
      {/* Brand Hero */}
      <div className="about-hero-card">
        <span className="pill-badge" style={{ alignSelf: 'flex-start' }}>
          <FaRocket /> The Story
        </span>
        <h1 className="about-hero-title">About Rubby Room Chat</h1>
        <p className="about-hero-text">
          Rubby Room Chat is built with a singular mission: to make digital communication frictionless, lightweight, and fun. You don’t need an account, password, phone number, or verification email to chat with friends, colleagues, or communities.
        </p>
        <p className="about-hero-text">
          Engineered for real-world conditions, Rubby Room Chat operates smoothly even on spotty 2G/3G mobile data connections through intelligent local caching and low-bandwidth optimizations.
        </p>
      </div>

      {/* Developer Section */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '20px' }}>
          About the Developer
        </h2>

        <div className="developers-grid">
          {/* Siddhesh More */}
          <div className="developer-card">
            <div className="developer-header">
              <div className="developer-avatar">SM</div>
              <div>
                <h3 className="developer-name">Siddhesh More</h3>
                <span className="developer-role">Full Stack Web Developer • RubbySoft</span>
              </div>
            </div>
            <p className="developer-bio">
              Passionate full-stack developer with expertise in modern React architectures, real-time web applications, and cyber aesthetic UI design.
            </p>
            <ul className="developer-links-list">
              <li>
                <a href="https://siddhuu.vercel.app/" target="_blank" rel="noopener noreferrer">
                  <FaGlobe style={{ color: 'var(--primary)' }} /> Portfolio: siddhesh0002t.com
                </a>
              </li>
              <li>
                <a href="mailto:siddeshmore145@gmail.com">
                  <FaEnvelope style={{ color: 'var(--accent)' }} /> siddeshmore145@gmail.com
                </a>
              </li>
              <li>
                <a href="https://github.com/siddesh0002t" target="_blank" rel="noopener noreferrer">
                  <FaGithub /> GitHub: Siddesh0002T
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/siddhesh0002t" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin style={{ color: '#0a66c2' }} /> LinkedIn: siddhesh0002t
                </a>
              </li>
              <li>
                <a href="https://instagram.com/siddhesh0002t" target="_blank" rel="noopener noreferrer">
                  <FaInstagram style={{ color: '#e1306c' }} /> Instagram: @siddhesh0002t
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Subscribe */}
      <Subscribe />
    </div>
  );
};

export default About;
