import { state } from './state.js';
import { render } from './render.js';
import { Login } from '../pages/Login.js';

const app = document.getElementById('app');

export const navigateTo = async (path) => {
    if (path === '/' && state.isLoggedIn()) {
        return navigateTo('/dashboard');
    }

    if (window.location.pathname !== path) {
        window.history.pushState({}, "", path);
    }

    if (path === '/admin') {
        if (!state.isAdmin()) {
            return navigateTo('/dashboard');
        }

        const { AdminDashboard } = await import('../pages/AdminDashboard.js');
        render.renderPage(AdminDashboard(), true);
        return;
    }
    
    if (path === '/dashboard') {
        if (!state.isLoggedIn()) {
            return navigateTo('/');
        }

        const { Dashboard } = await import('../pages/Dashboard.js');
        render.renderPage(Dashboard(), true);
        return;
    }
    
    render.renderPage(Login(), false);
};