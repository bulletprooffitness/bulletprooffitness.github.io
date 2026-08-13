import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.handle}`}
      className="group block"
    >
      <div className="aspect-square bg-neutral-900 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-[1.04] transition duration-500 ease-out"
        />
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <span className="text-sm text-white/85 leading-snug flex-shrink-1">{product.title}</span>
        <span className="text-sm text-white/45 tabular-nums">${product.price.toFixed(2)}</span>
      </div>
    </Link>
  )
}
