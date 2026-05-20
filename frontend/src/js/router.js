import { state } from './state.js';
import { render } from './render.js';
import { Login } from '../pages/Login.js';

const app = document.getElementById('app');

export const navigateTo = async (path) => {
    const isLoggedIn = await state.verifySession();
    const isAdmin = state.isAdmin();

    let targetPath = path;
    if (path === '/' && isLoggedIn) {
        targetPath = '/dashboard';
    }

    if (targetPath === '/admin') {
        if (!isLoggedIn || !isAdmin) {
            targetPath = '/dashboard';
        }
    }

    if (targetPath === '/dashboard' && !isLoggedIn) {
        targetPath = '/';
    }

    if (window.location.pathname !== targetPath) {
        window.history.pushState({}, "", targetPath);
    }

    if (targetPath === '/admin') {
        const { AdminDashboard } = await import('../pages/AdminDashboard.js');
        const { initAdminHandlers } = await import('./handlers/admin_handler.js'); 
        render.renderPage(AdminDashboard(), true);
        initAdminHandlers();
        return;
    }

    if (targetPath === '/dashboard') {
        const { Dashboard } = await import('../pages/Dashboard.js');
        const { initDashboardHandlers } = await import('./handlers/dashboard_handler.js');
        render.renderPage(Dashboard(), true);
        initDashboardHandlers();
        return;
    }

    if (targetPath === '/crud') {
        if (!isLoggedIn) {
            targetPath = '/';
            if (window.location.pathname !== targetPath) {
                window.history.pushState({}, "", targetPath);
            }
            render.renderPage(Login(), false);
            return;
        }
        const { CRUD } = await import('../pages/CRUD.js');
        const { initCRUDHandlers } = await import('./handlers/crud_handler.js');
        render.renderPage(CRUD(), true);
        initCRUDHandlers();
        return;
    }

    render.renderPage(Login(), false);
};