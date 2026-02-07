import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1">
                <div className="mx-auto max-w-6xl px-4 py-8">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
}
