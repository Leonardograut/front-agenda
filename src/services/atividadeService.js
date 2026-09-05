
import {
    extractActivitiesFromBody,
    fromBackendDateTime,
    normalizeActivity,
    STATUS_FRONT_TO_BACK,
    toBackendDateTime,
} from '../entities/atividade';

const API_BASE = 'http://localhost:8080';

export async function listAtividades(token) {
    const response = await fetch(`${API_BASE}/atividades`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Erro ao buscar atividades');
    }

    const body = await response.json();

    return extractActivitiesFromBody(body)
        .map(normalizeActivity)
        .filter((item) => item && item.id != null)
        .map((atividade) => ({
            ...atividade,
            dataHoraInicio: fromBackendDateTime(
                atividade.dataHoraInicio
            ),
            dataHoraTermino: fromBackendDateTime(
                atividade.dataHoraTermino
            ),
        }));
}

export async function createAtividade(token, form) {
    const response = await fetch(`${API_BASE}/atividades`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            nome: form.nome,
            descricao: form.descricao,
            dataHoraInicio: toBackendDateTime(form.dataHoraInicio),
            dataHoraTermino: toBackendDateTime(form.dataHoraTermino),
        }),
    });

    if (!response.ok) {
        throw new Error('Erro ao criar atividade');
    }

    return response.json();
}

export async function updateAtividade(token, form) {
    const response = await fetch(
        `${API_BASE}/atividades/${form.id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                nome: form.nome,
                descricao: form.descricao,
                dataHoraInicio: toBackendDateTime(
                    form.dataHoraInicio
                ),
                dataHoraTermino: toBackendDateTime(
                    form.dataHoraTermino
                ),
                status:
                    STATUS_FRONT_TO_BACK[form.status] ??
                    form.status,
            }),
        }
    );

    if (!response.ok) {
        throw new Error('Erro ao atualizar atividade');
    }

    return response.json();
}

export async function deleteAtividade(token, activityId) {
    const response = await fetch(
        `${API_BASE}/atividades/${activityId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error('Erro ao excluir atividade');
    }

    return true;
}

