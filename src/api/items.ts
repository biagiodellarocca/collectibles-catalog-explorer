import { apiFetch } from './client'
import type { Item } from '../types/item'

// json-server's built-in full-text search: GET /items?q=<term>
// An empty query returns the full catalog.
export function fetchItems(query: string): Promise<Item[]> {
  const search = query ? `?q=${encodeURIComponent(query)}` : ''
  return apiFetch<Item[]>(`/items${search}`)
}
