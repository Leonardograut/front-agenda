import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { login } from '../services/authService';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [statusClass, setStatusClass] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setStatusClass('');
    setLoading(true);

    try {
      const { token, userName } = await login(email, password);
      if (token) {
        localStorage.setItem('authToken', token);
      }
      if (userName) {
        localStorage.setItem('userName', userName);
      }
      setStatusClass('success');
      setTimeout(() => navigate('/atividades'), 1200);
    } catch (err) {
      setMessage('Erro: ' + (err.message || err));
      setStatusClass('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Entrar</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div id="message" className={`message ${statusClass}`} aria-live="polite">
          {message}
        </div>

        <p className="muted">
          Ainda não tem conta? <Link to="/register">Registre-se</Link>
        </p>
      </section>
    </main>
  );
}