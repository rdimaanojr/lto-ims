import http from 'node:http';
import db from './db.js';
import { initializeDatabaseTables } from './init.js';

await initializeDatabaseTables();

const server = http.createServer(async (req, res) => {
    // set CORS headers so the front-end can talk to the server
    res.setHeader('Access-Constrol-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // /api/test/ endpoint for connection testing
    if (req.url === '/api/test' && req.method === 'GET') {
        try {
            const [rows] = await db.execute('SELECT 1');
            res.writeHead(200);
            res.end(JSON.stringify({ message: "Server is running and database is connected." }))
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: err.message }));
        }
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
});