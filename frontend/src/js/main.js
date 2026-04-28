import { mainApi } from './api/main_api.js';
import { state } from './state.js';
import { navigateTo } from './router.js';

window.toggleAuth = () => {
    const loginView = document.getElementById('view-login');
    const regView = document.getElementById('view-register');
    
    // Toggle displays
    if (loginView.style.display === 'none') {
        loginView.style.display = 'block';
        regView.style.display = 'none';
    } else {
        loginView.style.display = 'none';
        regView.style.display = 'block';
    }
};

const handleLogin = async (form) => {
    const res = await mainApi.login(form.loginUsername.value, form.loginPassword.value);
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

    const res = await mainApi.register(username, password);

    if (res.status === 201) {
        alert(res.data.message);
    } else {
        alert(res.data.error || "Register failed!");
    }
}

const handleLogout = async () => {
    await mainApi.logout();
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
        } else if (e.target.id === 'registerForm') {
            handleRegister(e.target);
        }
    })

    app.addEventListener('click', (e) => {
        if (e.target.id === 'logout-btn') {
            handleLogout();
        }
    })

};