import { request, buildQuery } from "../utils.js";

export const reportsApi = {
    getDriversFiltered: (params) => 
        request(`/api/reports/drivers-filtered?${buildQuery(params)}`, 'GET'),

    getVehiclesByLicense: (params) => 
        request(`/api/reports/vehicles-by-license?${buildQuery(params)}`, 'GET'),

    getExpiredVehiclesAsOfDate: (params) => 
        request(`/api/reports/expired-vehicles-by-date?${buildQuery(params)}`, 'GET'),

    getExpiredLicenseDrivers: () => 
        request('/api/reports/drivers-expired-license', 'GET'),

    getViolationsByDriverWithinDate: (params) => 
        request(`/api/reports/violations-by-driver-within-date?${buildQuery(params)}`, 'GET'),

    getTotalViolationsByYear: (params) => 
        request(`/api/reports/violations-total-by-year?${buildQuery(params)}`, 'GET'),

    getVehiclesWithViolationsByLocation: (params) => 
        request(`/api/reports/vehicles-violations-by-location?${buildQuery(params)}`, 'GET')
};