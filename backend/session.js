const sessions = new Map();

export const createSession = (user) => {
    const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);

    sessions.set(sessionId, {
        userId: user.id,
        username: user.username,
        role: user.role,
        createdAt: Date.now()
    });

    return sessionId;
}

export const getSessions = (sessionId) => {
    return sessions.get(sessionId);
}

export const deleteSession = (sessionId) => {
    sessions.delete(sessionId);
}