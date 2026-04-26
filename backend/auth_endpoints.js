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

export const postLogin = async (req, res) => {
    try {
        const { username, password } = await getJsonBody(req);
        const user = await auth.findUserByUsername(username);

        if (!user) {
            res.writeHead(401);
            return res.end(JSON.stringify({ error: "Invalid username or password" }));
        }

        const loginHash = auth.hashPassword(password, user.salt);

        if (loginHash !== user.password_hash) {
            res.writeHead(401);
            return res.end(JSON.stringify({ error: "Invalid username or password" }));
        }

        if (!user.is_approved) {
            res.writeHead(403);
            return res.end(JSON.stringify({ error: "Pending account approval" }));
        }

        // success
        res.writeHead(200);
        res.end(JSON.stringify({ message: "Login successful", role: user.role }));
    } catch (err) {
        console.error("Login error:", err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Interval server error" }));
    }
};

export const getPendingUsers = async (req, res) => {
    try {
        const users = await auth.getPendingAccounts();
        res.writeHead(200);
        res.end(JSON.stringify(users));
    } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to fetch pending users" }));
    }
};

export const postApproveUser = async (req, res) => {
    try {
        const { userID } = await getJsonBody(req);
        await auth.approveAccount(userId);
        res.writeHead(200);
        res.end(JSON.stringify({ message: "User approved succesfuly" }));
    } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Approval failed" }));
    }
};