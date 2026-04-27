import { api } from './api.js';
import { state } from './state.js';
import { navigateTo } from './router.js';

const handleLogin = async (form) => {
    const res = await api.login(form.loginUsername.value, form.loginPassword.value);
    if (res.status === 200) {
        state.saveUser(res.data);
        window.history.pushState({}, '', '/dashboard');
        navigateTo('/dashboard');
    } else {
        alert(res.data.error || "Login failed!");
    }
};

const handleRegister = async (form) => {
    const username = form.regUsername.value;
    const password = form.regPassword.value;
    const confirm = form.regConfirmPassword.value;

    if (password !== confirm) {
        alert("Passwords do not match!");
        return;
    }

    const result = await api.register(username, password);
    alert(result);
}

const handleLogout = async () => {
    await api.logout();
    state.clearUser();
    window.history.pushState({}, '', '/');
    navigateTo('/');
}

export const initEventListeners = () => {
    const app = document.getElementById('app');

    app.addEventListener('submit', (e) => {
        e.preventDefault();
        if (e.target.id === 'loginForm') {
            handleLogin(e.target);
        } else if (e.target.id === 'logoutForm') {
            handleRegister(e.target);
        }
    })

    app.addEventListener('click', (e) => {
        if (e.target.id === 'logout-btn') {
            handleLogout();
        }
    })

};