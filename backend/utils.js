const MAX_BODY_SIZE = 1 * 1024 * 1024;

// boilerplate vanilla JSON parser-
export const getJsonBody = (req) => {
    return new Promise((resolve, reject) => {   
        let body = '';
        let receivedSize = 0;

        req.setEncoding('utf8');

        req.on('data', (chunk) => {
            receivedSize += chunk.length;

            if (receivedSize > MAX_BODY_SIZE) {
                req.destroy();
                return reject(new Error("Request too large"));
            }

            body += chunk;
        });

        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch {
                reject(new Error("Invalid JSON"));
            }
        });

        req.on('error', (err) => reject(err));
    });
}

export const parseCookies = (cookieHeader) => {
    const list = {};
    if (!cookieHeader) return list;

    cookieHeader.split(';').forEach(cookie => {
        const parts = cookie.split('=');
        if (parts.length === 2) {
            list[parts[0].trim()] = parts[1].trim();
        }
    });
    return list;
};