import { Link } from 'react-router-dom'
import { getPlatformLinks } from '../data/products'
import { getPackagesByPlatform } from '../data/packages'

// Static, hover-driven card — replaces the old scroll-carousel PlatformRow.
// Motion budget is spent entirely on hover (lift + shadow bloom), matching
// the restrained, spotlight feel of the hero rather than continuous
// scroll-linked transforms.
export default function PlatformCard({ platform }) {
  const { baseUnits, accessories } = getPlatformLinks(platform)
  const packages = getPackagesByPlatform(platform.id)
  const baseUnitTarget = baseUnits.length === 1 ? `/product/${baseUnits[0].handle}` : `/platform/${platform.id}`

  return (
    <div className="group rounded-3xl bg-white border border-black/10 shadow-sm overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/10">
      <Link to={`/platform/${platform.id}`} className="block relative aspect-square overflow-hidden">
        <div className="absolute inset-3 rounded-2xl bg-neutral-100 ring-1 ring-inset ring-black/[0.06] shadow-[inset_0_1px_3px_rgba(0,0,0,0.06)]" />
        <img
          src={platform.homeImage}
          alt={platform.name}
          className="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </Link>
      <div className="px-5 py-5">
        <h3 className="font-display text-2xl md:text-3xl text-black leading-[0.95] mb-2">{platform.name}</h3>
        <p className="text-black/55 text-sm leading-relaxed flex-shrink-1 mb-5">{platform.tagline}</p>

        <div className={`grid gap-1.5 ${packages.length > 0 ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <Link
            to={baseUnitTarget}
            className="text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-white bg-black hover:bg-black/80 rounded-full px-2 py-2.5 transition"
          >
            Base Unit
          </Link>
          <Link
            to={`/platform/${platform.id}#accessories`}
            className="text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-black border border-black/20 hover:border-black rounded-full px-2 py-2.5 transition"
          >
            Accessories
          </Link>
          {packages.length > 0 && (
            <Link
              to={`/platform/${platform.id}#packages`}
              className="text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-white bg-red-600 hover:bg-red-700 rounded-full px-2 py-2.5 transition"
            >
              Packages
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
