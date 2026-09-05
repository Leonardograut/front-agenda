import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { registerUser } from '../services/authService';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      await registerUser({ nome, email, password, role });
      localStorage.setItem('userName', nome);
      setIsError(false);
      setMessage('Registro realizado com sucesso! Você pode entrar agora.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setIsError(true);
      setMessage('Erro: ' + (err.message || err));
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Registrar</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            required
            minLength="2"
          />

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength="6"
          />

          <label htmlFor="role">Perfil</label>
          <select id="role" value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="USER">Usuário</option>
          </select>

          <button type="submit" className="btn">
            Registrar
          </button>
        </form>

        {message && (
          <div id="message" className={`message ${isError ? 'error' : 'success'}`} aria-live="polite">
            {message}
          </div>
        )}

        <p className="muted">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}
