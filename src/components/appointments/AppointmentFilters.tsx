import type { AppointmentStatus } from "../../types/appointment";

type Props = {
    q: string;
    onQ: (v: string) => void;
    status: "ALL" | AppointmentStatus;
    onStatus: (v: "ALL" | AppointmentStatus) => void;
    fromDate: string;
    onFromDate: (v: string) => void;
};

export default function AppointmentFilters({
                                               q,
                                               onQ,
                                               status,
                                               onStatus,
                                               fromDate,
                                               onFromDate,
                                           }: Props) {
    return (
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-white p-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
                <label className="text-xs font-medium text-gray-600">Αναζήτηση</label>
                <input
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-pink-300"
                    placeholder="Όνομα, τίτλος, τηλέφωνο..."
                    value={q}
                    onChange={(e) => onQ(e.target.value)}
                />
            </div>

            <div className="sm:col-span-1">
                <label className="text-xs font-medium text-gray-600">Status</label>
                <select
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-pink-300"
                    value={status}
                    onChange={(e) => onStatus(e.target.value as any)}
                >
                    <option value="ALL">ALL</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELED">CANCELED</option>
                </select>
            </div>

            <div className="sm:col-span-1">
                <label className="text-xs font-medium text-gray-600">Από ημερομηνία</label>
                <input
                    type="date"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-pink-300"
                    value={fromDate}
                    onChange={(e) => onFromDate(e.target.value)}
                />
            </div>
        </div>
    );
}
