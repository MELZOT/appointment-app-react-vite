import { Routes, Route, NavLink } from "react-router-dom";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryAppointmentsPage from "./pages/CategoryAppointmentsPage";
import AppointmentNewPage from "./pages/AppointmentNewPage";
import AppointmentEditPage from "./pages/AppointmentEditPage";
import LoginPage from "./pages/LoginPage";
import RequireOwner from "./auth/RequireOwner";
import { useAuth } from "./auth/AuthContext";

export default function App() {
    const { user, logout } = useAuth();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
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

            {/* Main */}
            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8">
                    <Routes>
                        {/* public */}
                        <Route path="/" element={<CategoriesPage />} />
                        <Route path="/categories/:id" element={<CategoryAppointmentsPage />} />
                        <Route path="/login" element={<LoginPage />} />

                        {/*  owner only */}
                        <Route
                            path="/appointments/new"
                            element={
                                <RequireOwner>
                                    <AppointmentNewPage />
                                </RequireOwner>
                            }
                        />
                        <Route
                            path="/appointments/:id/edit"
                            element={
                                <RequireOwner>
                                    <AppointmentEditPage />
                                </RequireOwner>
                            }
                        />
                    </Routes>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-gray-400">
                    © 2026 Appointment App
                </div>
            </footer>
        </div>
    );
}
