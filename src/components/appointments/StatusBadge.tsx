import type { AppointmentStatus } from "../../types/appointment";

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
    const base = "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border";
    if (status === "SCHEDULED")
        return <span className={`${base} border-pink-200 bg-pink-50 text-pink-700`}>SCHEDULED</span>;
    if (status === "COMPLETED")
        return <span className={`${base} border-emerald-200 bg-emerald-50 text-emerald-700`}>COMPLETED</span>;
    return <span className={`${base} border-gray-200 bg-gray-50 text-gray-700`}>CANCELED</span>;
}
