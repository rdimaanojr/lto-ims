import { Navbar } from './Navbar.js';

export const Layout = (content) => {
    return `
        <style>
            body { margin: 0; padding: 0; }
            .app-container { 
                display: flex; 
                height: 100vh;
            }
            main { 
                flex-grow: 1; 
                padding: 10px; 
                overflow-y: auto;
            }
            h1 {
                margin-top: 0;
            }
        </style>
        <div class="app-container">
            ${Navbar()} 
            <main id="main-content">
                ${content}
            </main>
        </div>
    `;
};