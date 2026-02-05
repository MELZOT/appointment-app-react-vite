import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { Category } from "../types/category";
import { CategoriesApi } from "../api/categories";
import { AppointmentsApi } from "../api/appointments";

function toIso(dtLocal: string) {
    // "YYYY-MM-DDTHH:mm" -> "YYYY-MM-DDTHH:mm:00"
    if (!dtLocal) return "";
    return dtLocal.length === 16 ? dtLocal + ":00" : dtLocal;
}

type FormState = {
    title: string;
    dateTime: string;
    description: string;
    firstName: string;
    lastName: string;
    tel: string;
    categoryId: string;
};

export default function AppointmentNewPage() {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const preselectedCategoryId = params.get("categoryId"); // π.χ. "3"

    const [cats, setCats] = useState<Category[]>([]);
    const [loadingCats, setLoadingCats] = useState(true);

    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState<FormState>({
        title: "",
        dateTime: "",
        description: "",
        firstName: "",
        lastName: "",
        tel: "",
        categoryId: preselectedCategoryId ?? "",
    });


    useEffect(() => {
        const load = async () => {
            setLoadingCats(true);
            try {
                const data = await CategoriesApi.list();
                setCats(data);


                setForm((prev) => {
                    if (prev.categoryId) return prev;
                    return { ...prev, categoryId: data[0]?.id ? String(data[0].id) : "" };
                });
            } catch (e) {
                setError(e instanceof Error ? e.message : "Failed to load categories");
            } finally {
                setLoadingCats(false);
            }
        };

        void load();
    }, []);

    const categoryName = useMemo(() => {
        const idNum = Number(form.categoryId);
        return cats.find((c) => c.id === idNum)?.name ?? "";
    }, [cats, form.categoryId]);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        // basic validation
        if (!form.title.trim()) return setError("Title is required");
        if (!form.dateTime.trim()) return setError("DateTime is required");
        if (!form.firstName.trim()) return setError("First name is required");
        if (!form.lastName.trim()) return setError("Last name is required");
        if (!form.tel.trim()) return setError("Tel is required");
        if (!form.categoryId) return setError("Category is required");

        try {
            setSubmitting(true);

            await AppointmentsApi.create({
                title: form.title.trim(),
                dateTime: toIso(form.dateTime),
                description: form.description.trim() ? form.description.trim() : undefined,
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                tel: form.tel.trim(),
                categoryId: Number(form.categoryId),
            });

            navigate(`/categories/${form.categoryId}`);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Create failed");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-5">
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-xs text-gray-500">New appointment</p>
                    <h2 className="text-2xl font-semibold text-gray-900">
                        {categoryName ? `Category: ${categoryName}` : "Select category"}
                    </h2>
                </div>

                <button
                    type="button"
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:border-pink-200"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
            </div>

            {error && (
                <pre className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 whitespace-pre-wrap">
          {error}
        </pre>
            )}

            <form onSubmit={onSubmit} className="grid gap-3 max-w-xl">
                <label className="text-sm text-gray-600">
                    Category
                    <select
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2"
                        value={form.categoryId}
                        disabled={loadingCats}
                        onChange={(e) => setForm((p) => ({ ...p, categoryId: e.target.value }))}
                    >
                        <option value="">-- Select --</option>
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
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2"
                        value={form.title}
                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    />
                </label>

                <label className="text-sm text-gray-600">
                    Date & time
                    <input
                        type="datetime-local"
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2"
                        value={form.dateTime}
                        onChange={(e) => setForm((p) => ({ ...p, dateTime: e.target.value }))}
                    />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-sm text-gray-600">
                        First name
                        <input
                            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2"
                            value={form.firstName}
                            onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                        />
                    </label>

                    <label className="text-sm text-gray-600">
                        Last name
                        <input
                            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2"
                            value={form.lastName}
                            onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                        />
                    </label>
                </div>

                <label className="text-sm text-gray-600">
                    Tel
                    <input
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2"
                        value={form.tel}
                        onChange={(e) => setForm((p) => ({ ...p, tel: e.target.value }))}
                    />
                </label>

                <label className="text-sm text-gray-600">
                    Description
                    <textarea
                        rows={4}
                        className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2"
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    />
                </label>

                <div className="flex gap-2 pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-xl bg-pink-600 px-4 py-2 text-sm text-white hover:bg-pink-700 disabled:opacity-60"
                    >
                        {submitting ? "Saving..." : "Create"}
                    </button>

                    <button
                        type="button"
                        disabled={submitting}
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:border-pink-200"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>
                </div>

                <p className="text-xs text-gray-400">
                    Status στο create μπαίνει αυτόματα από backend: <b>SCHEDULED</b>
                </p>
            </form>
        </div>
    );
}
