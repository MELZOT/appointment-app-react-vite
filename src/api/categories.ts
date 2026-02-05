import { api } from "./client";
import type { Category } from "../types/category";

export const CategoriesApi = {
    list(): Promise<Category[]> {
        return api("/api/categories");
    },
    create(data: { name: string; description?: string | null }): Promise<Category> {
        return api("/api/categories", { method: "POST", body: JSON.stringify(data) });
    },
    update(id: number, data: { name: string; description?: string | null }): Promise<Category> {
        return api(`/api/categories/${id}`, { method: "PUT", body: JSON.stringify(data) });
    },
    remove(id: number): Promise<void> {
        return api(`/api/categories/${id}`, { method: "DELETE" });
    },
};
