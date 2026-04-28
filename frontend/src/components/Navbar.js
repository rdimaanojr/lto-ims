import { state } from "../js/state.js";

export const Navbar = () => {
    const isAdmin = state.isAdmin();

    return `
        <style>
            nav { 
                width: 150px; 
                min-width: 150px;
                flex-shrink: 1;
                border-right: 1px solid #ccc; 
                padding: 20px; 
                display: flex; 
                flex-direction: column; 
                height: 100vh;   
                position: sticky; 
                top: 0;    
                box-sizing: border-box;
                font-family: sans-serif;
            }
            nav a { 
                text-decoration: none; 
                color: #555; 
                font-weight: bold; 
                margin-bottom: 15px;
            }
            nav a:hover { color: #000; }
            #logout-btn { 
                margin-top: auto;
                padding: 5px; 
                cursor: pointer; 
                background: #f4f4f4; 
                border: 1px solid #ccc; 
            }
        </style>
        <nav>
            <a href="/dashboard">Home</a>
            ${isAdmin ? '<a href="/admin">Admin Panel</a>' : ''}
            <button id="logout-btn">Logout</button>
        </nav>
    `;
};