import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AppLayout.css';

export default function AppLayout({ children, sidebarItems = [] }) {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Usuário';

  function handleLogout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    navigate('/login');
  }

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-header">
          <h3>Agenda</h3>
          <p>Gerencie suas atividades</p>
          <span className="sidebar-user">Olá, {userName}</span>
        </div>

        <nav className="sidebar-nav">
          <Link to="/atividades" className="sidebar-link active">
            Atividades
          </Link>
          <button type="button" className="sidebar-link button-link" onClick={handleLogout}>
            Sair
          </button>
        </nav>

        <div className="sidebar-section">
          <h4>Atividades recentes</h4>
          {sidebarItems.length === 0 ? (
            <p className="sidebar-empty">Ainda não há atividades cadastradas.</p>
          ) : (
            <ul className="sidebar-list">
              {sidebarItems.slice(0, 6).map((item) => (
                <li key={item.id} className="sidebar-list-item">
                  <span>{item.nome || 'Sem nome'}</span>
                  <small>{item.status || 'PENDING'}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      <main className="app-content">{children}</main>
    </div>
  );
}
