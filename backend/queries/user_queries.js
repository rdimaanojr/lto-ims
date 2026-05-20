import db from "../db.js";

// Driver CRUD operations for regular users
export const selectAllLicenseNumbers = async () => {
    const [rows] = await db.execute("SELECT license_number FROM driver");
    return rows;
};

export const selectAllPlateNumbers = async () => {
    const [rows] = await db.execute("SELECT plate_number FROM vehicle");
    return rows;
};

// Get a specific driver by license number
export const getDriverByLicense = async (licenseNumber) => {
    const [rows] = await db.execute("SELECT * FROM driver WHERE license_number = ?", [licenseNumber]);
    return rows[0] || null;
};

// Get a specific vehicle by plate number
export const getVehicleByPlate = async (plateNumber) => {
    const [rows] = await db.execute("SELECT * FROM vehicle WHERE plate_number = ?", [plateNumber]);
    return rows[0] || null;
};

// Get a specific registration by registration number
export const getRegistrationByNumber = async (registrationNumber) => {
    const [rows] = await db.execute("SELECT * FROM registration WHERE registration_number = ?", [registrationNumber]);
    return rows[0] || null;
};

// Get a specific violation by violation id
export const getViolationById = async (violationId) => {
    const [rows] = await db.execute("SELECT * FROM violation WHERE violation_id = ?", [violationId]);
    return rows[0] || null;
};

// Update driver
export const updateDriver = async (data) => {
    data.age = Math.floor((new Date() - new Date(data.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000));
    data.license_status = new Date(data.expiry_date) < new Date() ? 'expired' : 'valid';
    return db.execute(
        `UPDATE driver SET 
         full_name = ?, date_of_birth = ?, age = ?, sex = ?, address = ?, 
         license_type = ?, issue_date = ?, expiry_date = ?, license_status = ?
         WHERE license_number = ?`,
        [data.full_name, data.date_of_birth, data.age, data.sex, data.address, 
         data.license_type, data.issue_date, data.expiry_date, data.license_status, data.license_number]
    );
};

// Update vehicle
export const updateVehicle = async (data) => {
    return db.execute(
        `UPDATE vehicle SET 
         engine_number = ?, chassis_number = ?, model = ?, make = ?, year = ?, 
         vehicle_type = ?, color = ?, license_number = ?
         WHERE plate_number = ?`,
        [data.engine_number, data.chassis_number, data.model, data.make, data.year, 
         data.vehicle_type, data.color, data.license_number, data.plate_number]
    );
};

// Update registration
export const updateRegistration = async (data) => {
    data.registration_status = new Date(data.expiration_date) < new Date() ? 'expired' : 'active';
    return db.execute(
        `UPDATE registration SET 
         registration_date = ?, expiration_date = ?, registration_status = ?, plate_number = ?
         WHERE registration_number = ?`,
        [data.registration_date, data.expiration_date, data.registration_status, data.plate_number, data.registration_number]
    );
};

// Update violation
export const updateViolation = async (data) => {
    return db.execute(
        `UPDATE violation SET 
         violation_type = ?, date = ?, location = ?, apprehending_officer = ?, 
         fine_amount = ?, violation_status = ?, license_number = ?, plate_number = ?
         WHERE violation_id = ?`,
        [data.violation_type, data.date, data.location, data.apprehending_officer, 
         data.fine_amount, data.violation_status, data.license_number, data.plate_number, data.violation_id]
    );
};

// Delete operations (already have these in admin, but adding for completeness)
export const deleteDriverByLicense = async (licenseNumber) => {
    return db.execute("DELETE FROM driver WHERE license_number = ?", [licenseNumber]);
};

export const deleteVehicleByPlate = async (plateNumber) => {
    return db.execute("DELETE FROM vehicle WHERE plate_number = ?", [plateNumber]);
};

export const deleteRegistrationByNumber = async (registrationNumber) => {
    return db.execute("DELETE FROM registration WHERE registration_number = ?", [registrationNumber]);
};

export const deleteViolationById = async (violationId) => {
    return db.execute("DELETE FROM violation WHERE violation_id = ?", [violationId]);
};

// Add operations (same as admin but for user context)
export const addDriver = (data) => {
    data.age = Math.floor((new Date() - new Date(data.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000));
    data.license_status = new Date(data.expiry_date) < new Date() ? 'expired' : 'valid';
    return db.execute(
        `INSERT INTO driver (license_number, full_name, date_of_birth, age, sex, address, license_type, issue_date, expiry_date, license_status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.license_number, data.full_name, data.date_of_birth, data.age, data.sex, data.address, data.license_type, data.issue_date, data.expiry_date, data.license_status]
    );
};

export const addVehicle = (data) => {
    return db.execute(
        `INSERT INTO vehicle (plate_number, engine_number, chassis_number, model, make, year, vehicle_type, color, license_number) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.plate_number, data.engine_number, data.chassis_number, data.model, data.make, data.year, data.vehicle_type, data.color, data.license_number]
    );
};

export const addRegistration = (data) => {
    data.registration_status = new Date(data.expiration_date) < new Date() ? 'expired' : 'active';
    return db.execute(
        `INSERT INTO registration (registration_date, expiration_date, registration_status, plate_number)
         VALUES (?, ?, ?, ?)`,
        [data.registration_date, data.expiration_date, data.registration_status, data.plate_number]
    );
};

export const addViolation = (data) => {
    return db.execute(
        `INSERT INTO violation (violation_type, date, location, apprehending_officer, fine_amount, violation_status, license_number, plate_number) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [data.violation_type, data.date, data.location, data.apprehending_officer, data.fine_amount, data.violation_status, data.license_number, data.plate_number]
    );
};