export let userState = JSON.parse(localStorage.getItem('user')) || {};

const getUser = () => userState;

const saveUser = (user) => {
    userState = user;
    localStorage.setItem('user', JSON.stringify(user));
}

const clearUser = () => {
    userState = {};
    localStorage.removeItem('user');
}

const isLoggedIn = () => !!userState.user;

const isAdmin = () => userState.role === 'admin';

export const state = {
    getUser,
    saveUser,
    clearUser,
    isLoggedIn,
    isAdmin,
}