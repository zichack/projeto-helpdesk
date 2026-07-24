import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

// interceptor para injetar o token em todas as requisições
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('@HelpDesk:token');
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

export default api;