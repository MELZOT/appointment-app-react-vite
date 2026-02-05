export class ApiError extends Error {
    status: number;
    bodyText?: string;

    constructor(status: number, message: string, bodyText?: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.bodyText = bodyText;
    }
}

type JsonErrorShape = {
    message?: string;
    error?: string;
    status?: number;
    path?: string;
};

export async function api<T>(url: string, options: RequestInit = {}): Promise<T> {
    const method = (options.method ?? "GET").toUpperCase();

    const raw = sessionStorage.getItem("auth_user");

    const authUser = raw ? (JSON.parse(raw) as { token?: string }) : null;

    const headers = new Headers(options.headers);

    if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    // Bearer token για POST / PUT / DELETE
    if (method !== "GET" && authUser?.token) {
        headers.set("Authorization", `Bearer ${authUser.token}`);
    }

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        let message = `HTTP ${res.status}`;
        let bodyText = "";

        try {
            bodyText = await res.text();

            if (bodyText) {
                if (ct.includes("application/json")) {
                    try {
                        const j: JsonErrorShape = JSON.parse(bodyText);
                        message = j.message || j.error || message;
                    } catch {

                        message = bodyText;
                    }
                } else {
                    message = bodyText;
                }
            }
        } catch {

        }

        throw new ApiError(res.status, message, bodyText);
    }

    if (res.status === 204) return undefined as T;

    const ct2 = res.headers.get("content-type") || "";
    if (!ct2.includes("application/json")) return undefined as T;

    return (await res.json()) as T;
}