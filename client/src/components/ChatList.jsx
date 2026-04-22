import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../api/api';

export default function ChatList({ user }) {
  const [users, setUsers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (!user) return;
    API.get('/users')
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, [user]);

  if (!user) {
    return (
      <div className="sidebar empty-state">
        <h2>QuickChat</h2>
        <p>Please login first.</p>
      </div>
    );
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div>
          <h2>QuickChat</h2>
          <p>{user.name}</p>
        </div>
      </div>

      <div className="contact-list">
        {users.length === 0 ? (
          <p className="muted">No contacts found yet.</p>
        ) : (
          users.map((u) => {
            const active = location.pathname === `/chat/${u._id}`;
            return (
              <Link key={u._id} to={`/chat/${u._id}`} className={`contact-item ${active ? 'active' : ''}`}>
                <div className="avatar">{u.name?.[0]?.toUpperCase() || 'U'}</div>
                <div>
                  <strong>{u.name}</strong>
                  <p>{u.online ? 'Online' : 'Offline'}</p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </aside>
  );
}
