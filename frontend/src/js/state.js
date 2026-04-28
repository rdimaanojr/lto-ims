export let userState = JSON.parse(localStorage.getItem('user')) || {};

export const verifySession = async () => {
    try {
        const response = await fetch('/api/auth/me', { credentials: 'include' });
        if (response.status !== 200) {
            clearUser();
            return false;
        }

        const data = await response.json();
        if (!data.isLoggedIn) {
            clearUser();
            return false;
        }

        saveUser({ username: data.username, role: data.role });
        return true;
    } catch (err) {
        clearUser();
        return false;
    }
};

const getUser = () => userState;

const saveUser = (user) => {
    userState = user;
    localStorage.setItem('user', JSON.stringify(user));
}

const clearUser = () => {
    userState = {};
    localStorage.removeItem('user');
}

const isLoggedIn = () => !!userState.username;

const isAdmin = () => userState.role === 'admin';

export const state = {
    verifySession,
    getUser,
    saveUser,
    clearUser,
    isLoggedIn,
    isAdmin,
}