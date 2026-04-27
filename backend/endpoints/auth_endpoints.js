import * as auth from '../queries/auth_queries.js';
import { createSession, getSessions, deleteSession } from '../session.js';
import { getJsonBody, parseCookies, hashPassword } from '../utils.js';

export const postRegister = async (req, res, session = {}) => {
    const cookies = parseCookies(req.headers.cookie);
    if (cookies.sessionId && getSessions(cookies.sessionId)) {
        res.writeHead(403);
        return res.end(JSON.stringify({ error: "A user is currently logged in" }));
    }

    try {
        const { username, password } = await getJsonBody(req);

        if (!username || !password) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "Missing fields."}));
        }

        const existingUser = await auth.findUserByIdOrUsername({ username: username });
        if (existingUser) {
            if (existingUser.is_approved) {
                res.writeHead(409);
                return res.end(JSON.stringify( {error: "Username already taken" } ));
            } else {
                res.writeHead(400);
                return res.end(JSON.stringify( {error: "Account already registered and awaiting approval" }));
            }
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
        res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
};

export const postLogin = async (req, res, session = {}) => {
    const cookies = parseCookies(req.headers.cookie);
    if (cookies.sessionId && getSessions(cookies.sessionId)) {
        res.writeHead(403);
        return res.end(JSON.stringify({ error: "A user is currently logged in" }));
    }

    try {
        const { username, password } = await getJsonBody(req);
        const user = await auth.findUserByIdOrUsername({ username: username });

        if (!user) {
            res.writeHead(401);
            return res.end(JSON.stringify({ error: "Invalid username or password" }));
        }

        const loginHash = hashPassword(password, user.salt);

        if (loginHash !== user.password_hash) {
            res.writeHead(401);
            return res.end(JSON.stringify({ error: "Invalid username or password" }));
        }

        if (!user.is_approved) {
            res.writeHead(403);
            return res.end(JSON.stringify({ error: "Pending account approval" }));
        }

        // success
        const sessionId = createSession(user);

        res.writeHead(200, {
            'Set-Cookie': `sessionId=${sessionId}; HttpOnly; Path=/`,
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({ message: "Login successful", role: user.role }));
    } catch (err) {
        console.error("Login error:", err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Interval server error" }));
    }
};

export const postLogout = async (req, res, session) => {
    if (session) {
        deleteSession(session.id);
    }

    res.writeHead(200, {
        'Set-Cookie': 'sessionId=; HttpOnly; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
        'Content-Type': 'application/json'
    });

    res.end(JSON.stringify({ message: "Logged out succesfully" }))
};

export const getPendingUsers = async (req, res, session) => {
    try {
        const users = await auth.getPendingAccounts();
        res.writeHead(200);
        res.end(JSON.stringify(users));
    } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to fetch pending users" }));
    }
};

export const postApproveUser = async (req, res, session) => {
    try {
        const { userId, username } = await getJsonBody(req);       
        if (!userId && !username) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "UserId or username not provided" }))
        }

        const user = await auth.findUserByIdOrUsername({ userId, username });

        if (!user) {
            res.writeHead(404);
            return res.end(stringify({ error: "User not found" }));
        }

        if (user.is_approved) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "User is already approved" }));
        }

        await auth.approveAccount(user.id);
        res.writeHead(200);
        res.end(JSON.stringify({ message: "User approved succesfuly" }));
    } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Approval failed" }));
    }
};

export const postRejectUser = async (req, res, session) => {
    try {
        const { userId, username } = await getJsonBody(req);
        if (!userId && !username) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "UserId or username not provided" }))
        }

        const user = await auth.findUserByIdOrUsername({ userId, username });

        if (!user) {
            res.writeHead(404);
            return res.end(stringify({ error: "User not found" }));
        }

        if (user.is_approved) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "Cannot reject approved user" }));
        }

        await auth.rejectAccount(user.id);
        res.writeHead(200);
        res.end(JSON.stringify({ message: "User rejected and account deleted" }));
    } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify( {error: "Rejection failed" }));
    }
}