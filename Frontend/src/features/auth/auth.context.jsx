import React, { useState, useEffect } from "react";
import { createContext } from "react";
import { getMe } from "./services/auth.api.js"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getAndSetUser = async () => {

            // ✅ FIX 2: Don't call getMe() if no token exists
            const token = localStorage.getItem("token");

            if (!token || token === "undefined") {
                // ✅ FIX 3: Clean up bad token if it exists
                localStorage.removeItem("token");
                setUser(null);
                setLoading(false);
                return;
            }

            const data = await getMe();

            if (data && data.user) {
                setUser(data.user);
            } else {
                // ✅ FIX 4: If getMe() fails, clear the bad token
                localStorage.removeItem("token");
                setUser(null);
            }

            setLoading(false);
        };

        getAndSetUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;