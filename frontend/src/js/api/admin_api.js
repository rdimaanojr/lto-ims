import { request } from "../utils.js";

export const adminApi = {
    addDriver: (data) => 
        request('/api/admin/add-driver', 'POST', data),

    addVehicleModel: (data) => 
        request('/api/admin/add-model', 'POST', data),

    addVehicle: (data) => 
        request('/api/admin/add-vehicle', 'POST', data),

    addRegistration: (data) => 
        request('/api/admin/add-registration', 'POST', data),

    addViolation: (data) => 
        request('/api/admin/add-violation', 'POST', data),

    getAllDrivers: () => 
        request('/api/admin/drivers', 'GET'),

    getAllModels: () => 
        request('/api/admin/models', 'GET'),

    getAllVehicles: () => 
        request('/api/admin/vehicles', 'GET'),

    getAllRegistrations: () => 
        request('/api/admin/registrations', 'GET'),

    getAllViolations: () => 
        request('/api/admin/violations', 'GET'),
};