import { request } from "../utils.js";

export const reportsApi = {
    getDriversFiltered: (type, status, sex, minAge, maxAge) => 
        request(`/api/reports/drivers-filtered?type=${type}&status=${status}&sex=${sex}&minAge=${minAge}&maxAge=${maxAge}`, 'GET'),

    getVehiclesByLicense: (licenseNumber) => 
        request(`/api/reports/vehicles-by-license?licenseNumber=${licenseNumber}`, 'GET'),

    getExpiredVehiclesAsOfDate: (date) => 
        request(`/api/reports/expired-vehicles-by-date?date=${date}`, 'GET'),

    getExpiredLicenseDrivers: () => 
        request('/api/reports/drivers-expired-license', 'GET'),

    getViolationsByDriverWithinDate: (licenseNumber, startDate, endDate) => 
        request(`/api/reports/violations-by-driver-within-date?licenseNumber=${licenseNumber}&startDate=${startDate}&endDate=${endDate}`, 'GET'),

    getTotalViolationsByYear: (year) => 
        request(`/api/reports/violations-total-by-year?year=${year}`, 'GET'),

    getVehiclesWithViolationsByLocation: (location) => 
        request(`/api/reports/vehicles-violations-by-location?location=${location}`, 'GET')
};