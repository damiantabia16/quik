import { createContext, useEffect, useState } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from '../api/auth.js'
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [ user, setUser ] = useState(null);
    const [ isAuth, setIsAuth ] = useState(false);
    const [ errors, setErrors ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const signUp = async (user) => {
        try {
            const res = await registerRequest(user);
            setUser(res.data);
            setIsAuth(true);
        } catch (error) {
            setErrors(error.response.data);
        }
    };

    const signIn = async (user) => {
        try {
            const res = await loginRequest(user);
            setUser(res.data);
            setIsAuth(true);
        } catch (error) {
            setErrors(error.response.data)
        }
    };

    const logOut = () => {
        Cookies.remove('token');
        setUser(null);
        setIsAuth(false);
    }

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([])
            }, 5000)
            return () => clearTimeout(timer);
        };
    }, [errors]);

    useEffect(() => {
        const checkLogin = async () => {
            const cookies = Cookies.get();

            if (!cookies.token) {
                setIsAuth(false);
                setUser(null);
                setLoading(false);
                return;
            }
            try {
                const res = await verifyTokenRequest(cookies.token)
                if (!res.data) {
                    setIsAuth(false);
                    setLoading(false);
                    return;
                }
                setIsAuth(true);
                setUser(res.data);
                setLoading(false);
            } catch (error) {
                setIsAuth(false);
                setUser(null);
                setLoading(false);
            }
        }
        checkLogin();
    }, [])

    const exports = {
        user,
        signUp,
        isAuth,
        errors,
        signIn,
        loading,
        logOut
    };

    return (
        <AuthContext.Provider value={exports}>
            {children}
        </AuthContext.Provider>
    )
};