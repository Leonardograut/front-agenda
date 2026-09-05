import React from 'react';

export default function AtividadeItem({ atividade, onEdit, onDelete }) {
  return (
    <li className="atividade-item">
      <div className="item-main">
        <strong>{atividade.nome}</strong>
        <div className="meta">
          <span>{atividade.status}</span>
          <span>views: {atividade.qtdViews ?? 0}</span>
        </div>
      </div>

      <div className="item-body">
        <p>{atividade.descricao}</p>
        <small>
          Início: {atividade.dataHoraInicio ? atividade.dataHoraInicio.replace('T', ' ') : '-'} — Término:{' '}
          {atividade.dataHoraTermino ? atividade.dataHoraTermino.replace('T', ' ') : '-'}
        </small>
      </div>

      <div className="item-actions">
        <button type="button" onClick={() => onEdit(atividade)}>
          Editar
        </button>
        <button type="button" onClick={() => onDelete(atividade.id)} className="danger">
          Excluir
        </button>
      </div>
    </li>
  );
}
