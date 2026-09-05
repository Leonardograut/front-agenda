import React, { useMemo, useState } from 'react';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function activityDateKey(atividade) {
  return atividade.dataHoraInicio?.slice(0, 10);
}

function statusLabel(status) {
  return {
    PENDING: 'Pendente',
    COMPLETED: 'Concluída',
    CANCELED: 'Cancelada',
  }[status] || status;
}

export default function AtividadeCalendar({ atividades, onEdit }) {
  const today = new Date();
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const calendarDays = useMemo(() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - firstDay.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [month]);

  const activitiesByDay = useMemo(() => {
    return atividades.reduce((groups, atividade) => {
      const key = activityDateKey(atividade);
      if (!key) return groups;
      groups[key] = [...(groups[key] || []), atividade];
      return groups;
    }, {});
  }, [atividades]);

  function changeMonth(offset) {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  }

  return (
    <section className="calendar-section">
      <div className="calendar-header">
        <div>
          <h3>Calendário</h3>
          <p>{monthFormatter.format(month)}</p>
        </div>
        <div className="calendar-actions">
          <button type="button" className="calendar-button" onClick={() => changeMonth(-1)} aria-label="Mês anterior">
            &lt;
          </button>
          <button type="button" className="calendar-button today-button" onClick={() => setMonth(new Date(today.getFullYear(), today.getMonth(), 1))}>
            Hoje
          </button>
          <button type="button" className="calendar-button" onClick={() => changeMonth(1)} aria-label="Próximo mês">
            &gt;
          </button>
        </div>
      </div>

      <div className="calendar-grid calendar-weekdays">
        {weekDays.map((day) => <span key={day}>{day}</span>)}
      </div>

      <div className="calendar-grid calendar-days">
        {calendarDays.map((day) => {
          const key = dateKey(day);
          const isCurrentMonth = day.getMonth() === month.getMonth();
          const isToday = key === dateKey(today);

          return (
            <div key={key} className={`calendar-day${isCurrentMonth ? '' : ' outside-month'}${isToday ? ' today' : ''}`}>
              <span className="day-number">{day.getDate()}</span>
              <div className="day-activities">
                {(activitiesByDay[key] || []).map((atividade) => (
                  <button
                    type="button"
                    className={`calendar-activity status-${atividade.status?.toLowerCase()}`}
                    key={atividade.id}
                    onClick={() => onEdit(atividade)}
                    title={`${atividade.nome} - ${statusLabel(atividade.status)}`}
                  >
                    {atividade.nome}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
