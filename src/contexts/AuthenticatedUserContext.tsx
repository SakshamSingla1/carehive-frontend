import React, { useEffect, useMemo, useState} from "react";
import { type ColorTheme } from "../services/useColorThemeService";

interface AuthenticatedUserProviderType {
    children: React.ReactNode;
}

export interface AuthenticatedUserType {
    id: string;
    name: string;
    username: string;
    phone: string;
    email: string;
    role: string;
    token: string;
}

// ---------------- CONTEXT TYPES ----------------

export interface AuthenticatedUserContextType {
    isAuthDialogActive: boolean;
    syncAuthDialogActive: (value?: boolean) => void;

    user: AuthenticatedUserType | null;
    setAuthenticatedUser: (user: AuthenticatedUserType | null) => void;

    themes: ColorTheme[] | null;
    setThemes: (themes: ColorTheme[] | null) => void;

    defaultTheme: ColorTheme | null;
    setDefaultTheme: (theme: ColorTheme | null) => void;
}

// ---------------- DEFAULT CONTEXT ----------------

export const AuthenticatedUserContext = React.createContext<AuthenticatedUserContextType>({
    isAuthDialogActive: false,
    syncAuthDialogActive: () => {},

    user: null,
    setAuthenticatedUser: () => {},

    themes: null,
    setThemes: () => {},

    defaultTheme: null,
    setDefaultTheme: () => {},
});

// ---------------- PROVIDER ----------------

export const AuthenticatedUserProvider: React.FC<AuthenticatedUserProviderType> = ({ children }) => {
    const [isAuthDialogActive, setAuthDialogActive] = useState<boolean>(false);

    const [user, setAuthenticatedUser] = useState<AuthenticatedUserType | null>(() => {
        try {
            const stored = localStorage.getItem("user");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [themes, setThemes] = useState<ColorTheme[] | null>(() => {
        try {
            const stored = localStorage.getItem("themes");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    const [defaultTheme, setDefaultTheme] = useState<ColorTheme | null>(() => {
        try {
            const stored = localStorage.getItem("defaultTheme");
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    });

    // ---------------- SYNC AUTH DIALOG ----------------

    const syncAuthDialogActive = (value?: boolean) => {
        setAuthDialogActive(value ?? user === null);
    };

    // ---------------- LOCAL STORAGE SYNC ----------------

    useEffect(() => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
    }, [user]);

    useEffect(() => {
        if (themes) localStorage.setItem("themes", JSON.stringify(themes));
        else localStorage.removeItem("themes");
    }, [themes]);

    useEffect(() => {
        if (defaultTheme) localStorage.setItem("defaultTheme", JSON.stringify(defaultTheme));
        else localStorage.removeItem("defaultTheme");
    }, [defaultTheme]);

    // ---------------- PROVIDER VALUE ----------------

    const providerValue = useMemo(
        () => ({
            isAuthDialogActive,
            syncAuthDialogActive,

            user,
            setAuthenticatedUser,

            themes,
            setThemes,

            defaultTheme,
            setDefaultTheme,
        }),
        [isAuthDialogActive, user, themes, defaultTheme]
    );

    return (
        <AuthenticatedUserContext.Provider value={providerValue}>
            {children}
        </AuthenticatedUserContext.Provider>
    );
};
