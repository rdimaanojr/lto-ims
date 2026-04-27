import { Layout } from '../components/Layout.js';

const app = document.getElementById('app');

const renderPage = (content, useLayout = false) => {
    app.innerHTML = useLayout ? Layout(content) : content;
};

export const render = {
    renderPage,
};