import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("owner"); // demo use
    const [password, setPassword] = useState("1234"); // demo use
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await login(username.trim(), password);
            navigate("/");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="mx-auto max-w-md">
            <h1 className="text-2xl font-semibold text-gray-900">Login</h1>
            <p className="mt-1 text-sm text-gray-500">Owner login για edit/delete.</p>

            {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <div>
                    <label className="text-sm text-gray-600">Username</label>
                    <input
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none focus:border-pink-300"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoComplete="username"
                    />
                </div>

                <div>
                    <label className="text-sm text-gray-600">Password</label>
                    <input
                        type="password"
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 outline-none focus:border-pink-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-pink-600 px-4 py-2 text-sm font-medium text-white hover:bg-pink-700 disabled:opacity-60"
                >
                    {submitting ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </div>
    );
}
