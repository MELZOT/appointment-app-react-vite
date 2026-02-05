import { api } from "./client";
import type { Appointment } from "../types/appointment";

export type AppointmentUpdateRequest = {
    title: string;
    dateTime: string;
    description?: string;
    firstName: string;
    lastName: string;
    tel: string;
    status: "SCHEDULED" | "COMPLETED" | "CANCELED";
    categoryId: number;
};

export const AppointmentsApi = {
    list(): Promise<Appointment[]> {
        return api("/api/appointments");
    },

    getById(id: number): Promise<Appointment> {
        return api(`/api/appointments/${id}`);
    },

    create(body: any): Promise<Appointment> {
        return api("/api/appointments", {
            method: "POST",
            body: JSON.stringify(body),
        });
    },

    update(id: number, body: AppointmentUpdateRequest): Promise<Appointment> {
        return api(`/api/appointments/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
        });
    },

    remove(id: number): Promise<void> {
        return api(`/api/appointments/${id}`, { method: "DELETE" });
    },
};
