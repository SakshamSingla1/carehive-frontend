import React, { useEffect } from "react";
import { AuthenticatedUserContext } from "../contexts/AuthenticatedUserContext";
import { useNavigate } from "react-router-dom";

const isSessionExpired = (): boolean | null => {
    const lastReLoginTimestamp = localStorage.getItem("reLoginTimestamp");
    if (!lastReLoginTimestamp) return null;
    const diff = Date.now() - new Date(lastReLoginTimestamp).getTime();
    return diff >= 24 * 60 * 60 * 1000;
};

export const useAuthenticatedUser = () => {
    const context = React.useContext(AuthenticatedUserContext);
    const navigate = useNavigate();
    if (!context) {
        throw new Error("useAuthenticatedUser must be used within a AuthenticatedUserProvider");
    }

    useEffect(() => {
        const expired = isSessionExpired();

        if (expired === true) {
            const alreadyHandled = sessionStorage.getItem("sessionHandled");
            if (alreadyHandled === "true") return;

            sessionStorage.setItem("sessionHandled", "true");

            context.setAuthenticatedUser(null);
            context.setThemes(null);
            context.setDefaultTheme(null);
            context.setNavlinks(null);

            localStorage.removeItem("user");
            localStorage.removeItem("themes");
            localStorage.removeItem("defaultTheme");
            localStorage.removeItem("navlinks");
            localStorage.removeItem("reLoginTimestamp");

            alert("Session expired. Please log in again.");
            navigate("/");
        } 
        else if (expired === null) {
            context.setAuthenticatedUser(null);
            context.setThemes(null);
            context.setDefaultTheme(null);
            context.setNavlinks(null);

            localStorage.removeItem("user");
            localStorage.removeItem("themes");
            localStorage.removeItem("defaultTheme");
            localStorage.removeItem("navlinks");
            localStorage.removeItem("reLoginTimestamp");
        }
    }, [navigate]);

    return context;
};
