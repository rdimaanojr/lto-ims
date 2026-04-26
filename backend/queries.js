import db from './db.js';

export const testDatabaseConnection = async () => {
    const [rows] = await db.execute("SELECT 1");
    return rows;
}

// REQUIRED SPECIFICATION QUERIES =================================================================

// 1. View all registered drivers filtered by: License type, License status, Age range, Sex
export const selectFilteredDrivers = async (type, status, sex, minAge, maxAge) => {
    const sql = `
        SELECT *
        FROM driver
        WHERE
            (? IS NULL OR license_type = ?)
            AND (? IS NULL OR license_status = ?)
            AND (? IS NULL OR sex = ?)
            AND (age >= COALESCE(?, 0))
            AND (age <= COALESCE(?, 999))
        ORDER BY
            full_name ASC;
    `;
    const [rows] = await db.execute(sql, [type, type, status, status, sex, sex, minAge, maxAge]);
    return rows;
}

// 2. View all vehicles owned by a given driver.
export const selectVehiclesByLicense = async (licenseNumber) => {
    const sql = `
        SELECT
            v.*,
            m.make,
            m.vehicle_type
        FROM vehicle v4. View all drivers with expired or suspended licenses.
        JOIN vehicle_model m ON v.model = m.model
        WHERE
            v.license_number = ?
        ORDER BY
            v.year DESC;
    `;
    const [rows] = await db.execute(sql, [licenseNumber]);
    return rows;
};

// 3. View all vehicles with expired registrations as of a given date.
export const selectExpiredVehiclesAsOfDate = async (givenDate) => {
    const sql = `
        SELECT
            r.registration_number,
            r.plate_number,
            v.model,
            v.vehicle_type,
            v.color,
            r.registration_date,
            r.expiration_date,
            r.registration_status,
        FROM registration r
        JOIN vehicle v ON r.plate_number = v.plate_number
        JOIN vehicle_model m ON v.model = m.model
        WHERE
            r.expiration_date < ?
            OR r.registration_status = \`expired\`
        ORDER BY
            r.expiration_date ASC;
    `;
    const [rows] = await db.execute(sql, [givenDate]);
    return rows;
};

// 4. View all drivers with expired or suspended licenses.
export const selectDriversWithExpiredOrSuspendedLicense = async () => {
    const sql = `
        SELECT *
        FROM driver
        WHERE
            licease_status IN ('expired', 'suspended', 'revoked')
            OR expiry_date < CURDATE() -- catch unupdated status
        ORDER BY
            expiry_date ASC;
    `;
    const [rows] = await db.execute(sql);
    return rows;
};

// 5. View all traffic violations committed by a given driver within a specified date range.
export const selectViolationsByDriverWithinDate = async (licenseNumber, startDate, endDate) => {
    const sql = `
        SELECT *
        FROM violation
        WHERE
        license_number = ?
        AND date >= ?
        AND date <= ?
        ORDER BY date DESC;
    `;
    const [rows] = await db.execute(sql, [licenseNumber, startDate, endDate]);
    return rows;
};

// 6. View the total number of violations per violation type for a given year.
export const selectTotalViolationsPerTypeByYear = async (givenYear) => {
    const sql = `
        SELECT
            violation_type,
            COUNT(*) AS total_violations
        FROM violation
        WHERE
            YEAR(date) = ?
        GROUP BY violation_type
        ORDER BY
            total_violations DESC;
    `;
    const [rows] = await db.execute(sql, [givenYear]);
    return rows;
};

// 7. View all vehicles involved in violations within a given city or region. 
export const selectVehiclesWithViolationsByLocation = async (givenLocation) => {
    const sql = `
        SELECT
            v.*,
            m.make,
            m.vehicle_type,
            vio.violation_type
            vio.location,
            vio.date
        FROM vehicle v
        JOIN violation vio ON v.plate_number = vio.plate_number
        JOIN vehicle_model m ON v.model = m.model
        WHERE
            vio.location REGEXP ?
        ORDER BY
            vio.location ASC,
            vio.date DESC;
    `;
    const [rows] = await db.execute(sql, [givenLocation]);
    return rows;
};