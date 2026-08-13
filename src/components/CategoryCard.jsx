import { Link } from 'react-router-dom'

// Compact companion to PlatformCard — categories are accessory groupings,
// not full systems, so they skip the Base Unit / Accessories / Packages
// action row and just link straight into the category page.
export default function CategoryCard({ category }) {
  return (
    <div className="group rounded-3xl bg-white border border-black/10 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/10">
      <Link to={`/category/${category.id}`} className="block relative aspect-square overflow-hidden">
        <div className="absolute inset-3 rounded-2xl bg-neutral-100 ring-1 ring-inset ring-black/[0.06] shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]" />
        <img
          src={category.homeImage}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </Link>
      <div className="px-6 py-5">
        <h3 className="font-display text-2xl text-black leading-[0.95] mb-2">{category.name}</h3>
        <p className="text-black/55 text-sm leading-relaxed flex-shrink-1 mb-5 min-h-[2.75rem]">{category.tagline}</p>

        <div className="flex flex-wrap gap-2">
          <Link
            to={`/category/${category.id}`}
            className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white bg-black hover:bg-black/80 rounded-full px-4 py-2 transition"
          >
            Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
