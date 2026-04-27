const login = async (username, password) => {
    const res = await fetch(`/api/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    });
    return await res.json();
};

const register = async (username, password) => {
    const res = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    });
    return await res.json();
};

export const api = {
    login,
    register,
};