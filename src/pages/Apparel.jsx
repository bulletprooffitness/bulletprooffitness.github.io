import { useState } from 'react'
import { getApparel } from '../data/products'
import ProductCard from '../components/ProductCard'

const categories = [
  { id: 'all', label: 'All' },
  { id: 'tees', label: 'Tees' },
  { id: 'hoodies', label: 'Hoodies' },
  { id: 'hats', label: 'Hats' },
]

export default function Apparel() {
  const [category, setCategory] = useState('all')
  const all = getApparel()
  const filtered = category === 'all' ? all : all.filter((p) => p.apparelCategory === category)

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-display text-5xl text-white mb-2">Apparel</h1>
      <p className="text-white/50 mb-10">Gym gear, off the platform.</p>

      <div className="flex gap-3 mb-10">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded border transition ${
              category === c.id
                ? 'bg-white text-black border-white'
                : 'border-white/20 text-white/60 hover:border-white/50 hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.handle} product={p} />
        ))}
      </div>
    </div>
  )
}
