import { useState } from 'react'
import { getProducts } from '../data/products'
import { platforms, getNavPlatforms } from '../data/platforms'
import ProductCard from '../components/ProductCard'

export default function Shop() {
  const [platformFilter, setPlatformFilter] = useState('all')
  const products = getProducts()

  const filtered =
    platformFilter === 'all'
      ? products
      : products.filter((p) => {
          const platform = platforms.find((pl) => pl.id === platformFilter)
          const ids = [platformFilter, ...(platform?.subPlatformIds || [])]
          return p.relationships?.some((r) => ids.includes(r.platformId))
        })

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-display text-5xl text-white mb-2">Shop All</h1>
      <p className="text-white/50 mb-10">{products.length} products across every platform.</p>

      <div className="flex flex-wrap gap-3 mb-10">
        <button
          onClick={() => setPlatformFilter('all')}
          className={`text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded border transition ${
            platformFilter === 'all'
              ? 'bg-white text-black border-white'
              : 'border-white/20 text-white/60 hover:border-white/50 hover:text-white'
          }`}
        >
          All
        </button>
        {getNavPlatforms().map((p) => (
          <button
            key={p.id}
            onClick={() => setPlatformFilter(p.id)}
            className={`text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded border transition ${
              platformFilter === p.id
                ? 'bg-white text-black border-white'
                : 'border-white/20 text-white/60 hover:border-white/50 hover:text-white'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>
      ) : (
        <p className="text-white/40 text-sm">No products match this filter.</p>
      )}
    </div>
  )
}
