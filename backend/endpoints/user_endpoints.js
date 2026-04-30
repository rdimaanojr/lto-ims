import * as user from '../queries/user_queries.js';
import { getJsonBody } from '../utils.js';

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