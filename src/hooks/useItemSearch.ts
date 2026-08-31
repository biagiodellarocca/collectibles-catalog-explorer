import { useEffect, useState } from "react";
import { fetchItems } from "../api/items";
import type { Item } from "../types/item";

type UseItemSearchResult = {
	items: Item[];
	loading: boolean;
	error: string | null;
};

export function useItemSearch(query: string): UseItemSearchResult {
	const [items, setItems] = useState<Item[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		setLoading(true);
		setError(null);
		fetchItems(query)
			.then((result) => setItems(result))
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [query]);

	return { items, loading, error };
}
