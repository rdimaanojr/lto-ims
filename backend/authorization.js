import { parseCookies } from "./utils.js";
import { getSessions } from "./session.js";

export const authorize = (req) => {
    const cookies = parseCookies(req.headers.cookie);
    if (!cookies.sessionId) throw new Error("UNAUTHENTICATED");

    const session =  getSessions(cookies.sessionId);
    if (!session) {
        throw new Error("UNAUTHENTICATED");
    }
    return session;
}

export const authorizeAdmin = (req) => {
    const session = authorize(req);
    if (session.role !== 'admin') {
        throw new Error("UNAUTHORIZED");
    }
    return session;
}