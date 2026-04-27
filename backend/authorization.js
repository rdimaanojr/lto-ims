import { parseCookies } from "./utils";
import { getSessions } from "./session";

export const authorize = (req) => {
    const cookies = parseCookies(req.headers.cookie);
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