import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "../components/CategoryCard";
import { CategoriesApi } from "../api/categories";
import type { Category } from "../types/category";
import { useAuth } from "../auth/AuthContext";
import toast from "react-hot-toast";

export default function CategoriesPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const isOwner = !!user?.isOwner;

    const [items, setItems] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const [newName, setNewName] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        CategoriesApi.list()
            .then(setItems)
            .catch(() => toast.error("Αποτυχία φόρτωσης κατηγοριών"))
            .finally(() => setLoading(false));
    }, []);

    async function createCategory() {
        if (!newName.trim()) return;

        setCreating(true);
        try {
            const created = await CategoriesApi.create({
                name: newName.trim(),
                description: newDescription.trim() || null,
            });

            setItems((prev) => [...prev, created]);
            setNewName("");
            setNewDescription("");
            toast.success("Η κατηγορία δημιουργήθηκε");
        } catch {
            toast.error("Αποτυχία δημιουργίας κατηγορίας");
        } finally {
            setCreating(false);
        }
    }

    async function updateCategory(id: number, payload: { name: string; description?: string | null }) {
        try {
            const updated = await CategoriesApi.update(id, payload);
            setItems((prev) => prev.map((c) => (c.id === id ? updated : c)));
            toast.success("Η κατηγορία ενημερώθηκε");
        } catch {
            toast.error("Αποτυχία ενημέρωσης κατηγορίας");
        }
    }

    async function deleteCategory(id: number) {
        try {
            await CategoriesApi.remove(id);
            setItems((prev) => prev.filter((c) => c.id !== id));
            toast.success("Η κατηγορία διαγράφηκε");
        } catch {
            toast.error("Η κατηγορία δεν μπορεί να διαγραφεί γιατί έχει ραντεβού");
        }
    }



    if (loading) return <p className="text-sm text-gray-500">Loading…</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Κατηγορίες</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                    <CategoryCard
                        key={c.id}
                        name={c.name}
                        description={c.description ?? ""}
                        isOwner={isOwner}
                        onClick={() => navigate(`/categories/${c.id}`)}
                        onEdit={async (data) => updateCategory(c.id, data)}
                        onDelete={() => deleteCategory(c.id)}
                    />
                ))}

                {isOwner && (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-4">
                        <input
                            type="text"
                            placeholder="Νέα κατηγορία…"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
                        />

                        <textarea
                            placeholder="Περιγραφή (προαιρετικό)…"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            className="mt-2 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
                            rows={3}
                        />

                        <button
                            type="button"
                            disabled={creating}
                            onClick={createCategory}
                            className="mt-3 w-full rounded-xl bg-pink-600 px-4 py-2 text-sm text-white hover:bg-pink-700 disabled:opacity-50"
                        >
                            {creating ? "Creating…" : "Add category"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
