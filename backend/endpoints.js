import * as db from './queries.js';

export const testConnection = async (req, res) => {
    try {
        await db.testDatabaseConnection();
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Server is running and database is connected." }));
    } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: err }));
    }
};