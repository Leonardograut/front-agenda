
const API_BASE = 'http://localhost:8080';

async function parseAuthResponse(response) {
    const contentType = response.headers.get('content-type') || '';
    const rawText = await response.text();

    if (!rawText) {
        return { token: '', userName: '' };
    }

    if (contentType.includes('application/json') || rawText.trim().startsWith('{') || rawText.trim().startsWith('[')) {
        try {
            const parsed = JSON.parse(rawText);

            if (typeof parsed === 'string') {
                return { token: parsed, userName: '' };
            }

            return {
                token: parsed.token || parsed.accessToken || parsed.authToken || '',
                userName: parsed.userName || parsed.nome || parsed.name || ''
            };
        } catch {
            // fallback para texto simples
        }
    }

    return { token: rawText, userName: '' };
}

export async function login(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        })
    });

    if (!response.ok) {
        throw new Error('Email ou senha inválidos');
    }

    const { token, userName } = await parseAuthResponse(response);
    const resolvedUserName = userName || localStorage.getItem('userName') || email.split('@')[0];

    if (token) {
        localStorage.setItem('authToken', token);
    }

    if (resolvedUserName) {
        localStorage.setItem('userName', resolvedUserName);
    }

    return { token, userName: resolvedUserName };
}

export async function registerUser(payload) {
    const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error('Erro ao cadastrar usuário');
    }

    if (payload.nome) {
        localStorage.setItem('userName', payload.nome);
    }

    return true;
}

