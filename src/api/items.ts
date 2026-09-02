import { apiFetch } from "./client";
import type { Item } from "../types/item";

export function fetchItems(query: string): Promise<Item[]> {
	const search = query ? `?q=${encodeURIComponent(query)}` : "";
	return apiFetch<Item[]>(`/items${search}`);
}
