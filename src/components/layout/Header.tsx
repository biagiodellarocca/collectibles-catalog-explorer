import SearchBar from "../search/SearchBar"

type HeaderProps = {
   query: string
   onInputChange: (query: string) => void
}

function Header({query, onInputChange}: HeaderProps) {
  return (
    <header>
      <h1>Collectibles Catalog Explorer</h1>
      <SearchBar query={query} onInputChange={onInputChange} />
    </header>
  )
}

export default Header