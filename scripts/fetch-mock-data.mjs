// One-time data-generation script for db.json — NOT part of the app runtime.
// Pulls real card/art/album/photo data from four free, keyless public APIs and
// writes the result straight to db.json at the project root.
//
// Run with: node scripts/fetch-mock-data.mjs
// Requires a real internet connection (this doesn't hit anything auth-gated).

import { writeFile } from 'node:fs/promises'

const USER_AGENT = 'CollectiblesCatalogExplorer/1.0 (personal portfolio project; not for resale)'

function round2(n) {
  return Math.round(n * 100) / 100
}

// ---------- Trading cards: Scryfall ----------
async function fetchTradingCards(limit = 100) {
  const url = 'https://api.scryfall.com/cards/search?q=game%3Apaper+-is%3Adfc&order=edhrec&dir=asc'
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Scryfall search failed: ${res.status}`)
  const data = await res.json()

  return data.data
    .filter((c) => c.image_uris?.normal)
    .slice(0, limit)
    .map((c) => ({
      id: `tc-${c.id}`,
      title: c.name,
      category: 'trading-card',
      imageUrl: c.image_uris.normal,
      price: c.prices?.usd ? round2(parseFloat(c.prices.usd)) : round2(3 + Math.random() * 40),
      description: `${c.set_name} — ${c.type_line}`,
    }))
}

// ---------- Art prints: Art Institute of Chicago ----------
async function fetchArtPrints(limit = 100) {
  const url = 'https://api.artic.edu/api/v1/artworks?fields=id,title,artist_display,image_id,date_display,is_public_domain&limit=100&page=1'
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) throw new Error(`Art Institute of Chicago search failed: ${res.status}`)
  const data = await res.json()
  const iiifBase = data.config?.iiif_url ?? 'https://www.artic.edu/iiif/2'

  return data.data
    .filter((a) => a.is_public_domain && a.image_id)
    .slice(0, limit)
    .map((a) => ({
      id: `ap-${a.id}`,
      title: a.title,
      category: 'art-print',
      imageUrl: `${iiifBase}/${a.image_id}/full/600,/0/default.jpg`,
      price: round2(20 + Math.random() * 80),
      description: [a.artist_display, a.date_display].filter(Boolean).join(' — ') || 'Public domain artwork',
    }))
}

// ---------- Vinyl: iTunes Search API ----------
async function fetchVinyl(limit = 100) {
  const terms = ['rock', 'jazz', 'hip hop', 'pop', 'electronic', 'classical', 'soul', 'metal', 'indie', 'reggae']
  const seen = new Set()
  const results = []

  for (const term of terms) {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&entity=album&limit=15`
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
    if (!res.ok) continue
    const data = await res.json()
    for (const a of data.results ?? []) {
      if (!a.collectionId || seen.has(a.collectionId) || !a.artworkUrl100) continue
      seen.add(a.collectionId)
      results.push(a)
      if (results.length >= limit) break
    }
    if (results.length >= limit) break
  }

  return results.slice(0, limit).map((a) => ({
    id: `vy-${a.collectionId}`,
    title: a.collectionName,
    category: 'vinyl',
    imageUrl: a.artworkUrl100.replace('100x100', '600x600'),
    price: round2(15 + Math.random() * 40),
    description: `${a.artistName}${a.primaryGenreName ? ' — ' + a.primaryGenreName : ''}`,
  }))
}

// ---------- Sneakers: Wikimedia Commons (real photos, generic titles) ----------
async function fetchSneakers(limit = 100) {
  const searchUrl =
    'https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srsearch=sneaker%20shoe&srlimit=80&format=json&origin=*'
  const searchRes = await fetch(searchUrl, { headers: { 'User-Agent': USER_AGENT } })
  if (!searchRes.ok) throw new Error(`Wikimedia Commons search failed: ${searchRes.status}`)
  const searchData = await searchRes.json()
  const titles = (searchData.query?.search ?? []).map((r) => r.title).filter((t) => /\.(jpe?g|png)$/i.test(t))

  if (titles.length === 0) return []

  const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(
    titles.slice(0, 80).join('|'),
  )}&prop=imageinfo&iiprop=url&iiurlwidth=600&format=json&origin=*`
  const infoRes = await fetch(infoUrl, { headers: { 'User-Agent': USER_AGENT } })
  if (!infoRes.ok) throw new Error(`Wikimedia Commons imageinfo failed: ${infoRes.status}`)
  const infoData = await infoRes.json()
  const pages = Object.values(infoData.query?.pages ?? {})

  return pages
    .filter((p) => p.imageinfo?.[0]?.thumburl)
    .slice(0, limit)
    .map((p, i) => ({
      id: `sn-${String(i + 1).padStart(3, '0')}`,
      title: `Sneaker Style No. ${i + 1}`,
      category: 'sneaker',
      imageUrl: p.imageinfo[0].thumburl,
      price: round2(40 + Math.random() * 180),
      description: 'Real photograph, openly licensed via Wikimedia Commons.',
    }))
}

async function main() {
  console.log('Fetching trading cards from Scryfall...')
  const tradingCards = await fetchTradingCards(50)
  console.log(`  got ${tradingCards.length}`)

  console.log('Fetching art prints from the Art Institute of Chicago...')
  const artPrints = await fetchArtPrints(50)
  console.log(`  got ${artPrints.length}`)

  console.log('Fetching vinyl from the iTunes Search API...')
  const vinyl = await fetchVinyl(50)
  console.log(`  got ${vinyl.length}`)

  console.log('Fetching sneaker photos from Wikimedia Commons...')
  const sneakers = await fetchSneakers(50)
  console.log(`  got ${sneakers.length}`)

  const items = [...tradingCards, ...vinyl, ...sneakers, ...artPrints]
  await writeFile('db.json', JSON.stringify({ items }, null, 2) + '\n')

  console.log(`\nWrote ${items.length} items to db.json`)
  console.log('Restart `npm run mock` (Ctrl+C then re-run) to pick up the new data.')
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
