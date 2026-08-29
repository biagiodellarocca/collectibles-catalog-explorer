type SearchBarProps = {
	query: string;
	onInputChange: (query: string) => void;
};

function SearchBar({ query, onInputChange }: SearchBarProps) {
	return (
		<div>
			<input
				type="search"
				aria-label="Search in the catalog"
				value={query}
				onChange={(e) => onInputChange(e.currentTarget.value)}
			/>
		</div>
	);
}
export default SearchBar;
