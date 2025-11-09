import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // Reutiliza o mesmo estilo do login

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, password, role }),
      });

      if (!res.ok) {
        const text = await res.text();
        setIsError(true);
        setMessage("Erro: " + (text || res.statusText));
        return;
      }

      setIsError(false);
      setMessage("Registro realizado com sucesso! Você pode entrar agora.");

      // Espera 2 segundos e redireciona pro login
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setIsError(true);
      setMessage("Erro de conexão: " + err.message);
    }
  };

  return (
    <main className="card">
      <h1>Registrar</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nome">Nome</label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          minLength="2"
        />

        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6"
        />

        <label htmlFor="role">Perfil</label>
        <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="USER">Usuário</option>
        </select>

        <button type="submit" className="btn">
          Registrar
        </button>
      </form>

      {message && (
        <div className={`message ${isError ? "error" : "success"}`}>
          {message}
        </div>
      )}

      <p className="muted">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </main>
  );
}
