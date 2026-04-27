import { Navbar } from './Navbar.js';

export const Layout = (content) => {
    return `
        <div class="app-container">
            ${Navbar()} 
            <main id="main-content">
                ${content}
            </main>
        </div>
    `;
};