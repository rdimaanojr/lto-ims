const request = async (url, method, body = null) => {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);

    const res = await fetch(url, options);
    const data = await res.json();

    return { status: res.status, data };
}

const login = (username, password) => request('/api/auth/login', 'POST', {username, password});

const register = (username, password) => request('/api/auth/register', 'POST', {username, password}); 

const logout = () => request('/api/auth/logout', 'POST');

export const api = {
    login,
    register,
    logout,
};