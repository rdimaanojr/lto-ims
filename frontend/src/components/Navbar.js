import { state } from "../js/state.js";

export const Navbar = () => {
    const isAdmin = state.isAdmin();

    return `
        <nav>
            <a href="/dashboard">Home</a>
            ${isAdmin ? '<a href="/admin">Admin Panel</a>' : ''}
            <button id="logout-btn">Logout</button>
        </nav>
    `;
};