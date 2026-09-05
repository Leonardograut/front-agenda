export const STATUS_BACK_TO_FRONT = {
    PENDENTE: 'PENDING',
    CONCLUIDA: 'COMPLETED',
    CANCELADA: 'CANCELED',
};

export const STATUS_FRONT_TO_BACK = {
    PENDING: 'PENDENTE',
    COMPLETED: 'CONCLUIDA',
    CANCELED: 'CANCELADA',
};

export function createEmptyActivityForm() {
    return {
        id: null,
        nome: '',
        descricao: '',
        dataHoraInicio: '',
        dataHoraTermino: '',
        status: 'PENDING',
    };
}

export function toBackendDateTime(value) {
    if (!value) return null;

    if (value.length === 16) {
        return `${value}:00`;
    }

    return value;
}

export function fromBackendDateTime(value) {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function normalizeActivity(activity) {
    if (!activity) return null;

    return {
        id: activity.id,
        nome: activity.nome,
        descricao: activity.descricao,
        dataHoraInicio: activity.dataHoraInicio,
        dataHoraTermino: activity.dataHoraTermino,
        status: STATUS_BACK_TO_FRONT[activity.status] ?? 'PENDING',
        qtdViews: activity.qtdViews ?? 0,
    };
}

export function extractActivitiesFromBody(body) {
    return body?.content ?? [];
}