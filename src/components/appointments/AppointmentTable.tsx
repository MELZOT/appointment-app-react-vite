import { formatDateTime } from "../../utils/datetime";
import type { Appointment } from "../../types/appointment";
import StatusBadge from "./StatusBadge";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
    items: Appointment[];
    isOwner: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
};

export default function AppointmentTable({ items, isOwner, onEdit, onDelete }: Props) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-50 text-gray-600">
                <tr>
                    <th className="px-4 py-3 text-left font-medium">Ημερομηνία</th>
                    <th className="px-4 py-3 text-left font-medium">Τίτλος</th>
                    <th className="px-4 py-3 text-left font-medium">Όνομα</th>
                    <th className="px-4 py-3 text-left font-medium">Τηλέφωνο</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    {isOwner && <th className="px-4 py-3 text-right font-medium">Actions</th>}
                </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                {items.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700">{formatDateTime(a.dateTime)}</td>
                        <td className="px-4 py-3 text-gray-900">{a.title}</td>
                        <td className="px-4 py-3 text-gray-700">
                            {a.firstName} {a.lastName}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{a.tel}</td>
                        <td className="px-4 py-3">
                            <StatusBadge status={a.status} />
                        </td>

                        {isOwner && (
                            <td className="px-4 py-3">
                                <div className="flex justify-end gap-2">
                                    <button
                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs hover:border-pink-200"
                                        onClick={() => onEdit(a.id)}
                                        type="button"
                                    >
                                        <Pencil className="h-4 w-4" /> Edit
                                    </button>
                                    <button
                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs hover:border-pink-200"
                                        onClick={() => onDelete(a.id)}
                                        type="button"
                                    >
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </button>
                                </div>
                            </td>
                        )}
                    </tr>
                ))}

                {items.length === 0 && (
                    <tr>
                        <td className="px-4 py-10 text-center text-gray-500" colSpan={isOwner ? 6 : 5}>
                            Δεν υπάρχουν ραντεβού με αυτά τα φίλτρα.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
