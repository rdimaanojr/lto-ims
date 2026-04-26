import * as endpoints from './endpoints.js';

const routes = {
    // format: 'METHOD <route>': endpoint function
    'GET /api/test': endpoints.testConnection,
};

export const handleRequest = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // pre-flight check
    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    const key = `${req.method} ${req.url}`;
    const handler = routes[key];

    if (handler) {
        await handler(req, res);
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Route not found" }));
    }
}