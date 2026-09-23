import React, { createContext, useContext, useState, useEffect } from 'react';

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [effectiveType, setEffectiveType] = useState('4g');
  const [dataSaver, setDataSaver] = useState(() => {
    return localStorage.getItem('rrc_data_saver') === 'true';
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const updateConnectionInfo = () => {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (conn) {
        if (conn.effectiveType) {
          setEffectiveType(conn.effectiveType);
          // Auto-enable data saver on 2G or slow connections if not explicitly set
          if ((conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') && localStorage.getItem('rrc_data_saver') === null) {
            setDataSaver(true);
          }
        }
      }
    };

    updateConnectionInfo();
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      conn.addEventListener('change', updateConnectionInfo);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (conn) {
        conn.removeEventListener('change', updateConnectionInfo);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('rrc_data_saver', dataSaver);
    if (dataSaver) {
      document.documentElement.classList.add('data-saver-mode');
    } else {
      document.documentElement.classList.remove('data-saver-mode');
    }
  }, [dataSaver]);

  const toggleDataSaver = () => {
    setDataSaver((prev) => !prev);
  };

  const isLowSpeed = effectiveType === '2g' || effectiveType === 'slow-2g' || !isOnline || dataSaver;

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        effectiveType,
        dataSaver,
        toggleDataSaver,
        isLowSpeed,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => useContext(NetworkContext);
