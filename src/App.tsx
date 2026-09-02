import { useEffect, useState, useRef } from "react";
import "./App.css";
import Header from "./components/layout/Header";
import { useItemSearch } from "./hooks/useItemSearch";
import { useWishlist } from "./context/WishlistContext";

function App() {
	const [query, setQuery] = useState<string>("");

	useEffect(() => {
		document.title = `${query && "Search: " + query + " - "}Collectibles Catalog Explorer`;
	}, [query]);

	const { items, loading, error } = useItemSearch(query);

	const resultsRef = useRef<HTMLUListElement>(null);

	useEffect(() => {
		resultsRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}, [items]);

	const { wishlist, addItem, removeItem } = useWishlist();

	return (
		<div className="app-shell">
			<Header query={query} onInputChange={setQuery} />

			{loading && <p>Loading...</p>}
			{error && <p>Error: {error}</p>}

			{!loading && !error && (
				<>
					<h3>Total Items: {items.length}</h3>
					<ul ref={resultsRef}>
						{items.length > 0 ? (
							items.map(({ id, title, price }) => {
								const isWishlisted = wishlist.includes(id);
								return (
									<li key={id}>
										<p>
											{title} <small>({price}$)</small>
											<button
												onClick={() =>
													isWishlisted
														? removeItem(id)
														: addItem(id)
												}
											>
												<span>
													{isWishlisted ? "remove" : "add"}
												</span>
											</button>
										</p>
									</li>
								);
							})
						) : (
							<li>No results</li>
						)}
					</ul>
				</>
			)}
		</div>
	);
}

export default App;
