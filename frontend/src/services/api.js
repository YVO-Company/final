import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:4000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const companyId = localStorage.getItem('companyId');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Backend expects Bearer
        }
        if (companyId) {
            config.headers['x-company-id'] = companyId;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            const role = localStorage.getItem('userRole')?.toLowerCase();
            if (role === 'super_admin' || role === 'superadmin') {
                window.location.href = '/master-portal';
            } else if (role === 'admin') {
                window.location.href = '/company-login';
            } else {
                window.location.href = '/employee-login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
