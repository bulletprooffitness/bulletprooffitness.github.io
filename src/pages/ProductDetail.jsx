import { useEffect, useState } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { getProduct, getProductsByPlatform } from '../data/products'
import { getPlatform } from '../data/platforms'
import { resolveVariantImages } from '../lib/pricing'
import { useCart } from '../lib/CartContext'
import ProductCard from '../components/ProductCard'

const SPEC_LABELS = [
  { key: 'postSize', label: 'Post Size' },
  { key: 'footprint', label: 'Footprint' },
  { key: 'weightCapacity', label: 'Weight Capacity' },
  { key: 'camOptions', label: 'Cam Options' },
]

export default function ProductDetail() {
  const { handle } = useParams()
  const product = getProduct(handle)
  const { addItem } = useCart()
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setAdded(false)
    setActiveImage(0)
  }, [handle, selectedVariant])

  if (!product) return <Navigate to="/shop" replace />

  const isApparel = product.role === 'apparel'
  const primaryRelationship = product.relationships?.[0]
  const platform = primaryRelationship ? getPlatform(primaryRelationship.platformId) : null
  const related = platform
    ? getProductsByPlatform(platform.id).filter((p) => p.handle !== product.handle).slice(0, 4)
    : []
  const images = resolveVariantImages(product, selectedVariant)
  const specs = product.variants[selectedVariant]?.specs

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-neutral-900 rounded overflow-hidden">
            <img
              src={images[activeImage]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-3">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded overflow-hidden border ${
                    activeImage === i ? 'border-white' : 'border-white/10'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {platform && (
            <Link
              to={`/platform/${platform.id}`}
              className="text-xs font-semibold uppercase tracking-widest text-white/40 hover:text-white/70"
            >
              {platform.name}
            </Link>
          )}
          <h1 className="font-display text-4xl text-white mt-2">{product.title}</h1>
          <p className="text-2xl text-white/90 mt-3">
            ${product.variants[selectedVariant].price.toFixed(2)}
          </p>
          <p className="text-white/60 leading-relaxed mt-6 flex-shrink-1">{product.description}</p>

          {product.relationships?.length === 0 && (
            <p className="text-white/30 text-sm mt-4 italic flex-shrink-1">
              Compatibility not yet confirmed.
            </p>
          )}
          {product.relationships
            ?.filter((r) => r.type === 'paired-with')
            .map((r) => (
              <p
                key={r.platformId}
                className="text-white/40 text-sm mt-4 border-l-2 border-white/20 pl-3 flex-shrink-1"
              >
                {r.note}
              </p>
            ))}

          {product.variants.length > 1 && (
            <div className="mt-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/50">
                {isApparel ? 'Size' : 'Option'}
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {product.variants.map((v, i) => (
                  <button
                    key={v.title}
                    onClick={() => setSelectedVariant(i)}
                    disabled={!v.available}
                    className={`px-4 py-2 text-sm rounded border transition ${
                      selectedVariant === i
                        ? 'bg-white text-black border-white'
                        : 'border-white/20 text-white/70 hover:border-white/50'
                    } ${!v.available ? 'opacity-30 cursor-not-allowed' : ''}`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>
          )}

          {specs && (
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 mt-8 pt-8 border-t border-white/10">
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

          <button
            onClick={() => {
              addItem({
                kind: 'product',
                handle: product.handle,
                title:
                  product.variants.length > 1
                    ? `${product.title} — ${product.variants[selectedVariant].title}`
                    : product.title,
                price: product.variants[selectedVariant].price,
                image: images[0],
              })
              setAdded(true)
            }}
            className="mt-10 w-full md:w-auto bg-red-600 hover:bg-red-700 text-white text-sm font-semibold uppercase tracking-widest px-8 py-4 rounded transition"
          >
            {added ? 'Added to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24 pt-16 border-t border-white/10">
          <h2 className="font-display text-2xl text-white mb-6">You May Also Need</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
