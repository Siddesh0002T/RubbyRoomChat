import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { NetworkProvider } from './context/NetworkContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Footer from './components/Footer';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import ChatStartPage from './components/RRChat/ChatStartPage';
import RoomChatPage from './components/RRChat/RoomChatPage';
import ChatRoom from './components/RRChat/ChatRoom';
import NetworkBanner from './components/common/NetworkBanner';

function AppContent() {
  const location = useLocation();
  const isChatRoom = location.pathname.toLowerCase().startsWith('/chat');

  return (
    <div className={`app-layout ${isChatRoom ? 'chat-app-mode' : ''}`}>
      <NetworkBanner />

      {/* On mobile in chat room, hide website navbar so chat room header becomes the native mobile app header */}
      <div className={isChatRoom ? 'desktop-only-header' : ''}>
        <Navbar />
      </div>

      <main className={`main-content ${isChatRoom ? 'main-content-chat' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/About" element={<Navigate to="/about" replace />} />
          <Route path="/services" element={<Services />} />
          <Route path="/Services" element={<Navigate to="/services" replace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Contact" element={<Navigate to="/contact" replace />} />
          <Route path="/start" element={<ChatStartPage />} />
          <Route path="/ChatStartPage" element={<Navigate to="/start" replace />} />
          <Route path="/rooms" element={<RoomChatPage />} />
          <Route path="/RoomChatPage" element={<Navigate to="/rooms" replace />} />
          <Route path="/chat" element={<ChatRoom />} />
          <Route path="/ChatRoom" element={<Navigate to="/chat" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Hide footer inside active chat room on all mobile viewports */}
      <div className={isChatRoom ? 'desktop-only-footer' : ''}>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NetworkProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ToastProvider>
      </NetworkProvider>
    </ThemeProvider>
  );
}

export default App;