import { request } from "../utils.js";

export const mainApi = {
    login:  (username, password) => 
        request('/api/auth/login', 'POST', {username, password}),

    register: (username, password) => 
        request('/api/auth/register', 'POST', {username, password}),
    
    logout: () => 
        request('/api/auth/logout', 'POST'),
};