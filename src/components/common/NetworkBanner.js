import React from 'react';
import { useNetwork } from '../../context/NetworkContext';

const NetworkBanner = () => {
  const { isOnline, effectiveType, dataSaver, toggleDataSaver } = useNetwork();

  if (isOnline && effectiveType !== '2g' && effectiveType !== 'slow-2g' && !dataSaver) {
    return null;
  }

  return (
    <div className={`network-banner ${!isOnline ? 'offline' : ''}`}>
      {!isOnline ? (
        <span>🔴 You are offline. Messages will queue and sync when reconnected.</span>
      ) : (
        <span>
          ⚡ {dataSaver ? 'Lite / Data Saver Mode Active' : `Slow Connection (${effectiveType.toUpperCase()}) Detected`} — animations & heavy blurs optimized.
        </span>
      )}
      <button
        onClick={toggleDataSaver}
        style={{
          marginLeft: '12px',
          padding: '2px 8px',
          fontSize: '0.75rem',
          borderRadius: '4px',
          border: '1px solid currentColor',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        {dataSaver ? 'Turn Off Lite' : 'Force Lite Mode'}
      </button>
    </div>
  );
};

export default NetworkBanner;
