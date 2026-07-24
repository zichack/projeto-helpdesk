import { createContext, useState, useEffect } from 'react';
import { api } from '../services/api'; // Ajuste o caminho se necessário

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStorageData = async () => {
            const storageToken = localStorage.getItem('@HelpDesk:token');
            
            if (storageToken) {
                try {
                    // insere token no cabeçalho de todas as requisições futuras
                    api.defaults.headers.Authorization = `Bearer ${storageToken}`;
                    
                    // consulta API para validar se o token ainda é válido
                    const response = await api.get('/me');
                    setUser(response.data);
                } catch (error) {
                    localStorage.removeItem('@HelpDesk:token');
                    api.defaults.headers.Authorization = undefined;
                }
            }
            setLoading(false);
        };

        loadStorageData();
    }, []);

    const signIn = async (email, password) => {
        const response = await api.post('/login', { email, password });
        const { access_token, user } = response.data;

        localStorage.setItem('@HelpDesk:token', access_token);
        api.defaults.headers.Authorization = `Bearer ${access_token}`;
        
        setUser(user);
    };

    const signOut = () => {
        localStorage.removeItem('@HelpDesk:token');
        api.defaults.headers.Authorization = undefined;
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};