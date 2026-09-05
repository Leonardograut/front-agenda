import React from 'react';

export default function AtividadeForm({ form, onChange, onSubmit, onReset, saving, error }) {
  return (
    <section className="form-section">
      <h3>{form.id ? 'Editar Atividade' : 'Nova Atividade'}</h3>
      <form onSubmit={onSubmit} className="atividade-form">
        <label>Nome</label>
        <input
          value={form.nome}
          onChange={(event) => onChange('nome', event.target.value)}
          required
          minLength={2}
        />

        <label>Descrição</label>
        <textarea
          value={form.descricao}
          onChange={(event) => onChange('descricao', event.target.value)}
          required
          rows={3}
        />

        <div className="row">
          <div>
            <label>Data / Hora Início</label>
            <input
              type="datetime-local"
              value={form.dataHoraInicio}
              onChange={(event) => onChange('dataHoraInicio', event.target.value)}
            />
          </div>

          <div>
            <label>Data / Hora Término</label>
            <input
              type="datetime-local"
              value={form.dataHoraTermino}
              onChange={(event) => onChange('dataHoraTermino', event.target.value)}
            />
          </div>
        </div>

        <label>Status</label>
        <select value={form.status} onChange={(event) => onChange('status', event.target.value)}>
          <option value="PENDING">Pendente</option>
          <option value="COMPLETED">Concluída</option>
          <option value="CANCELED">Cancelada</option>
        </select>

        <div className="form-actions">
          <button type="submit" className="btn" disabled={saving}>
            {saving ? 'Salvando...' : form.id ? 'Salvar' : 'Criar'}
          </button>
          <button type="button" className="btn alt" onClick={onReset} disabled={saving}>
            Limpar
          </button>
        </div>

        {error && <div className="error">{error}</div>}
      </form>
    </section>
  );
}
