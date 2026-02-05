import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
            <Header />

            <main className="flex-1 w-full">
                <div className="max-w-6xl mx-auto w-full p-6">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
}

