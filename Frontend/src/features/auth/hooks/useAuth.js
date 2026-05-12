import { useContext } from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, logout, register } from "../services/auth.api.js";

export const useAuth = () => {
    const { user, setUser, loading, setLoading } = useContext(AuthContext);

    const handleLogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            // ✅ Cookie is set automatically by browser
            // No token in response — backend only sends cookie
            setUser(data?.user);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            setUser(null);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true);
        try {
            const data = await register({ username, email, password });
            setUser(data?.user || null);
            return true;
        } catch (error) {
            console.error("Register failed:", error);
            setUser(null);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            // ✅ Cookie is cleared by backend, just clear user state
            setUser(null);
            setLoading(false);
        }
    };

    return { user, loading, handleLogin, handleRegister, handleLogout };
};