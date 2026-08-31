export type CollectibleCategory = 'trading-card' | 'vinyl' | 'sneaker' | 'art-print'

export type Item = {
  id: string
  title: string
  category: CollectibleCategory
  imageUrl: string
  price: number
  description: string
}
