import * as reports from '../queries/reports_queries.js';

export const getDriversFiltered = async (req, res, session) => {
    // parse params from the URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const licenseType = url.searchParams.get('license_type');
    const status = url.searchParams.get('status');
    const sex = url.searchParams.get('sex');
    const minAge = url.searchParams.get('minAge');
    const maxAge = url.searchParams.get('maxAge');

    const drivers = await reports.selectFilteredDrivers(licenseType, status, sex, minAge, maxAge);
    res.end(JSON.stringify(drivers));
}

export const getVehiclesByLicense = async (req, res, session) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const licenseNumber = url.searchParams.get('license_number');

    const vehicles = await reports.selectVehiclesByLicense(licenseNumber);
    res.end(JSON.stringify(vehicles));
};

export const getExpiredVehiclesAsOfDate = async (req, res, session) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const date = url.searchParams.get('date');

    const vehicles = await reports.selectExpiredVehiclesAsOfDate(date);
    res.end(JSON.stringify(vehicles));
}

export const getExpiredLicenseDrivers = async (req, res, session) => {
    const drivers = await reports.selectDriversWithExpiredOrSuspendedLicense();
    res.end(JSON.stringify(drivers));
};

export const getViolationsByDriverWithinDate = async (req, res, session) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const licenseNumber = url.searchParams.get('license_number');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    const violations = await reports.selectViolationsByDriverWithinDate(licenseNumber, startDate, endDate);
    res.end(JSON.stringify(violations));
}

export const getTotalViolationsByYear = async (req, res, session) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const year = url.searchParams.get('year');

    const violationTypesCount = await reports.selectTotalViolationsPerTypeByYear(year);
    res.end(JSON.stringify(violationTypesCount));
};

export const getVehiclesWithViolationsByLocation = async (req, res, session) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const location = url.searchParams.get('location');

    const vehicles = await reports.selectVehiclesWithViolationsByLocation(location);
    res.end(JSON.stringify(vehicles));
};