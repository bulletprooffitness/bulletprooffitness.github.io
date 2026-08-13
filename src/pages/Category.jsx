import { useParams, Navigate, Link } from 'react-router-dom'
import { getCategory } from '../data/categories'
import { getProductsByCategory } from '../data/products'
import { platforms } from '../data/platforms'
import { RELATIONSHIP_TYPES } from '../data/relationshipTypes'
import ProductCard from '../components/ProductCard'

export default function Category() {
  const { id } = useParams()
  const category = getCategory(id)

  if (!category) return <Navigate to="/shop" replace />

  const products = getProductsByCategory(id)

  return (
    <div>
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40">
          Category
        </span>
        <h1 className="font-display text-6xl md:text-7xl text-white leading-none mt-2">
          {category.name}
        </h1>
        <p className="text-white/55 mt-4 max-w-xl text-lg leading-relaxed flex-shrink-1">
          {category.tagline}
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="font-display text-3xl text-white">Works With</h2>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
            {products.length} product{products.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="text-white/40 text-sm mb-12 max-w-xl leading-relaxed flex-shrink-1">
          Every {category.name.toLowerCase()} listing below shows exactly which platform it's
          built for, plus any others it fits via adapter — so compatibility is never a guess.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          {products.map((p) => {
            const relationships = p.relationships || []
            const fitsRelationships = relationships.filter((r) => r.type === 'fits')
            const pairedRelationships = relationships.filter((r) => r.type === 'paired-with')
            const fitsNames = fitsRelationships
              .map((r) => platforms.find((pl) => pl.id === r.platformId)?.name)
              .filter(Boolean)

            return (
              <div key={p.handle} className="relative">
                {fitsNames.length > 0 && (
                  <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                    {RELATIONSHIP_TYPES.fits.badgeLabel} {fitsNames.join(', ')}
                  </span>
                )}
                <ProductCard product={p} />
                {relationships.length === 0 ? (
                  <p className="text-white/30 text-xs mt-2 italic leading-relaxed flex-shrink-1">
                    Compatibility not yet confirmed.
                  </p>
                ) : (
                  <>
                    {fitsRelationships.length === 0 && pairedRelationships.length > 0 && (
                      <p className="text-white/35 text-xs mt-2 leading-relaxed flex-shrink-1">
                        Doesn't attach directly to any platform — see pairing note below.
                      </p>
                    )}
                    {pairedRelationships.map((r) => (
                      <p key={r.platformId} className="text-white/35 text-xs mt-2 leading-relaxed flex-shrink-1">
                        {r.note || `Commonly paired with ${platforms.find((pl) => pl.id === r.platformId)?.name}.`}
                      </p>
                    ))}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <Link
          to="/shop"
          className="text-[11px] font-semibold text-white/50 hover:text-white uppercase tracking-[0.2em] transition"
        >
          ← Browse all products
        </Link>
      </section>
    </div>
  )
}
