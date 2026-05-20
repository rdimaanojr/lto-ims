import { request } from "../utils/utils.js";

export const crudApi = {
    // ==========================================
    // DRIVER CRUD API
    // ==========================================
    getDrivers: () =>
        request('/api/user/drivers', 'GET'),

    getDriver: (licenseNumber) =>
        request(`/api/user/driver?license_number=${encodeURIComponent(licenseNumber)}`, 'GET'),

    addDriver: (data) =>
        request('/api/user/driver', 'POST', data),

    updateDriver: (data) =>
        request('/api/user/driver', 'PUT', data),

    deleteDriver: (licenseNumber) =>
        request(`/api/user/driver?license_number=${encodeURIComponent(licenseNumber)}`, 'DELETE'),

    // ==========================================
    // VEHICLE CRUD API
    // ==========================================
    getVehicles: () =>
        request('/api/user/vehicles', 'GET'),

    getVehicle: (plateNumber) =>
        request(`/api/user/vehicle?plate_number=${encodeURIComponent(plateNumber)}`, 'GET'),

    addVehicle: (data) =>
        request('/api/user/vehicle', 'POST', data),

    updateVehicle: (data) =>
        request('/api/user/vehicle', 'PUT', data),

    deleteVehicle: (plateNumber) =>
        request(`/api/user/vehicle?plate_number=${encodeURIComponent(plateNumber)}`, 'DELETE'),

    // ==========================================
    // REGISTRATION CRUD API
    // ==========================================
    getRegistrations: () =>
        request('/api/user/registrations', 'GET'),

    getRegistration: (registrationNumber) =>
        request(`/api/user/registration?registration_number=${encodeURIComponent(registrationNumber)}`, 'GET'),

    addRegistration: (data) =>
        request('/api/user/registration', 'POST', data),

    updateRegistration: (data) =>
        request('/api/user/registration', 'PUT', data),

    deleteRegistration: (registrationNumber) =>
        request(`/api/user/registration?registration_number=${encodeURIComponent(registrationNumber)}`, 'DELETE'),

    // ==========================================
    // VIOLATION CRUD API
    // ==========================================
    getViolations: () =>
        request('/api/user/violations', 'GET'),

    getViolation: (violationId) =>
        request(`/api/user/violation?violation_id=${encodeURIComponent(violationId)}`, 'GET'),

    addViolation: (data) =>
        request('/api/user/violation', 'POST', data),

    updateViolation: (data) =>
        request('/api/user/violation', 'PUT', data),

    deleteViolation: (violationId) =>
        request(`/api/user/violation?violation_id=${encodeURIComponent(violationId)}`, 'DELETE'),
};