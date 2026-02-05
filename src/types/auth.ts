export type AuthUser = {
    username: string;
    token: string;
    isOwner: boolean;
};

export type LoginRequest = {
    username: string;
    password: string;
};

export type LoginResponse = {
    token: string;
};
