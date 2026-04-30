import { request } from '../utils/utils.js';

export const userApi = {
    getLicenseNumbers: () =>
        request('/api/user/license-numbers', 'GET'),

    getPlateNumbers: () =>
        request('/api/user/plate-numbers', 'GET')
};