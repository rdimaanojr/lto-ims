import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { authorize, authorizeAdmin } from './authorization.js';
import * as authEndpoints from './endpoints/auth_endpoints.js';
import * as reportsEndpoints from './endpoints/reports_endpoints.js';
import * as endpoints from './endpoints/endpoints.js';

const routes = {
    // format: 'METHOD <route>': { handler: endpoint function, guard: authorization function }
    'GET /api/test': { 
        handler: endpoints.testConnection,
        guard: null
    },

    // required queries
    'GET /api/reports/drivers-filtered': {
        handler: reportsEndpoints.getDriversFiltered,
        guard: authorize
    },
    'GET /api/reports/vehicles-by-license': {
        handler: reportsEndpoints.getVehiclesByLicense,
        guard: authorize,
    },
    'GET /api/reports/expired-vehicles-by-date': {
        handler: reportsEndpoints.getExpiredVehiclesAsOfDate,
        guard: authorize
    },
    'GET /api/reports/drivers-expired-license': {
        handler: reportsEndpoints.getExpiredLicenseDrivers,
        guard: authorize
    },
    'GET /api/reports/violations-by-driver-within-date': {
        handler: reportsEndpoints.getViolationsByDriverWithinDate,
        guard: authorize
    },
    'GET /api/reports/violations-total-by-year': {
        handler: reportsEndpoints.getTotalViolationsByYear,
        guard: authorize
    },
    'GET /api/reports/vehicles-violations-by-location': {
        handler: reportsEndpoints.getVehiclesWithViolationsByLocation,
        guard: authorize
    },

    // auth endpoints
    'POST /api/auth/register': {
        handler: authEndpoints.postRegister,
        guard: null
    },
    'POST /api/auth/login': {
        handler: authEndpoints.postLogin,
        guard: null
    },
    'POST /api/auth/logout': {
        handler: authEndpoints.postLogout,
        guard: authorize
    },
    'GET /api/auth/pending': {
        handler: authEndpoints.getPendingUsers,
        guard: authorizeAdmin
    },
    'POST /api/auth/approve': {
        handler: authEndpoints.postApproveUser,
        guard: authorizeAdmin
    },
    'POST /api/auth/reject': {
        handler: authEndpoints.postRejectUser,
        guard: authorizeAdmin
    },
};

const app_paths = [
    '/',
    '/dashboard',
    '/admin',
]

const USER_SRC_FILES = [
    // pages
    '/src/pages/Dashboard.js',

    //components
    '/src/components/Navbar.js'
];

const ADMIN_SRC_FILES = [
    // pages
    '/src/pages/AdminDashboard.js'
]

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

export const handleRequest = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // pre-flight check
    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // api routing
    const url = req.url.split('?')[0];
    const key = `${req.method} ${url}`;
    const route = routes[key];
    
    if (route) {
        res.setHeader('Content-Type', 'application/json');
        let session = null;
        try {
            if (route.guard) {
                session = route.guard(req);
            }
            await route.handler(req, res, session);
        } catch (err) {
            handleError(err, res);
        }
        return;
    }

    // source-serve gating
    if (url.startsWith('/src/')) {
        if (ADMIN_SRC_FILES.includes(url)) {
            try {
                console.log("Checking Admin Auth for:", url);
                authorizeAdmin(req);
                return serveFile(url, req, res, isPublic=false);
            } catch (err) {
                console.log("Admin Auth Failed:", err);
                res.writeHead(403);
                return res.end(JSON.stringify({ message: "Admin access required" }));
            }
        }

        if (USER_SRC_FILES.includes(url)) {
            try {
                console.log("Checking User Auth for:", url);
                authorize(req);
                return serveFile(url, req, res, isPublic=false);
            } catch (err) {
                 console.log("Auth Failed:", err);
                res.writeHead(401);
                return res.end(JSON.stringify({ message: "Login required" }));
            }
        }

        return serveFile(url, req, res);
    }

    // fallback. return to index.html on refresh or unkown GET request
    if (req.method === 'GET' &&  app_paths.includes(url)) {
        res.setHeader('Content-Type', 'text/html');
        return fs.createReadStream(path.join(process.cwd(), '..', 'frontend', 'public', 'index.html')).pipe(res);
    }

    res.writeHead(404);
    return res.end(JSON.stringify({ message: "Route not found" }));
}

const handleError = (err, res) => {
    if (res.headersSent) {
        console.error("Error occured after headers sent:", err);
        return;
    }
    if (err.message === "UNAUTHENTICATED") {
        res.writeHead(401);
        res.end(JSON.stringify({ error: "User not logged in" }));
    } else if (err.message === "UNAUTHORIZED") {
        res.writeHead(403);
        res.end(JSON.stringify({ error: "Unauthorized: Admin access required" }))
    } else {
        console.error("Unhandled error:", err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
}

const serveFile = (url, req, res, isPublic = true) => {
    const filePath = path.join(process.cwd(), '..', 'project127', 'frontend', url);
    console.log("Looking for file at:", filePath);
    
    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
        const fileStat = fs.statSync(filePath);
        const fileContent = fs.readFileSync(filePath);

        const etag = crypto.createHash('md5').update(fileContent).digest('hex');
        if (req.headers['if-none-match'] === etag) {
            res.writeHead(304);
            return res.end();
        }

        res.setHeader('ETag', etag);

        if (isPublic) {
            res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        } else {
            res.setHeader('Cache-Control', 'private, max-age=86400, must-revalidate');
        }

        const ext = path.extname(filePath);
        const mimeTypes = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };
        res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');
        
        return res.end(fileContent);
    }
    
    res.writeHead(404);
    res.end(JSON.stringify({ message: "File not found" }));
}
