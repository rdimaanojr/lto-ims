import * as authEndpoints from './auth_endpoints.js';
import * as reportsEndpoints from './reports_endpoints.js';
import * as endpoints from './endpoints.js';

const routes = {
    // format: 'METHOD <route>': endpoint function
    'GET /api/test': endpoints.testConnection,

    // required queries
    'GET /api/reports/drivers-filtered': reportsEndpoints.getDriversFiltered,
    'GET /api/reports/vehicles-by-license': reportsEndpoints.getVehiclesByLicense,
    'GET /api/reports/expired-vehicles-by-date': reportsEndpoints.getExpiredVehiclesAsOfDate,
    'GET /api/reports/drivers-expired-license': reportsEndpoints.getExpiredLicenseDrivers,
    'GET /api/reports/violations-by-driver-within-date': reportsEndpoints.getViolationsByDriverWithinDate,
    'GET /api/reports/violations-total-by-year': reportsEndpoints.getTotalViolationsByYear,
    'GET /api/reports/vehicles-violations-by-location': reportsEndpoints.getVehiclesWithViolationsByLocation,

    // auth endpoints
    'POST /api/auth/register': authEndpoints.postRegister,
    'POST /api/auth/login': authEndpoints.postLogin,
    'GET /api/auth/pending': authEndpoints.getPendingUsers,
    'POST /api/auth/approve': authEndpoints.postApproveUser,
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
    const handler = routes[key];

    if (handler) {
        await handler(req, res);
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Route not found" }));
    }
}