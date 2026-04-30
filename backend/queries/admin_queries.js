import db from "../db.js";

export const addDriver = (data) => {
    return db.execute(
        `INSERT INTO driver (license_number, full_name, date_of_birth, age, sex, address, license_type, issue_date, expiry_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.license_number, data.full_name, data.date_of_birth, data.age, data.sex, data.address, data.license_type, data.issue_date, data.expiry_date]
    );
};

// export const addVehicleModel = (data) => {
//     return db.execute(`INSERT INTO vehicle_model (model, make, vehicle_type) VALUES (?, ?, ?)`, 
//         [data.model, data.make, data.vehicle_type]);
// };

export const addVehicle = (data) => {
    return db.execute(
        `INSERT INTO vehicle (plate_number, engine_number, chassis_number, model, make, year, vehicle_type, color, license_number) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.plate_number, data.engine_number, data.chassis_number, data.model, data.make, data.year, data.vehicle_type, data.color, data.license_number]
    );
};

export const addRegistration = (data) => {
    return db.execute(
        `INSERT INTO registration (registration_date, expiration_date, plate_number) VALUES (?, ?, ?)`,
        [data.registration_date, data.expiration_date, data.plate_number]
    );
};

export const addViolation = (data) => {
    return db.execute(
        `INSERT INTO violation (violation_type, date, location, apprehending_officer, fine_amount, license_number, plate_number) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.violation_type, data.date, data.location, data.apprehending_officer, data.fine_amount, data.license_number, data.plate_number]
    );
};

export const getAllDrivers = async () => {
    const [rows] = await db.execute("SELECT * FROM driver");
    return rows;
};

export const getAllVehicleModels = async () => {
    const [rows] = await db.execute("SELECT * FROM vehicle_model");
    return rows;
};

export const getAllVehicles = async () => {
    const [rows] = await db.execute("SELECT * FROM vehicle");
    return rows;
};

export const getAllRegistrations = async () => {
    const [rows] = await db.execute("SELECT * FROM registration");
    return rows;
};

export const getAllViolations = async () => {
    const [rows] = await db.execute("SELECT * FROM violation");
    return rows;
};

export const getAllAccounts = async () => {
    const [rows] = await db.execute("SELECT id, username, role FROM account");
    return rows;
};

export const getCurrentAccounts = async () => {
    const [rows] = await db.execute("SELECT id, username, role FROM account WHERE is_approved = TRUE");
    return rows;
};

export const getPendingAccounts = async () => {
    const [rows] = await db.execute("SELECT id, username, role FROM account WHERE is_approved = FALSE");
    return rows;
};

export const approveAccount = (id) => {
    return db.execute("UPDATE account SET is_approved = TRUE WHERE id = ?", [id]);
};

export const rejectAccount = (id) => {
    return db.execute("DELETE FROM account WHERE id = ?", [id]);
};

export const deleteAccount = (id) => {
    return db.execute("DELETE FROM account WHERE id = ?", [id]);
};