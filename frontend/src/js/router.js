import { state } from './state.js';
import { render } from './render.js';
import { Login } from '../pages/Login.js';

const app = document.getElementById('app');

export const navigateTo = async (path) => {
    if (path === '/admin') {
        if (!state.isAdmin()) {
            window.location.pathname = '/dashboard';
            return;
        }

        const { AdminDashboard } = await import('../pages/AdminDashboard.js');
        render.renderPage(AdminDashboard(), true);
        return;
    }
    
    // home page
    if (path === '/dashboard' && state.isLoggedIn()) {
        const { Dashboard } = await import('../pages/Dashboard.js');
        render.renderPage(Dashboard(), true);
        return;
    }
    
    render.renderPage(Login(), false);
};