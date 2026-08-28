import { useState } from "react";
import "./App.css";
import SearchBar from "./components/search/SearchBar";

function App() {
	const [query, setQuery] = useState("");

	return (
		<div className="app-shell">
			<SearchBar query={query} onChange={setQuery} />
		</div>
	);
}

export default App;
