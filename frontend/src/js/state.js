export let userState = JSON.parse(localStorage.getItem('user')) || null;

const getUser = () => userState;

const saveUser = (user) => {
    userState = user;
    localStorage.setItem('user', JSON.stringify(user));
}

const clearUser = () => {
    userState = null;
    localStorage.removeItem('user');
}

const isLoggedIn = () => userState !== null;

const isAdmin = () => userState.role === 'admin';

export const state = {
    getUser,
    saveUser,
    clearUser,
    isLoggedIn,
    isAdmin,
}