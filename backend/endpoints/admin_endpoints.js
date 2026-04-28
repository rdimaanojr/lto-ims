import * as admin from '../queries/admin_queries.js';
import { getJsonBody } from '../utils.js';

const handleAdminPost = async (req, res, queryFn) => {
    try {
        const data = await getJsonBody(req);
        await queryFn(data);
        res.writeHead(201);
        res.end(JSON.stringify({ message: "Entry added successfully" }));
    } catch (err) {
        console.error(err);
        res.writeHead(400); // Usually constraint violations
        res.end(JSON.stringify({ error: "Failed to add entry: check constraints" }));
    }
};

export const postAddDriver = (req, res) => handleAdminPost(req, res, admin.addDriver);
export const postAddModel = (req, res) => handleAdminPost(req, res, admin.addVehicleModel);
export const postAddVehicle = (req, res) => handleAdminPost(req, res, admin.addVehicle);
export const postAddRegistration = (req, res) => handleAdminPost(req, res, admin.addRegistration);
export const postAddViolation = (req, res) => handleAdminPost(req, res, admin.addViolation);

export const getDrivers = async (req, res) => {
    const data = await admin.getAllDrivers();
    res.end(JSON.stringify(data));
};

export const getModels = async (req, res) => {
    const data = await admin.getAllVehicleModels();
    res.end(JSON.stringify(data));
};

export const getVehicles = async (req, res) => {
    const data = await admin.getAllVehicles();
    res.end(JSON.stringify(data));
};

export const getRegistrations = async (req, res) => {
    const data = await admin.getAllRegistrations();
    res.end(JSON.stringify(data));
};

export const getViolations = async (req, res) => {
    const data = await admin.getAllViolations();
    res.end(JSON.stringify(data));
};