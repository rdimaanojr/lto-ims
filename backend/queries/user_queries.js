import db from "../db.js";

export const  selectAllLicenseNumbers = async () => {
    const [rows] = await db.execute("SELECT license_number FROM driver");
    return rows.map(row => row.license_number);
}

export const selectAllPlateNumbers = async () => {
    const [rows] = await db.execute("SELECT plate_number FROM vehicle");
    return rows.map(row => row.plate_number);
}