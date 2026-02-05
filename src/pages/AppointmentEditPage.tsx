import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppointmentsApi } from "../api/appointments";
import { CategoriesApi } from "../api/categories";
import type { AppointmentStatus } from "../types/appointment";
import type { Category } from "../types/category";

function toDatetimeLocal(iso: string) {
    return iso ? iso.slice(0, 16) : "";
}

function toIso(dtLocal: string) {
    return dtLocal.length === 16 ? dtLocal + ":00" : dtLocal;
}

type FormState = {
    title: string;
    dateTime: string;
    description: string;
    firstName: string;
    lastName: string;
    tel: string;
    status: AppointmentStatus;
    categoryId: string;
};

export default function AppointmentEditPage() {
    const { id } = useParams();
    const appointmentId = Number(id);
    const navigate = useNavigate();

    const [cats, setCats] = useState<Category[]>([]);
    const [form, setForm] = useState<FormState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!Number.isFinite(appointmentId)) return;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [appointment, categories] = await Promise.all([
                    AppointmentsApi.getById(appointmentId),
                    CategoriesApi.list(),
                ]);

                setCats(categories);

                setForm({
                    title: appointment.title,
                    dateTime: toDatetimeLocal(appointment.dateTime),
                    description: appointment.description ?? "",
                    firstName: appointment.firstName,
                    lastName: appointment.lastName,
                    tel: appointment.tel,
                    status: appointment.status,
                    categoryId: String(appointment.category?.id ?? ""),
                });
            } catch (e) {
                setError(e instanceof Error ? e.message : "Load failed");
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [appointmentId]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!form) return;

        if (!form.title.trim()) return setError("Title is required");

        try {
            setSubmitting(true);

            await AppointmentsApi.update(appointmentId, {
                title: form.title.trim(),
                dateTime: toIso(form.dateTime),
                description: form.description.trim() || undefined,
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                tel: form.tel.trim(),
                status: form.status,
                categoryId: Number(form.categoryId),
            });

            navigate(`/categories/${form.categoryId}`);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Save failed");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <p className="text-sm text-gray-500">Loading…</p>;
    if (!form) return <p>Not found</p>;

    return (
        <div className="space-y-5 max-w-xl">
            <h2 className="text-2xl font-semibold text-gray-900">
                Edit Appointment #{appointmentId}
            </h2>

            {error && (
                <pre className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {error}
        </pre>
            )}

            <form onSubmit={onSubmit} className="grid gap-3">
                <label className="text-sm text-gray-600">
                    Category
                    <select
                        className="mt-1 w-full rounded-xl border px-3 py-2"
                        value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    >
                        {cats.map((c) => (
                            <option key={c.id} value={String(c.id)}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="text-sm text-gray-600">
                    Title
                    <input
                        className="mt-1 w-full rounded-xl border px-3 py-2"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                </label>

                <label className="text-sm text-gray-600">
                    Date & time
                    <input
                        type="datetime-local"
                        className="mt-1 w-full rounded-xl border px-3 py-2"
                        value={form.dateTime}
                        onChange={(e) => setForm({ ...form, dateTime: e.target.value })}
                    />
                </label>

                <label className="text-sm text-gray-600">
                    Status
                    <select
                        className="mt-1 w-full rounded-xl border px-3 py-2"
                        value={form.status}
                        onChange={(e) =>
                            setForm({ ...form, status: e.target.value as AppointmentStatus })
                        }
                    >
                        <option value="SCHEDULED">SCHEDULED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELED">CANCELED</option>
                    </select>
                </label>

                <label className="text-sm text-gray-600">
                    Description
                    <textarea
                        rows={4}
                        className="mt-1 w-full rounded-xl border px-3 py-2"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                </label>

                <div className="flex gap-2 pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-xl bg-pink-600 px-4 py-2 text-sm text-white"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="rounded-xl border px-4 py-2 text-sm"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
