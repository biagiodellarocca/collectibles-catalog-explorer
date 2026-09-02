import { useEffect, useRef } from "react";

type SearchBarProps = {
	query: string;
	onInputChange: (query: string) => void;
};

function SearchBar({ query, onInputChange }: SearchBarProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus()
	}, [])

	return (
		<div>
			<input
				ref={inputRef}
				type="search"
				aria-label="Search in the catalog"
				value={query}
				onChange={(e) => onInputChange(e.currentTarget.value)}
			/>
		</div>
	);
}
export default SearchBar;
