import { authorize, authorizeAdmin } from './authorization.js';
import * as authEndpoints from './auth_endpoints.js';
import * as reportsEndpoints from './reports_endpoints.js';
import * as endpoints from './endpoints.js';

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

export const handleRequest = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    // pre-flight check
    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    const key = `${req.method} ${req.url.split('?')[0]}`;
    const route = routes[key];

    if (!route) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Route not found" }));
    }

    let session = null;
    try {
        if (route.guard) {
            session = route.guard(req);
        }
        await route.handler(req, res, session);
    } catch (err) {
        if (err.message === "UNAUTHENTICATED") {
            res.writeHead(401);
            res.end(JSON.stringify({ error: "User not logged in" }));
        } else if (err.message === "UNAUTHORIZED") {
            res.writeHead(403);
            res.end(JSON.stringify({ error: "Unauthorized: Admin access required" }))
        } else {
            res.writeHead(500);
            res.end(JSON.stringify({ error: "Internal Server Error" }));
        }
    }
}