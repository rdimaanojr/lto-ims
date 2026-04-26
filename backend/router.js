import * as authEndpoints from './auth_endpoints.js';
import * as endpoints from './endpoints.js';

const routes = {
    // format: 'METHOD <route>': endpoint function
    'GET /api/test': endpoints.testConnection,

    // required queries
    'GET /api/reports/drivers-filtered': endpoints.getDriversFiltered,
    'GET /api/reports/vehicles-by-license': endpoints.getVehiclesByLicense,
    'GET /api/reports/expired-vehicles-by-date': endpoints.getExpiredVehiclesAsOfDate,
    'GET /api/reports/drivers-expired-license': endpoints.getExpiredLicenseDrivers,
    'GET /api/reports/violations-by-driver-within-date': endpoints.getViolationsByDriverWithinDate,
    'GET /api/reports/violations-total-by-year': endpoints.getTotalViolationsByYear,
    'GET /api/reports/vehicles-violations-by-location': endpoints.getVehiclesWithViolationsByLocation,

    // auth endpoints
    'POST /api/auth/register': authEndpoints.postRegister,
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