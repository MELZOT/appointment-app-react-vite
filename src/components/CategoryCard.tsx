import { useEffect, useState } from "react";

type EditPayload = {
    name: string;
    description?: string | null;
};

type Props = {
    name: string;
    description?: string;
    onClick: () => void;
    onEdit?: (data: EditPayload) => Promise<void>;
    onDelete?: () => Promise<void>;
    isOwner?: boolean;
};

export default function CategoryCard({
                                         name,
                                         description,
                                         onClick,
                                         onEdit,
                                         onDelete,
                                         isOwner = false,
                                     }: Props) {
    const [editing, setEditing] = useState(false);

    const [nameValue, setNameValue] = useState(name);
    const [descValue, setDescValue] = useState(description ?? "");

    const [saving, setSaving] = useState(false);

    useEffect(() => setNameValue(name), [name]);
    useEffect(() => setDescValue(description ?? ""), [description]);

    async function save() {
        if (!onEdit) return;
        if (!nameValue.trim()) return;

        setSaving(true);
        try {
            await onEdit({
                name: nameValue.trim(),
                description: descValue.trim() ? descValue.trim() : null,
            });
            setEditing(false);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div
            className="rounded-2xl border bg-white p-4 hover:border-pink-200"
            onClick={() => {
                if (!editing) onClick();
            }}
            role="button"
            tabIndex={0}
        >
            {!editing ? (
                <>
                    <h3 className="text-lg font-medium text-gray-900">{name}</h3>
                    {description?.trim() ? (
                        <p className="mt-1 text-sm text-gray-500">{description}</p>
                    ) : (
                        <p className="mt-1 text-sm text-gray-300">Χωρίς περιγραφή</p>
                    )}
                </>
            ) : (
                <div onClick={(e) => e.stopPropagation()}>
                    <input
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
                        placeholder="Όνομα κατηγορίας"
                    />

                    <textarea
                        value={descValue}
                        onChange={(e) => setDescValue(e.target.value)}
                        className="mt-2 w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-pink-400 focus:outline-none"
                        rows={3}
                        placeholder="Περιγραφή"
                    />
                </div>
            )}

            {isOwner && (
                <div className="mt-3 flex gap-2 text-xs">
                    {!editing ? (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditing(true);
                                }}
                                className="rounded-lg border border-gray-200 px-2 py-1 hover:border-pink-200"
                            >
                                ✏️ Edit
                            </button>

                            <button
                                type="button"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!onDelete) return;
                                    await onDelete();
                                }}
                                className="rounded-lg border border-red-200 px-2 py-1 text-red-700 hover:bg-red-50"
                            >
                                🗑 Delete
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                disabled={saving}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    void save();
                                }}
                                className="rounded-lg bg-pink-600 px-2 py-1 text-white hover:bg-pink-700 disabled:opacity-50"
                            >
                                {saving ? "Saving…" : "Save"}
                            </button>

                            <button
                                type="button"
                                disabled={saving}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditing(false);
                                    setNameValue(name);
                                    setDescValue(description ?? "");
                                }}
                                className="rounded-lg border border-gray-200 px-2 py-1 hover:border-pink-200 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
