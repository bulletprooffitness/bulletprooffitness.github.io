import { useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { getPlatform, platforms } from '../data/platforms'
import { getProductsByPlatform } from '../data/products'
import { getPackagesByPlatform, resolvePackage } from '../data/packages'
import { RELATIONSHIP_TYPES } from '../data/relationshipTypes'
import { resolveVariantImages } from '../lib/pricing'
import { useCart } from '../lib/CartContext'
import ProductCard from '../components/ProductCard'

const SPEC_LABELS = [
  { key: 'postSize', label: 'Post Size' },
  { key: 'footprint', label: 'Footprint' },
  { key: 'weightCapacity', label: 'Weight Capacity' },
  { key: 'camOptions', label: 'Cam Options' },
]

// "Shop This System" card — one per core product. When the product has more
// than one variant (e.g. Isolator's 3X3 vs 2X2/2X3 post sizes), a selector
// switches the shown price, image, and specs live instead of requiring a
// visit to the product detail page just to compare sizes.
function CoreProductCard({ product }) {
  const [variantIndex, setVariantIndex] = useState(0)
  const variant = product.variants?.[variantIndex]
  const hasMultipleVariants = (product.variants?.length || 0) > 1
  const images = resolveVariantImages(product, variantIndex)
  const specs = variant?.specs

  return (
    <div className="group relative overflow-hidden bg-neutral-900">
      <Link to={`/product/${product.handle}`} className="block relative aspect-[4/3] overflow-hidden">
        <img
          src={images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-end justify-between gap-4">
            <h3 className="font-display text-4xl text-white leading-none">{product.title}</h3>
            <span className="text-2xl text-white font-light whitespace-nowrap tabular-nums">
              ${(variant?.price ?? product.price).toFixed(0)}
            </span>
          </div>
          <p className="text-white/55 text-sm mt-3 max-w-md leading-relaxed flex-shrink-1">
            {product.description}
          </p>
        </div>
      </Link>

      <div className="px-8 pb-8 pt-2 bg-neutral-900">
        {hasMultipleVariants && (
          <div className="flex flex-wrap gap-2 mb-5">
            {product.variants.map((v, i) => (
              <button
                key={v.title}
                onClick={(e) => {
                  e.preventDefault()
                  setVariantIndex(i)
                }}
                disabled={!v.available}
                className={`text-[11px] font-semibold uppercase tracking-[0.15em] rounded-full px-4 py-2 transition ${
                  i === variantIndex
                    ? 'bg-white text-black'
                    : 'text-white border border-white/20 hover:border-white/50'
                } ${!v.available ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                {v.title}
              </button>
            ))}
          </div>
        )}

        {specs && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
            {SPEC_LABELS.map(({ key, label }) =>
              specs[key] ? (
                <div key={key}>
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35 mb-1">
                    {label}
                  </dt>
                  <dd className="text-white text-sm tabular-nums">{specs[key]}</dd>
                </div>
              ) : null
            )}
          </dl>
        )}

        <Link
          to={`/product/${product.handle}`}
          className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-white border-b border-white/40 hover:border-white pb-0.5 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

// Packages whose base unit has multiple variants (e.g. Isolator's post
// sizes) get their own selector — the package's total price and savings
// recalculate from the selected variant's price via resolvePackage's
// variantIndex param, same live-pricing behavior as the product page.
function PackageCard({ pkg, onAdd, added }) {
  const [variantIndex, setVariantIndex] = useState(0)
  const resolved = resolvePackage(pkg, variantIndex)
  const hasMultipleVariants = (resolved.baseUnit?.variants?.length || 0) > 1

  return (
    <div className="rounded-2xl border border-white/10 bg-black p-8 flex flex-col">
      <div className="flex items-start justify-between gap-4 mb-3">
        <h3 className="font-display text-3xl text-white leading-none">{pkg.name}</h3>
        {resolved.savings > 0 && (
          <span className="flex-shrink-0 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap">
            Save ${resolved.savings.toFixed(0)}
          </span>
        )}
      </div>
      <p className="text-white/50 text-sm leading-relaxed flex-shrink-1 mb-6">{pkg.description}</p>

      {hasMultipleVariants && (
        <div className="mb-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35 block mb-2">
            {resolved.baseUnit.title} Size
          </span>
          <div className="flex flex-wrap gap-2">
            {resolved.baseUnit.variants.map((v, i) => (
              <button
                key={v.title}
                onClick={() => setVariantIndex(i)}
                disabled={!v.available}
                className={`text-[11px] font-semibold uppercase tracking-[0.15em] rounded-full px-4 py-2 transition ${
                  i === variantIndex
                    ? 'bg-white text-black'
                    : 'text-white border border-white/20 hover:border-white/50'
                } ${!v.available ? 'opacity-30 cursor-not-allowed' : ''}`}
              >
                {v.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <ul className="text-white/70 text-sm space-y-2 mb-6">
        {resolved.baseUnit && (
          <li className="flex items-center justify-between gap-4">
            <span className="flex-shrink-1">
              {resolved.baseUnit.title}
              {hasMultipleVariants ? ` — ${resolved.baseUnit.variants[variantIndex].title}` : ''}
            </span>
            <span className="tabular-nums text-white/40 whitespace-nowrap">
              ${resolved.baseUnitPrice.toFixed(0)}
            </span>
          </li>
        )}
        {resolved.accessories.map((a) => (
          <li key={a.handle} className="flex items-center justify-between gap-4">
            <span className="flex-shrink-1">{a.title}</span>
            <span className="tabular-nums text-white/40 whitespace-nowrap">${a.price.toFixed(0)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6 border-t border-white/10 flex items-end justify-between gap-4">
        <div>
          {resolved.savings > 0 && (
            <span className="block text-white/35 text-sm line-through tabular-nums">
              ${resolved.individualPrice.toFixed(0)}
            </span>
          )}
          <span className="text-3xl text-white font-light tabular-nums">${resolved.price.toFixed(0)}</span>
        </div>
        {resolved.baseUnit && (
          <button
            onClick={() => onAdd(resolved)}
            className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white bg-red-600 hover:bg-red-700 rounded-full px-6 py-3 transition whitespace-nowrap"
          >
            {added ? 'Added to Cart' : 'Add Package to Cart'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function Platform() {
  const { id } = useParams()
  const platform = getPlatform(id)
  const { addItem } = useCart()
  const [addedPackageId, setAddedPackageId] = useState(null)

  if (!platform) return <Navigate to="/shop" replace />

  const products = getProductsByPlatform(id, platform.subPlatformIds)
  const core = products.filter((p) => p.role === 'platform' || p.role === 'standalone')
  const accessories = products.filter((p) => p.role === 'attachment' || p.role === 'accessory')
  const packages = getPackagesByPlatform(id)

  function handleAddPackage(resolved) {
    addItem({
      kind: 'package',
      id: resolved.id,
      title: resolved.baseUnit?.variants?.length > 1
        ? `${resolved.name} — ${resolved.baseUnit.variants[resolved.variantIndex]?.title}`
        : resolved.name,
      price: resolved.price,
      image: resolved.baseUnit?.images?.[0],
      components: [
        ...(resolved.baseUnit ? [{ title: resolved.baseUnit.title }] : []),
        ...resolved.accessories.map((a) => ({ title: a.title })),
      ],
    })
    setAddedPackageId(resolved.id)
    setTimeout(() => setAddedPackageId((current) => (current === resolved.id ? null : current)), 2000)
  }

  const idsInScope = [id, ...(platform.subPlatformIds || [])]

  return (
    <div>
      <section className="relative h-[68vh] min-h-[460px] flex items-end overflow-hidden">
        <img
          src={platform.heroImage}
          alt={platform.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15" />
        <div className="relative max-w-7xl mx-auto px-6 pb-16 w-full">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/45">
            Platform
          </span>
          <h1 className="font-display text-7xl md:text-8xl text-white leading-[0.9] mt-2">
            {platform.name}
          </h1>
          <p className="text-white/65 mt-4 max-w-xl text-lg leading-relaxed flex-shrink-1">
            {platform.description}
          </p>
        </div>
      </section>

      {/* Core machines get hero treatment — these are the flagship purchase, not a grid item */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-display text-4xl text-white">Shop This System</h2>
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
            {core.length} configuration{core.length !== 1 ? 's' : ''}
          </span>
        </div>

        {core.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {core.map((p) => (
              <CoreProductCard key={p.handle} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-sm">No core products yet in the Phase 1 demo set.</p>
        )}
      </section>

      {/* Packages — bundled base unit + accessories at one price. Savings badge
          only renders when the bundle is actually cheaper than buying the
          components separately; a convenience-only bundle just omits it. */}
      {packages.length > 0 && (
        <section id="packages" className="bg-neutral-950 border-y border-white/10 py-24 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="font-display text-4xl text-white">Packages</h2>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                {packages.length} bundle{packages.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  onAdd={handleAddPackage}
                  added={addedPackageId === pkg.id}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Compatibility panel — visually distinct because this is the actual structural
          improvement over the current site: explicit cross-platform compatibility instead
          of a flat, ambiguous product list. */}
      {accessories.length > 0 && (
        <section id="accessories" className="bg-neutral-950 border-y border-white/10 py-24 scroll-mt-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="font-display text-4xl text-white">Compatible Accessories</h2>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                {accessories.length} compatible with {platform.name}
              </span>
            </div>
            <p className="text-white/40 text-sm mb-12 max-w-xl leading-relaxed flex-shrink-1">
              Every accessory below is confirmed compatible with {platform.name}. Items that also
              work with other platforms (via adapter, where noted) are flagged — so you always
              know exactly what fits before you buy.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {accessories.map((p) => {
                const relationships = p.relationships || []
                const thisFits = relationships.find(
                  (r) => r.type === 'fits' && idsInScope.includes(r.platformId)
                )
                const thisPaired = relationships.find(
                  (r) => r.type === 'paired-with' && idsInScope.includes(r.platformId)
                )
                const otherFitsNames = relationships
                  .filter((r) => r.type === 'fits' && !idsInScope.includes(r.platformId))
                  .map((r) => platforms.find((pl) => pl.id === r.platformId)?.name)
                  .filter(Boolean)

                return (
                  <div key={p.handle} className="relative">
                    {otherFitsNames.length > 0 && (
                      <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1">
                        {RELATIONSHIP_TYPES.fits.badgeLabel} {otherFitsNames.join(', ')}
                      </span>
                    )}
                    <ProductCard product={p} />
                    {!thisFits && thisPaired && (
                      <p className="text-white/35 text-xs mt-2 leading-relaxed flex-shrink-1">
                        {thisPaired.note || RELATIONSHIP_TYPES['paired-with'].description}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

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
