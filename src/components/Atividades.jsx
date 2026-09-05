import React, { useEffect, useState } from 'react';
import './Atividades.css';
import { useNavigate } from 'react-router-dom';
import AtividadeForm from './atividades/AtividadeForm';
import AtividadeList from './atividades/AtividadeList';
import AtividadeCalendar from './atividades/AtividadeCalendar';
import AppLayout from './layouts/AppLayout';
import { createEmptyActivityForm } from '../entities/atividade';
import { createAtividade, deleteAtividade, listAtividades, updateAtividade } from '../services/atividadeService';

export default function Atividades() {
  const [atividades, setAtividades] = useState([]);
  const [statusPesquisa, setStatusPesquisa] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(createEmptyActivityForm());
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetchAtividades();
  }, [navigate, token]);

  async function fetchAtividades() {
    setLoading(true);
    setError('');

    try {
      const data = await listAtividades(token);
      setAtividades(data);
    } catch (err) {
      setError(err.message || 'Erro desconhecido');
      setAtividades([]);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm(createEmptyActivityForm());
  }

  function handleChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleEdit(atividade) {
    setForm({
      id: atividade.id,
      nome: atividade.nome || '',
      descricao: atividade.descricao || '',
      dataHoraInicio: atividade.dataHoraInicio || '',
      dataHoraTermino: atividade.dataHoraTermino || '',
      status: atividade.status || 'PENDING',
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!window.confirm('Deseja realmente excluir esta atividade?')) return;

    try {
      await deleteAtividade(token, id);
      setAtividades((prev) => prev.filter((atividade) => atividade.id !== id));
    } catch (err) {
      window.alert('Erro ao excluir: ' + (err.message || err));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (form.id) {
        await updateAtividade(token, form);
      } else {
        await createAtividade(token, form);
      }

      await fetchAtividades();
      resetForm();
    } catch (err) {
      setError(err.message || 'Erro ao salvar atividade');
    } finally {
      setSaving(false);
    }
  }

  const atividadesFiltradas = atividades.filter((atividade) => {
    const pesquisa = statusPesquisa.trim().toLowerCase();
    if (!pesquisa) return true;

    const status = atividade.status?.toLowerCase() || '';
    const statusLabel = {
      pending: 'pendente',
      completed: 'concluida concluída',
      canceled: 'cancelada',
    }[status] || '';

    return `${status} ${statusLabel}`.includes(pesquisa);
  });

  return (
    <AppLayout sidebarItems={atividades}>
      <div className="atividades-page">
        <header>
          <div>
            <h2>Atividades</h2>
            <p className="page-subtitle">Organize sua rotina com mais clareza.</p>
          </div>
        </header>

        <AtividadeForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={resetForm}
          saving={saving}
          error={error}
        />

        <div className="status-search">
          <label htmlFor="status-search-input">Pesquisar por status</label>
          <input
            id="status-search-input"
            type="search"
            value={statusPesquisa}
            onChange={(event) => setStatusPesquisa(event.target.value)}
            placeholder="Ex.: pendente, concluída ou cancelada"
          />
        </div>

        <AtividadeList
          atividades={atividadesFiltradas}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <AtividadeCalendar atividades={atividadesFiltradas} onEdit={handleEdit} />
      </div>
    </AppLayout>
  );
}
