import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Appointment, AppointmentStatus } from "../types/appointment";
import type { Category } from "../types/category";
import AppointmentFilters from "../components/appointments/AppointmentFilters";
import AppointmentTable from "../components/appointments/AppointmentTable";
import { AppointmentsApi } from "../api/appointments";
import { CategoriesApi } from "../api/categories";

 import { useAuth } from "../auth/AuthContext";

export default function CategoryAppointmentsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const categoryId = Number(id);

    const { user } = useAuth();
    const isOwner = !!user?.isOwner;


    const [categories, setCategories] = useState<Category[]>([]);
    const [allAppointments, setAllAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [q, setQ] = useState("");
    const [status, setStatus] = useState<"ALL" | AppointmentStatus>("ALL");
    const [fromDate, setFromDate] = useState("");

    //  Load categories + appointments (μόνο αν το id είναι σωστό)
    useEffect(() => {
        if (!Number.isFinite(categoryId)) return;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [cats, apps] = await Promise.all([
                    CategoriesApi.list(),
                    AppointmentsApi.list(),
                ]);

                setCategories(cats);
                setAllAppointments(apps);
            } catch (e) {
                setError(e instanceof Error ? e.message : "Load failed");
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [categoryId]);

    //  2) categoryName
    const categoryName =
        categories.find((c) => c.id === categoryId)?.name ?? `Category #${id}`;

    //  3) Filter appointments
    const items = useMemo(() => {
        const qLower = q.trim().toLowerCase();

        return allAppointments
            .filter((a) => (a.category?.id ?? -1) === categoryId) // ✅ based on your JSON
            .filter((a) => (status === "ALL" ? true : a.status === status))
            .filter((a) => {
                if (!fromDate) return true;
                const d = a.dateTime.slice(0, 10); // YYYY-MM-DD
                return d >= fromDate;
            })
            .filter((a) => {
                if (!qLower) return true;
                const hay = `${a.title} ${a.firstName} ${a.lastName} ${a.tel}`.toLowerCase();
                return hay.includes(qLower);
            })
            .sort((a, b) => (a.dateTime > b.dateTime ? 1 : -1));
    }, [allAppointments, categoryId, q, status, fromDate]);

    function onEdit(appointmentId: number) {
        navigate(`/appointments/${appointmentId}/edit`);
    }

    async function onDelete(appointmentId: number) {
        if (!confirm(`Delete appointment #${appointmentId}?`)) return;

        setError(null);
        try {
            await AppointmentsApi.remove(appointmentId); // αν δεν έχεις remove ακόμα, πες μου
            const updated = await AppointmentsApi.list();
            setAllAppointments(updated);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Delete failed");
        }
    }

    //  Guard για invalid URL
    if (!Number.isFinite(categoryId)) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Invalid category</h2>
                <button
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:border-pink-200"
                    onClick={() => navigate("/")}
                >
                    Πίσω
                </button>
            </div>
        );
    }

    // Loading / Error screens
    if (loading) {
        return <p className="text-sm text-gray-500">Loading…</p>;
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <h2 className="text-2xl font-semibold text-gray-900">{categoryName}</h2>
                    <p className="mt-1 text-sm text-gray-500">Ραντεβού της κατηγορίας</p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:border-pink-200"
                        onClick={() => navigate("/")}
                    >
                        Πίσω
                    </button>

                    {isOwner && (
                        <button
                            type="button"
                            className="rounded-xl bg-pink-600 px-4 py-2 text-sm text-white hover:bg-pink-700"
                            onClick={() => navigate(`/appointments/new?categoryId=${categoryId}`)} // ✅ καλύτερο preselect
                        >
                            New Appointment
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <pre className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 whitespace-pre-wrap">
          {error}
        </pre>
            )}

            <AppointmentFilters
                q={q}
                onQ={setQ}
                status={status}
                onStatus={setStatus}
                fromDate={fromDate}
                onFromDate={setFromDate}
            />

            <AppointmentTable
                items={items}
                isOwner={isOwner}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </div>
    );
}
