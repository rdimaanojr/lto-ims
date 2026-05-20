import { state } from "../js/state.js";

export const Navbar = () => {
    const isAdmin = state.isAdmin();

    return `
        <nav>
            <a href="/dashboard">Reports</a>
            <a href="/crud">Data Management</a>
            ${isAdmin ? '<a href="/admin">Admin Panel</a>' : ''}
            <button id="logout-btn">Logout</button>
        </nav>
    `;
};
