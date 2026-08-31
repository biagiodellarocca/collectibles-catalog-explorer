import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/layout/Header";
import { useItemSearch } from "./hooks/useItemSearch";

function App() {
	const [query, setQuery] = useState<string>("");

	useEffect(() => {
		document.title = `${query && "Search: " + query + " - "}Collectibles Catalog Explorer`;
	}, [query]);

	const { items, loading, error } = useItemSearch(query);

	return (
		<div className="app-shell">
			<Header query={query} onInputChange={setQuery} />

			{loading && <p>Loading...</p>}
			{error && <p>Error: {error}</p>}

			{!loading && !error && (
				<>
				<h3>Total Items: {items.length}</h3>
				<ul>
					{items.length > 0 ? (
						items.map(({ id, title, price }) => (
							<li key={id}>
								<p>
									{title} <small>({price}$)</small>
								</p>
							</li>
						))
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
