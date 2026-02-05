export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELED";
export type Category = { id: number; name: string };

export type Appointment = {
    id: number;
    title: string;
    dateTime: string;
    description?: string;
    firstName: string;
    lastName: string;
    tel: string;
    status: AppointmentStatus;
    category?: Category | null; // ✅
};

