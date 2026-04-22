import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import { connectSocket, disconnectSocket } from './lib/socket';

function HomeLayout({ user, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    disconnectSocket();
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="layout-shell">
      <ChatList user={user} />
      <div className="content-shell">
        <header className="topbar">
          <span>Real-time chat application</span>
          <button onClick={logout}>Logout</button>
        </header>
        <Routes>
          <Route path="/" element={<div className="chat-panel center-panel">Select a contact to start chatting.</div>} />
          <Route path="/chat/:id" element={<ChatWindow user={user} />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (user && token) connectSocket(token);
    return () => disconnectSocket();
  }, [user]);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={setUser} />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register onRegister={setUser} />} />
      <Route path="/*" element={user ? <HomeLayout user={user} setUser={setUser} /> : <Navigate to="/login" replace />} />
    </Routes>
  );
}
