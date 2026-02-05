import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "../types/auth";
import { AuthApi } from "../api/auth";

type AuthContextValue = {
    user: AuthUser | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "auth_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);


    useEffect(() => {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        try {
            const parsed = JSON.parse(raw) as AuthUser;
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (parsed?.token) setUser(parsed);
        } catch {
            sessionStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    async function login(username: string, password: string) {
        const res = await AuthApi.login({ username, password });

        const next: AuthUser = {
            username,
            token: res.token,
            isOwner: username === "owner",
        };

        setUser(next);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    }

    function logout() {
        setUser(null);
        sessionStorage.removeItem(STORAGE_KEY);
    }

    const value = useMemo(() => ({ user, login, logout }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
    return ctx;
}
