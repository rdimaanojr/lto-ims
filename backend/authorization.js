import { parseCookies } from "./utils";
import { getSessions } from "./session";

export const authorize = (req) => {
    const cookies = parseCookies(req.headers.cookie);
    return getSessions(cookies.sessionId);
}

export const authorizeAdmin = (req) => {
    const session = authorize(req);
    if (!session || session.role !== 'admin') {
        return null;
    }
    return session;
}