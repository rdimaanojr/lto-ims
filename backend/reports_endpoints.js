import * as reports from './reports_queries.js';

export const getDriversFiltered = async (req, res) => {
    // parse params from the URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const licenseType = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const sex = url.searchParams.get('sex');
    const minAge = url.searchParams.get('minAge');
    const maxAge = url.searchParams.get('maxAge');

    const drivers = await db.selectFilteredDrivers(licenseType, status, sex, minAge, maxAge);
    res.end(JSON.stringify(drivers));
}

export const getVehiclesByLicense = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const licenseNumber = url.searchParams.get('licenseNumber');

    const vehicles = await db.selectVehiclesByLicense(licenseNumber);
    res.end(JSON.stringify(vehicles));
};

export const getExpiredVehiclesAsOfDate = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const date = url.searchParams.get('date');

    const vehicles = await db.selectExpiredVehiclesAsOfDate(date);
    res.end(JSON.stringify(vehicles));
}

export const getExpiredLicenseDrivers = async (req, res) => {
    const drivers = await db.selectDriversWithExpiredOrSuspendedLicense();
    res.end(JSON.stringify(drivers));
};

export const getViolationsByDriverWithinDate = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const licenseNumber = url.searchParams.get('licenseNumber');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    const violations = await db.selectViolationsByDriverWithinDate(licenseNumber, startDate, endDate);
    res.end(JSON.stringify(violations));
}

export const getTotalViolationsByYear = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const year = url.searchParams.get('year');

    const violationTypesCount = await db.selectTotalViolationsPerTypeByYear(year);
    res.end(JSON.stringify(violationTypesCount));
};

export const getVehiclesWithViolationsByLocation = async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const location = url.searchParams.get('location');

    const vehicles = await db.selectVehiclesWithViolationsByLocation(location);
    res.end(JSON.stringify(vehicles));
};