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
        res.writeHead(400);
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

const getId = (req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    return url.searchParams.get('id');
};

export const getAccounts = async (req, res) => {
    const data = await admin.getAllAccounts();
    res.end(JSON.stringify({ data }));
};

export const getCurrent = async (req, res) => {
    const data = await admin.getCurrentAccounts();
    res.end(JSON.stringify({ data }));
};

export const getPending = async (req, res) => {
    const data = await admin.getPendingAccounts();
    res.end(JSON.stringify({ data }));
};

export const postApproveAccount = async (req, res) => {
    const id = getId(req);
    await admin.approveAccount(id);
    res.end(JSON.stringify({ status: 200, message: "Approved" }));
};

export const postRejectAccount = async (req, res) => {
    const id = getId(req);
    await admin.rejectAccount(id);
    res.end(JSON.stringify({ status: 200, message: "Rejected" }));
};

export const postDeleteAccount = async (req, res) => {
    const id = getId(req);
    await admin.deleteAccount(id);
    res.end(JSON.stringify({ status: 200, message: "Deleted" }));
};