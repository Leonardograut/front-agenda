import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [statusClass, setStatusClass] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setStatusClass('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (!res.ok) {
        const text = await res.text();
        setMessage('Erro: ' + (text || res.statusText));
        setStatusClass('error');
        setLoading(false);
        return;
      }

      // o backend pode retornar token em texto ou JSON
      const contentType = res.headers.get('content-type') || '';
      let token;
      if (contentType.includes('application/json')) {
        const data = await res.json();
        token = data.token || JSON.stringify(data);
      } else {
        token = await res.text();
      }

      localStorage.setItem('authToken', token);
      setMessage('Autenticado com sucesso. Token salvo em localStorage.');
      setStatusClass('success');

      // redireciona após login bem-sucedido
      setTimeout(() => navigate('/atividades'), 1200);

    } catch (err) {
      setMessage('Erro de conexão: ' + err.message);
      setStatusClass('error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="card login-card">
      <h1>Entrar</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={e => setPassword(e.target.value)}
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
    </main>
  );
}