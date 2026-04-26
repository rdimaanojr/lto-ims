import * as auth from './auth_queries.js';
import { getJsonBody } from './utils.js';

export const postRegister = async (req, res) => {
    try {
        const { username, password } = await getJsonBody(req);

        if (!username || !password) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "Missing fields."}));
        }

        await auth.insertAccount(username, password);
        res.writeHead(201);
        res.end(JSON.stringify({ message: "Account registered. Wait for admin approval."}));
    } catch (err) {
        console.error("Registration error:", err);

        if (err.code === 'ER_DUP_ENTRY') {
            res.writeHead(409);
            return res.end(JSON.stringify({ error: "Username already taken" }));
        }

        res.writeHead(500);
        res.end(JSON.stringify({ error: "Server error" }));
    }
};