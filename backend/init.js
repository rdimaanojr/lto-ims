import db from './db.js';

const initDriverTable = async () => {
    const sql = 
    `CREATE TABLE IF NOT EXISTS driver (
        license_number VARCHAR(20) PRIMARY KEY,
        full_name VARCHAR(90) NOT NULL,
        date_of_birth DATE NOT NULL,
        age INT,
        sex ENUM('M', 'F'),
        address VARCHAR(100),
        license_type ENUM('student_permit', 'non-professional', 'professional') NOT NULL,
        license_status ENUM('valid', 'expired', 'suspended', 'revoked') NOT NULL DEFAULT 'valid',
        issue_date DATE NOT NULL,
        expiry_date DATE NOT NULL
    )`;
    
    try {
        // store response to array. ResultSetHeader object
        // https://sidorares.github.io/node-mysql2/docs/examples/queries/prepared-statements/delete#resultsetheader
        const [results] = await db.query(sql);
        // check if table is created or already exists
        console.log(results.warningStatus === 0 ? "Table `driver` created." : "Table `driver` already exists.")
    } catch (err) {
        console.error("Error initializing `driver` table:", err);
        throw err;
    }
};

const initVehicleModelTable = async () => {
    const sql = 
    `CREATE TABLE IF NOT EXISTS vehicle_model (
        model VARCHAR(30) PRIMARY KEY,
        make VARCHAR(30) NOT NULL,
        vehicle_type VARCHAR(25) NOT NULL
    )`;

    try {
        const [results] = await db.query(sql);
        console.log(results.warningStatus === 0 ? "Table `vehicle_model` created." : "Table `vehicle_model` already exists.")
    } catch (err) {
        console.error("Error initializing `vehicle_model` table:", err);
        throw err;
    }
};

const initVehicleTable = async () => {
    const sql = 
    `CREATE TABLE IF NOT EXISTS vehicle (
        plate_number VARCHAR(10) PRIMARY KEY,
        engine_number VARCHAR(17) NOT NULL,
        chassis_number VARCHAR(17) NOT NULL,
        model VARCHAR(30) NOT NULL,
        year INT(4) NOT NULL,
        color VARCHAR(10),
        license_number VARCHAR(20) NOT NULL,
    
        -- Constraints
        CONSTRAINT vehicle_engine_number_uq UNIQUE (engine_number),
        CONSTRAINT vehicle_chassis_number_uq UNIQUE (chassis_number),
        CONSTRAINT vehicle_model_fk FOREIGN KEY (model) REFERENCES vehicle_model(model),
        CONSTRAINT vehicle_license_number_fk FOREIGN KEY(license_number) REFERENCES driver(license_number)
    )`;
    
    try {
        const [results] = await db.query(sql);
        console.log(results.warningStatus === 0 ? "Table `vehicle` created." : "Table `vehicle` already exists.")
    } catch (err) {
        console.error("Error initializing `vehicle` table:", err);
        throw err;
    }
};

const initRegistrationTable = async () => {
    const sql = 
    `CREATE TABLE IF NOT EXISTS registration (
        registration_number INT PRIMARY KEY AUTO_INCREMENT,
        registration_date DATE NOT NULL,
        registration_status ENUM('active', 'expired', 'suspended') NOT NULL DEFAULT 'active',
        expiration_date DATE,
        plate_number VARCHAR(10) NOT NULL,  

        -- Constraints
        CONSTRAINT registration_plate_number_fk FOREIGN KEY (plate_number) REFERENCES vehicle(plate_number)
    )`;
    
    try {
        const [results] = await db.query(sql);
        console.log(results.warningStatus === 0 ? "Table `registration` created." : "Table `registration` already exists.")
    } catch (err) {
        console.error("Error initializing `registration` table:", err);
        throw err;
    }
};

const initViolationTable = async () => {
    const sql = 
    `CREATE TABLE IF NOT EXISTS violation(
        violation_id INT PRIMARY KEY AUTO_INCREMENT,
        violation_type VARCHAR(25) NOT NULL,
        date DATE NOT NULL,
        location VARCHAR(100) NOT NULL,
        apprehending_officer VARCHAR(90),
        violation_status ENUM('unpaid', 'paid', 'contested') NOT NULL DEFAULT 'unpaid',
        fine_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        license_number VARCHAR(20) NOT NULL,
        plate_number VARCHAR (10) NOT NULL,

        -- Constraints
        CONSTRAINT violation_license_number_fk FOREIGN KEY (license_number) REFERENCES driver(license_number),
        CONSTRAINT violation_plate_number_fk FOREIGN KEY (plate_number) REFERENCES vehicle(plate_number)
    )`;
    
    try {
        const [results] = await db.query(sql);
        console.log(results.warningStatus === 0 ? "Table `violation` created." : "Table `violation` already exists.")
    } catch (err) {
        console.error("Error initializing `violation` table:", err);
        throw err;
    }
};

export const initializeDatabaseTables = async () => {
    try {
        console.log("Initializing database tables.");
        await initDriverTable();
        await initVehicleModelTable();
        await initVehicleTable();
        await initRegistrationTable();
        await initViolationTable();
    } catch (err) {
        console.error("Database initialization falied:", err);
        process.exit(1);
    }
};