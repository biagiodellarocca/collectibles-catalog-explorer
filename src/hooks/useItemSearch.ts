import { useEffect, useState } from "react";
import { fetchItems } from "../api/items";
import type { Item } from "../types/item";
import { useDebounce } from "./useDebounce";

type UseItemSearchResult = {
	items: Item[];
	loading: boolean;
	error: string | null;
};

export function useItemSearch(query: string): UseItemSearchResult {
	const [items, setItems] = useState<Item[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const debouncedQuery = useDebounce(query, 300);

	useEffect(() => {
		setError(null);
		setLoading(true);

		async function loadItems() {
			try {
				const data = await fetchItems(query);
				setItems(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
			} finally {
				setLoading(false);
			}
		}

		loadItems();
	}, [debouncedQuery]);

	return { items, loading, error };
}
