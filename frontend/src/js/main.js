import { api } from './api.js';
import { state } from './state.js';


export const initAuthForms = () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        const result = await api.login(username, password);
        
        if (result.status === 200) {
            state.saveUser(result.data);
            window.location.href = '/dashboard';
        } else {
            alert(result.data.error || "Login failed");
        }

    });

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const confirm = document.getElementById('regConfirmPassword').value;

        if (password !== confirm) {
            alert("Passwords do not match!");
            return;
        }

        const result = await api.register(username, password);
        console.log("Register response:", result);
    });
};