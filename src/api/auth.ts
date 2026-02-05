import { api } from "./client";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const AuthApi = {
    login(body: LoginRequest): Promise<LoginResponse> {
        return api<LoginResponse>("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(body),
        });
    },
};
