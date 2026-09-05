import React from 'react';
import AtividadeItem from './AtividadeItem';

export default function AtividadeList({ atividades, loading, onEdit, onDelete }) {
  return (
    <section className="list-section">
      <h3>Lista de Atividades</h3>
      {loading ? (
        <p>Carregando...</p>
      ) : atividades.length === 0 ? (
        <p>Nenhuma atividade encontrada.</p>
      ) : (
        <ul className="atividades-list">
          {atividades.map((atividade) => (
            <AtividadeItem
              key={atividade.id}
              atividade={atividade}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
