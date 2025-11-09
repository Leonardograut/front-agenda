import React, { useEffect, useState } from 'react';
import './Atividades.css';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8080';

// converte o valor do input datetime-local para "yyyy-MM-ddTHH:mm:ss" sem Z
function toBackendDateTime(localDateTimeValue) {
  if (!localDateTimeValue) return null;
  // "YYYY-MM-DDTHH:mm" -> add ":00"
  if (localDateTimeValue.length === 16) return localDateTimeValue + ':00';
  // remove milissegundos e Z se houver
  return localDateTimeValue.replace(/\.\d+Z?$/, '');
}

// converte ISO/string backend para valor compatível com <input type="datetime-local">
function fromBackendDateTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${mm}-${dd}T${hh}:${min}`;
}

/* === status mapping between backend <-> frontend ===
   Front-end internal values: PENDING, COMPLETED, CANCELED
   Backend (example): PENDENTE, CONCLUIDA, CANCELADA  (Português)
*/
const STATUS_BACK_TO_FRONT = {
  PENDENTE: 'PENDING',
  CONCLUIDA: 'COMPLETED',
  'CONCLUÍDA': 'COMPLETED',
  CONCLUDA: 'COMPLETED',
  CANCELADA: 'CANCELED',

  // accept english if backend already returns english
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  CANCELED: 'CANCELED',
};

const STATUS_FRONT_TO_BACK = {
  PENDING: 'PENDENTE',
  COMPLETED: 'CONCLUIDA', // ajuste se seu backend usar outra grafia
  CANCELED: 'CANCELADA',
};

// detecta e normaliza item vindo do backend
function normalizeItem(raw) {
  if (!raw || typeof raw !== 'object') return null;

  const id =
    raw.id ??
    raw.idAtividade ??
    raw.atividadeId ??
    raw.id_atividade ??
    raw.codigo ??
    raw.idActivity ??
    null;

  const nome = raw.nome ?? raw.titulo ?? raw.title ?? '';
  const descricao = raw.descricao ?? raw.description ?? '';
  const dataHoraInicio = raw.dataHoraInicio ?? raw.dataInicio ?? raw.startDate ?? null;
  const dataHoraTermino = raw.dataHoraTermino ?? raw.dataTermino ?? raw.endDate ?? null;
  const qtdViews = raw.qtdViews ?? raw.QtdViews ?? raw.views ?? 0;

  const rawStatus = (raw.status ?? raw.situacao ?? '').toString().toUpperCase();
  const status = STATUS_BACK_TO_FRONT[rawStatus] ?? 'PENDING';

  return {
    id,
    nome,
    descricao,
    dataHoraInicio,
    dataHoraTermino,
    status,
    qtdViews,
    raw,
  };
}

export default function Atividades() {
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    id: null,
    nome: '',
    descricao: '',
    dataHoraInicio: '',
    dataHoraTermino: '',
    status: 'PENDING',
  });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchAtividades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function parseResponseBody(res) {
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  // GET /atividades
  async function fetchAtividades() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/atividades`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const body = await parseResponseBody(res);
      console.log('GET /atividades ->', res.status, body);

      if (!res.ok) {
        const errMsg = typeof body === 'string' && body.length ? body : JSON.stringify(body);
        throw new Error(`Erro ao buscar atividades: ${res.status} ${res.statusText} — ${errMsg}`);
      }

      const data = Array.isArray(body) ? body : [];
      const converted = data
        .map(normalizeItem)
        .filter((x) => x && x.id != null)
        .map((a) => ({
          ...a,
          // convert to datetime-local format for inputs (if exists)
          dataHoraInicio: fromBackendDateTime(a.dataHoraInicio),
          dataHoraTermino: fromBackendDateTime(a.dataHoraTermino),
        }));

      console.log('Atividades normalizadas ->', converted);
      setAtividades(converted);
    } catch (err) {
      setError(err.message || 'Erro desconhecido');
      setAtividades([]);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({
      id: null,
      nome: '',
      descricao: '',
      dataHoraInicio: '',
      dataHoraTermino: '',
      status: 'PENDING',
    });
  }

  function handleEdit(at) {
    // at já vem do array "atividades" e está normalizado
    setForm({
      id: at.id,
      nome: at.nome || '',
      descricao: at.descricao || '',
      dataHoraInicio: at.dataHoraInicio || '',
      dataHoraTermino: at.dataHoraTermino || '',
      status: at.status || 'PENDING',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // DELETE /atividades/{id}
  async function handleDelete(id) {
    if (!confirm('Deseja realmente excluir esta atividade?')) return;
    try {
      console.log('DELETE /atividades/' + id);
      const res = await fetch(`${API_BASE}/atividades/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const body = await parseResponseBody(res);
      console.log('Resposta DELETE ->', res.status, body);

      if (!res.ok) {
        const errMsg = typeof body === 'string' && body.length ? body : JSON.stringify(body);
        throw new Error(`Falha ao excluir: ${res.status} — ${errMsg}`);
      }

      setAtividades((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert('Erro ao excluir: ' + (err.message || err));
    }
  }

  // monta payload de criação (AtividadesRequestDTO): apenas nome, descricao, dataHoraInicio, dataHoraTermino
  function buildCreatePayload() {
    const payload = {
      nome: form.nome,
      descricao: form.descricao,
      dataHoraInicio: toBackendDateTime(form.dataHoraInicio),
      dataHoraTermino: toBackendDateTime(form.dataHoraTermino),
    };

    const cleaned = Object.fromEntries(
      Object.entries(payload).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );

    return cleaned;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (form.id) {
        // PUT
        const payloadPut = {
          nome: form.nome,
          descricao: form.descricao,
          dataHoraInicio: toBackendDateTime(form.dataHoraInicio),
          dataHoraTermino: toBackendDateTime(form.dataHoraTermino),
          // converte status front -> back
          status: STATUS_FRONT_TO_BACK[form.status] ?? form.status,
        };

        console.log('Editando (PUT) payload ->', payloadPut);
        const resPut = await fetch(`${API_BASE}/atividades/${form.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payloadPut),
        });

        const textPut = await resPut.text();
        let bodyPut;
        try {
          bodyPut = JSON.parse(textPut);
        } catch {
          bodyPut = textPut;
        }
        console.log('Resposta PUT ->', resPut.status, bodyPut);

        if (!resPut.ok) {
          throw new Error(typeof bodyPut === 'string' && bodyPut ? bodyPut : JSON.stringify(bodyPut));
        }

        await fetchAtividades();
        resetForm();
        return;
      }

      // POST
      const payload = buildCreatePayload();
      console.log('Enviando payload POST ->', payload);

      const res = await fetch(`${API_BASE}/atividades`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let body;
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
      console.log('Resposta servidor ->', res.status, body);

      if (!res.ok) {
        throw new Error(typeof body === 'string' && body ? body : JSON.stringify(body));
      }

      await fetchAtividades();
      resetForm();
    } catch (err) {
      setError(err.message || 'Erro ao salvar atividade');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="atividades-page">
      <header>
        <h2>Atividades</h2>
        <div className="token-line">
          <small>Token: {token ? token.substring(0, 30) + '...' : 'nenhum'}</small>
        </div>
      </header>

      <section className="form-section">
        <h3>{form.id ? 'Editar Atividade' : 'Nova Atividade'}</h3>
        <form onSubmit={handleSubmit} className="atividade-form">
          <label>Nome</label>
          <input
            value={form.nome}
            onChange={(e) => setForm((s) => ({ ...s, nome: e.target.value }))}
            required
            minLength={2}
          />

          <label>Descrição</label>
          <textarea
            value={form.descricao}
            onChange={(e) => setForm((s) => ({ ...s, descricao: e.target.value }))}
            required
            rows={3}
          />

          <div className="row">
            <div>
              <label>Data / Hora Início</label>
              <input
                type="datetime-local"
                value={form.dataHoraInicio}
                onChange={(e) => setForm((s) => ({ ...s, dataHoraInicio: e.target.value }))}
              />
            </div>

            <div>
              <label>Data / Hora Término</label>
              <input
                type="datetime-local"
                value={form.dataHoraTermino}
                onChange={(e) => setForm((s) => ({ ...s, dataHoraTermino: e.target.value }))}
              />
            </div>
          </div>

          <label>Status</label>
          <select value={form.status} onChange={(e) => setForm((s) => ({ ...s, status: e.target.value }))}>
            <option value="PENDING">Pendente</option>
            <option value="COMPLETED">Concluída</option>
            <option value="CANCELED">Cancelada</option>
          </select>

          <div className="form-actions">
            <button type="submit" className="btn" disabled={saving}>
              {saving ? 'Salvando...' : form.id ? 'Salvar' : 'Criar'}
            </button>
            <button type="button" className="btn alt" onClick={resetForm} disabled={saving}>
              Limpar
            </button>
          </div>

          {error && <div className="error">{error}</div>}
        </form>
      </section>

      <section className="list-section">
        <h3>Lista de Atividades</h3>
        {loading ? (
          <p>Carregando...</p>
        ) : atividades.length === 0 ? (
          <p>Nenhuma atividade encontrada.</p>
        ) : (
          <ul className="atividades-list">
            {atividades.map((a) => (
              <li key={a.id} className="atividade-item">
                <div className="item-main">
                  <strong>{a.nome}</strong>
                  <div className="meta">
                    <span>{a.status}</span>
                    <span>views: {a.qtdViews ?? 0}</span>
                  </div>
                </div>

                <div className="item-body">
                  <p>{a.descricao}</p>
                  <small>
                    Início: {a.dataHoraInicio ? a.dataHoraInicio.replace('T', ' ') : '-'} — Término:{' '}
                    {a.dataHoraTermino ? a.dataHoraTermino.replace('T', ' ') : '-'}
                  </small>
                </div>

                <div className="item-actions">
                  <button onClick={() => handleEdit(a)}>Editar</button>
                  <button onClick={() => handleDelete(a.id)} className="danger">
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
