import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/layout/Header";

function App() {
	const [query, setQuery] = useState<string>("");

	useEffect(() => {
		document.title = `${query && "Search: " + query + " - "}Collectibles Catalog Explorer`;
	}, [query]);

	return (
		<div className="app-shell">
			<Header query={query} onInputChange={setQuery} />
		</div>
	);
}

export default App;
