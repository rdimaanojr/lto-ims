import http from 'node:http';
import { handleRequest } from './router.js';
import { initializeDatabaseTables } from './init.js';

await initializeDatabaseTables();

const server = http.createServer(handleRequest);

const PORT = 3000;

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));