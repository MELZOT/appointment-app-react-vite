import { NavLink } from "react-router-dom";

export default function Header() {
    return (
        <header className="bg-white border-b">
            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
                <h1 className="text-lg font-semibold text-pink-600">
                    Appointment App
                </h1>

                <nav className="flex gap-4 text-sm">
                    <NavLink to="/" className="hover:text-pink-500">
                        Categories
                    </NavLink>
                    <NavLink to="/login" className="hover:text-pink-500">
                        Login
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}
