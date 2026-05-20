import * as user from '../queries/user_queries.js';
import { getJsonBody } from '../utils.js';

// Helper to get query parameter from URL
const getQueryParam = (req, param) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return url.searchParams.get(param);
};

// Existing endpoints - keep these
export const getLicenseNumbers = async (req, res) => {
    try {
        const data = await user.selectAllLicenseNumbers();
        res.end(JSON.stringify({ license_numbers: data }));
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to retrieve license numbers" }));
    }
}

export const getPlateNumbers = async (req, res) => {
    try {
        const data = await user.selectAllPlateNumbers();
        res.end(JSON.stringify({ plate_numbers: data }));
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to retrieve plate numbers" }));
    }
}

// ==========================================
// DRIVER CRUD ENDPOINTS
// ==========================================

// GET /api/user/drivers - Get all drivers
export const getAllDrivers = async (req, res) => {
    try {
        const db = (await import('../db.js')).default;
        const [rows] = await db.execute("SELECT * FROM driver");
        res.end(JSON.stringify(rows));
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to retrieve drivers" }));
    }
};

// GET /api/user/driver?license_number=xxx - Get specific driver
export const getDriver = async (req, res) => {
    try {
        const licenseNumber = getQueryParam(req, 'license_number');
        if (!licenseNumber) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "License number required" }));
        }
        const data = await user.getDriverByLicense(licenseNumber);
        if (!data) {
            res.writeHead(404);
            return res.end(JSON.stringify({ error: "Driver not found" }));
        }
        res.end(JSON.stringify(data));
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to retrieve driver" }));
    }
};

// POST /api/user/driver - Add new driver
export const addDriver = async (req, res) => {
    try {
        const data = await getJsonBody(req);
        await user.addDriver(data);
        res.writeHead(201);
        res.end(JSON.stringify({ message: "Driver added successfully" }));
    } catch (err) {
        console.error(err);
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Failed to add driver: " + err.message }));
    }
};

// PUT /api/user/driver - Update driver
export const updateDriver = async (req, res) => {
    try {
        const data = await getJsonBody(req);
        await user.updateDriver(data);
        res.end(JSON.stringify({ message: "Driver updated successfully" }));
    } catch (err) {
        console.error(err);
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Failed to update driver: " + err.message }));
    }
};

// DELETE /api/user/driver?license_number=xxx - Delete driver
export const deleteDriver = async (req, res) => {
    try {
        const licenseNumber = getQueryParam(req, 'license_number');
        if (!licenseNumber) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "License number required" }));
        }
        await user.deleteDriverByLicense(licenseNumber);
        res.end(JSON.stringify({ message: "Driver deleted successfully" }));
    } catch (err) {
        console.error(err);
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Failed to delete driver: " + err.message }));
    }
};

// ==========================================
// VEHICLE CRUD ENDPOINTS
// ==========================================

// GET /api/user/vehicles - Get all vehicles
export const getAllVehicles = async (req, res) => {
    try {
        const db = (await import('../db.js')).default;
        const [rows] = await db.execute("SELECT * FROM vehicle");
        res.end(JSON.stringify(rows));
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to retrieve vehicles" }));
    }
};

// GET /api/user/vehicle?plate_number=xxx - Get specific vehicle
export const getVehicle = async (req, res) => {
    try {
        const plateNumber = getQueryParam(req, 'plate_number');
        if (!plateNumber) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "Plate number required" }));
        }
        const data = await user.getVehicleByPlate(plateNumber);
        if (!data) {
            res.writeHead(404);
            return res.end(JSON.stringify({ error: "Vehicle not found" }));
        }
        res.end(JSON.stringify(data));
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to retrieve vehicle" }));
    }
};

// POST /api/user/vehicle - Add new vehicle
export const addVehicle = async (req, res) => {
    try {
        const data = await getJsonBody(req);
        await user.addVehicle(data);
        res.writeHead(201);
        res.end(JSON.stringify({ message: "Vehicle added successfully" }));
    } catch (err) {
        console.error(err);
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Failed to add vehicle: " + err.message }));
    }
};

// PUT /api/user/vehicle - Update vehicle
export const updateVehicle = async (req, res) => {
    try {
        const data = await getJsonBody(req);
        await user.updateVehicle(data);
        res.end(JSON.stringify({ message: "Vehicle updated successfully" }));
    } catch (err) {
        console.error(err);
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Failed to update vehicle: " + err.message }));
    }
};

// DELETE /api/user/vehicle?plate_number=xxx - Delete vehicle
export const deleteVehicle = async (req, res) => {
    try {
        const plateNumber = getQueryParam(req, 'plate_number');
        if (!plateNumber) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "Plate number required" }));
        }
        await user.deleteVehicleByPlate(plateNumber);
        res.end(JSON.stringify({ message: "Vehicle deleted successfully" }));
    } catch (err) {
        console.error(err);
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Failed to delete vehicle: " + err.message }));
    }
};

// ==========================================
// REGISTRATION CRUD ENDPOINTS
// ==========================================

// GET /api/user/registrations - Get all registrations
export const getAllRegistrations = async (req, res) => {
    try {
        const db = (await import('../db.js')).default;
        const [rows] = await db.execute("SELECT * FROM registration");
        res.end(JSON.stringify(rows));
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to retrieve registrations" }));
    }
};

// GET /api/user/registration?registration_number=xxx - Get specific registration
export const getRegistration = async (req, res) => {
    try {
        const registrationNumber = getQueryParam(req, 'registration_number');
        if (!registrationNumber) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "Registration number required" }));
        }
        const data = await user.getRegistrationByNumber(registrationNumber);
        if (!data) {
            res.writeHead(404);
            return res.end(JSON.stringify({ error: "Registration not found" }));
        }
        res.end(JSON.stringify(data));
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to retrieve registration" }));
    }
};

// POST /api/user/registration - Add new registration
export const addRegistration = async (req, res) => {
    try {
        const data = await getJsonBody(req);
        await user.addRegistration(data);
        res.writeHead(201);
        res.end(JSON.stringify({ message: "Registration added successfully" }));
    } catch (err) {
        console.error(err);
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Failed to add registration: " + err.message }));
    }
};

// PUT /api/user/registration - Update registration
export const updateRegistration = async (req, res) => {
    try {
        const data = await getJsonBody(req);
        await user.updateRegistration(data);
        res.end(JSON.stringify({ message: "Registration updated successfully" }));
    } catch (err) {
        console.error(err);
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Failed to update registration: " + err.message }));
    }
};

// DELETE /api/user/registration?registration_number=xxx - Delete registration
export const deleteRegistration = async (req, res) => {
    try {
        const registrationNumber = getQueryParam(req, 'registration_number');
        if (!registrationNumber) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "Registration number required" }));
        }
        await user.deleteRegistrationByNumber(registrationNumber);
        res.end(JSON.stringify({ message: "Registration deleted successfully" }));
    } catch (err) {
        console.error(err);
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Failed to delete registration: " + err.message }));
    }
};

// ==========================================
// VIOLATION CRUD ENDPOINTS
// ==========================================

// GET /api/user/violations - Get all violations
export const getAllViolations = async (req, res) => {
    try {
        const db = (await import('../db.js')).default;
        const [rows] = await db.execute("SELECT * FROM violation");
        res.end(JSON.stringify(rows));
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to retrieve violations" }));
    }
};

// GET /api/user/violation?violation_id=xxx - Get specific violation
export const getViolation = async (req, res) => {
    try {
        const violationId = getQueryParam(req, 'violation_id');
        if (!violationId) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "Violation ID required" }));
        }
        const data = await user.getViolationById(violationId);
        if (!data) {
            res.writeHead(404);
            return res.end(JSON.stringify({ error: "Violation not found" }));
        }
        res.end(JSON.stringify(data));
    } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "Failed to retrieve violation" }));
    }
};

// POST /api/user/violation - Add new violation
export const addViolation = async (req, res) => {
    try {
        const data = await getJsonBody(req);
        await user.addViolation(data);
        res.writeHead(201);
        res.end(JSON.stringify({ message: "Violation added successfully" }));
    } catch (err) {
        console.error(err);
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Failed to add violation: " + err.message }));
    }
};

// PUT /api/user/violation - Update violation
export const updateViolation = async (req, res) => {
    try {
        const data = await getJsonBody(req);
        await user.updateViolation(data);
        res.end(JSON.stringify({ message: "Violation updated successfully" }));
    } catch (err) {
        console.error(err);
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Failed to update violation: " + err.message }));
    }
};

// DELETE /api/user/violation?violation_id=xxx - Delete violation
export const deleteViolation = async (req, res) => {
    try {
        const violationId = getQueryParam(req, 'violation_id');
        if (!violationId) {
            res.writeHead(400);
            return res.end(JSON.stringify({ error: "Violation ID required" }));
        }
        await user.deleteViolationById(violationId);
        res.end(JSON.stringify({ message: "Violation deleted successfully" }));
    } catch (err) {
        console.error(err);
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Failed to delete violation: " + err.message }));
    }
};