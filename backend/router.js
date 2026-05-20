import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { authorize, authorizeAdmin } from './authorization.js';
import * as endpoints from './endpoints/endpoints.js';
import * as authEndpoints from './endpoints/auth_endpoints.js';
import * as userEndpoints from './endpoints/user_endpoints.js';
import * as reportsEndpoints from './endpoints/reports_endpoints.js';
import * as adminEndpoints from './endpoints/admin_endpoints.js';

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
    'GET /api/auth/me': {
        handler: authEndpoints.getAuthStatus,
        guard: authorize
    },
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

    // user endpoints - lookup helpers
    'GET /api/user/license-numbers': { handler: userEndpoints.getLicenseNumbers, guard: authorize },
    'GET /api/user/plate-numbers': { handler: userEndpoints.getPlateNumbers, guard: authorize },

    // user CRUD endpoints - Drivers
    'GET /api/user/drivers': { handler: userEndpoints.getAllDrivers, guard: authorize },
    'GET /api/user/driver': { handler: userEndpoints.getDriver, guard: authorize },
    'POST /api/user/driver': { handler: userEndpoints.addDriver, guard: authorize },
    'PUT /api/user/driver': { handler: userEndpoints.updateDriver, guard: authorize },
    'DELETE /api/user/driver': { handler: userEndpoints.deleteDriver, guard: authorize },

    // user CRUD endpoints - Vehicles
    'GET /api/user/vehicles': { handler: userEndpoints.getAllVehicles, guard: authorize },
    'GET /api/user/vehicle': { handler: userEndpoints.getVehicle, guard: authorize },
    'POST /api/user/vehicle': { handler: userEndpoints.addVehicle, guard: authorize },
    'PUT /api/user/vehicle': { handler: userEndpoints.updateVehicle, guard: authorize },
    'DELETE /api/user/vehicle': { handler: userEndpoints.deleteVehicle, guard: authorize },

    // user CRUD endpoints - Registrations
    'GET /api/user/registrations': { handler: userEndpoints.getAllRegistrations, guard: authorize },
    'GET /api/user/registration': { handler: userEndpoints.getRegistration, guard: authorize },
    'POST /api/user/registration': { handler: userEndpoints.addRegistration, guard: authorize },
    'PUT /api/user/registration': { handler: userEndpoints.updateRegistration, guard: authorize },
    'DELETE /api/user/registration': { handler: userEndpoints.deleteRegistration, guard: authorize },

    // user CRUD endpoints - Violations
    'GET /api/user/violations': { handler: userEndpoints.getAllViolations, guard: authorize },
    'GET /api/user/violation': { handler: userEndpoints.getViolation, guard: authorize },
    'POST /api/user/violation': { handler: userEndpoints.addViolation, guard: authorize },
    'PUT /api/user/violation': { handler: userEndpoints.updateViolation, guard: authorize },
    'DELETE /api/user/violation': { handler: userEndpoints.deleteViolation, guard: authorize },

    // admin endpoints  
    'POST /api/admin/add-driver': { handler: adminEndpoints.postAddDriver, guard: authorizeAdmin },
    'POST /api/admin/add-model': { handler: adminEndpoints.postAddModel, guard: authorizeAdmin },
    'POST /api/admin/add-vehicle': { handler: adminEndpoints.postAddVehicle, guard: authorizeAdmin },
    'POST /api/admin/add-registration': { handler: adminEndpoints.postAddRegistration, guard: authorizeAdmin },
    'POST /api/admin/add-violation': { handler: adminEndpoints.postAddViolation, guard: authorizeAdmin },
    'GET /api/admin/drivers': { handler: adminEndpoints.getDrivers, guard: authorizeAdmin },
    'GET /api/admin/models': { handler: adminEndpoints.getModels, guard: authorizeAdmin },
    'GET /api/admin/vehicles': { handler: adminEndpoints.getVehicles, guard: authorizeAdmin },
    'GET /api/admin/registrations': { handler: adminEndpoints.getRegistrations, guard: authorizeAdmin },
    'GET /api/admin/violations': { handler: adminEndpoints.getViolations, guard: authorizeAdmin },
    'GET /api/admin/accounts': { handler: adminEndpoints.getAccounts, guard: authorizeAdmin },
    'GET /api/admin/current-accounts': { handler: adminEndpoints.getCurrent, guard: authorizeAdmin },
    'GET /api/admin/pending-accounts': { handler: adminEndpoints.getPending, guard: authorizeAdmin },
    'POST /api/admin/approve-account': { handler: adminEndpoints.postApproveAccount, guard: authorizeAdmin },
    'POST /api/admin/reject-account': { handler: adminEndpoints.postRejectAccount, guard: authorizeAdmin },
    'DELETE /api/admin/delete-account': { handler: adminEndpoints.postDeleteAccount, guard: authorizeAdmin },
    'DELETE /api/admin/delete-driver': { handler: adminEndpoints.deleteDriver, guard: authorizeAdmin },
    'DELETE /api/admin/delete-vehicle': { handler: adminEndpoints.deleteVehicle, guard: authorizeAdmin },
    'DELETE /api/admin/delete-registration': { handler: adminEndpoints.deleteRegistration, guard: authorizeAdmin },
    'DELETE /api/admin/delete-violation': { handler: adminEndpoints.deleteViolation, guard: authorizeAdmin },
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.join(__dirname, '..');

const APP_PATHS = [
    '/',
    '/dashboard',
    '/crud',
    '/admin',
]

const USER_SRC_FILES = [
    // pages
    '/src/pages/Dashboard.js',
    '/src/pages/CRUD.js',

    //components
    // '/src/components/Navbar.js'
];

const ADMIN_SRC_FILES = [
    // pages
    '/src/pages/AdminDashboard.js'
]

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

export const handleRequest = async (req, res) => {
    // CORS headers
    const origin = req.headers.origin || FRONTEND_URL;
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
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
                authorizeAdmin(req);
                return serveFile(url, req, res, false);
            } catch (err) {
                res.writeHead(403);
                return res.end(JSON.stringify({ message: "Admin access required" }));
            }
        }

        if (USER_SRC_FILES.includes(url)) {
            try {
                authorize(req);
                return serveFile(url, req, res, false);
            } catch (err) {
                res.writeHead(401);
                return res.end(JSON.stringify({ message: "Login required" }));
            }
        }

        return serveFile(url, req, res);
    }

    // fallback. return to index.html on refresh or unkown GET request
    if (req.method === 'GET' && (url === '/' || APP_PATHS.includes(url))) {
        res.setHeader('Content-Type', 'text/html');
        return fs.createReadStream(path.join(PROJECT_ROOT, 'frontend', 'public', 'index.html')).pipe(res);
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
    const filePath = path.join(PROJECT_ROOT, 'frontend', url);

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
            res.setHeader('Cache-Control', 'public, no-cache');
        } else {
            res.setHeader('Cache-Control', 'private, no-cache');
        }

        const ext = path.extname(filePath);
        const mimeTypes = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };
        res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain');

        return res.end(fileContent);
    }

    res.writeHead(404);
    res.end(JSON.stringify({ message: "File not found" }));
}
