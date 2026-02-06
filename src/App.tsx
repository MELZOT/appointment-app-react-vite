import { Routes, Route } from "react-router-dom";
import CategoriesPage from "./pages/CategoriesPage";
import CategoryAppointmentsPage from "./pages/CategoryAppointmentsPage";
import AppointmentNewPage from "./pages/AppointmentNewPage";
import AppointmentEditPage from "./pages/AppointmentEditPage";
import LoginPage from "./pages/LoginPage";
import RequireOwner from "./auth/RequireOwner";
import AppLayout from "./layout/AppLayout";

export default function App() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                {/* public */}
                <Route path="/" element={<CategoriesPage />} />
                <Route path="/categories/:id" element={<CategoryAppointmentsPage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* owner only */}
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
            </Route>
        </Routes>
    );
}