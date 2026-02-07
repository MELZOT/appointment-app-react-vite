import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";//

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                <NavLink to="/" className="font-semibold text-pink-600">
                    Appointment App
                </NavLink>

                <nav className="flex items-center gap-4 text-sm">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "text-gray-900 font-medium"
                                : "text-gray-600 hover:text-gray-900"
                        }
                    >
                        Categories
                    </NavLink>

                    {user ? (
                        <button
                            onClick={logout}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 hover:border-pink-200"
                        >
                            Logout ({user.username})
                        </button>
                    ) : (
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-gray-900 font-medium"
                                    : "text-gray-600 hover:text-gray-900"
                            }
                        >
                            Login
                        </NavLink>
                    )}
                </nav>
            </div>
        </header>
    );
}
