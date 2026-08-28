type SearchBarProps = {
	query: string;
	onChange: (value: string) => void;
};

function SearchBar({ query, onChange }: SearchBarProps) {
	return (
		<>
			<input
				type="search"
				value={query}
				aria-label="Seach in the catalog"
				onChange={(e) => onChange(e.currentTarget.value)}
			/>
		</>
	);
}

export default SearchBar;
