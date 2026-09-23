import React from 'react';
import ServiceCard from './ServiceCard';
import { FaComments, FaUserShield, FaBolt, FaBell, FaPalette, FaHeadset } from 'react-icons/fa';
import './Css/Services.css';

const servicesData = [
  {
    title: "Instant Room Chat",
    description: "Create and join chat rooms to connect with friends, teammates, and communities with zero registration.",
    icon: <FaComments />,
    features: [
      "Custom disposable room codes",
      "One-click shareable invite links",
      "Real-time synchronized messaging"
    ]
  },
  {
    title: "Low-Bandwidth & Offline Cache",
    description: "Built for patchy network conditions and low-data mobile packages across 2G, 3G, and 4G.",
    icon: <FaBolt />,
    features: [
      "Optimistic message delivery",
      "Automatic local storage caching",
      "Lite / Data Saver mode toggle"
    ]
  },
  {
    title: "Tactile Retro Design",
    description: "Enjoy a bold, joyful interface with high-contrast borders and tactile cards.",
    icon: <FaPalette />,
    features: [
      "Neo-Brutalist Pop design system",
      "Vibrant folder tabs and crisp shadows",
      "Clean, modern typography"
    ]
  },
  {
    title: "Privacy & Ephemeral Storage",
    description: "We respect user privacy by eliminating accounts, tracking cookies, and invasive sign-up barriers.",
    icon: <FaUserShield />,
    features: [
      "No email or password needed",
      "Local nickname storage only",
      "Encrypted Firestore data transport"
    ]
  },
  {
    title: "Instant Alerts & Quick Reactions",
    description: "Stay in sync with unobtrusive notifications and express yourself with single-tap emoji chips.",
    icon: <FaBell />,
    features: [
      "One-tap quick emoji reactions",
      "System connection status toasts",
      "Date grouped chat stream dividers"
    ]
  },
  {
    title: "Open Source & Community",
    description: "Developed and maintained by RubbySoft with transparent open-source code on GitHub.",
    icon: <FaHeadset />,
    features: [
      "Community contributions welcomed",
      "Clean modular React components",
      "Mobile-first responsive architecture"
    ]
  }
];

const Services = () => {
  return (
    <div className="services-container">
      <div className="services-header-card">
        <span className="pill-badge" style={{ marginBottom: '12px' }}>Platform Capabilities</span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '10px' }}>What Rubby Room Offers</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: '1.6' }}>
          Explore the features engineered to give you the fastest, most aesthetic disposable chat experience on the web.
        </p>
      </div>

      <div className="services-grid-layout">
        {servicesData.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            description={service.description}
            features={service.features}
            icon={service.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default Services;
