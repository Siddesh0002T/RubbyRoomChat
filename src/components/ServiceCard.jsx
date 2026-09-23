import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const ServiceCard = ({ title, description, features, icon }) => (
  <div className="service-card-modern">
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {icon && <span style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>{icon}</span>}
      <h3 className="service-card-title">{title}</h3>
    </div>
    <p className="service-card-desc">{description}</p>
    <ul className="service-features-list">
      {features.map((feature, index) => (
        <li key={index} className="service-feature-item">
          <FaCheckCircle className="service-check-icon" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default ServiceCard;
