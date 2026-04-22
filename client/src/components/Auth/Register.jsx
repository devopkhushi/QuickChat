import React, { useState } from 'react';
import API from '../../api/api';
import { Link, useNavigate } from 'react-router-dom';

export default function Register({ onRegister }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      onRegister(res.data.user);
      nav('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={submit} className="auth-form">
        <h1>Create account</h1>
        <p>Start using QuickChat in a few seconds.</p>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Register'}</button>
        <span>Already have an account? <Link to="/login">Login</Link></span>
      </form>
    </div>
  );
}
