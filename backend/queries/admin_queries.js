import db from "../db.js";

export const addDriver = (data) => {
    return db.execute(
        `INSERT INTO driver (license_number, full_name, date_of_birth, age, sex, address, license_type, issue_date, expiry_date) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.license_number, data.full_name, data.date_of_birth, data.age, data.sex, data.address, data.license_type, data.issue_date, data.expiry_date]
    );
};

export const addVehicleModel = (data) => {
    return db.execute(`INSERT INTO vehicle_model (model, make, vehicle_type) VALUES (?, ?, ?)`, 
        [data.model, data.make, data.vehicle_type]);
};

export const addVehicle = (data) => {
    return db.execute(
        `INSERT INTO vehicle (plate_number, engine_number, chassis_number, model, year, color, license_number) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [data.plate_number, data.engine_number, data.chassis_number, data.model, data.year, data.color, data.license_number]
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