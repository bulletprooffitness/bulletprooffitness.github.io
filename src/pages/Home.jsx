import { Link } from 'react-router-dom'
import { getNavPlatforms } from '../data/platforms'
import { categories } from '../data/categories'
import PlatformCard from '../components/PlatformCard'
import CategoryCard from '../components/CategoryCard'

export default function Home() {
  return (
    <div>
      <section className="relative h-[85vh] min-h-[560px] flex items-end overflow-hidden bg-black">
        {/* Product pinned to the right two-thirds; left third stays clear for the headline
            so type never overlaps machine detail (Tonal / Eleiko pattern). */}
        <img
          src="/src/assets/products/isolator-3x3_-2.jpg"
          alt="Bulletproof Isolator"
          className="absolute inset-y-0 right-0 w-[72%] h-full object-cover object-left"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 via-30% to-transparent to-60%" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 pb-20 w-full">
          <h1 className="font-display text-6xl md:text-8xl text-white leading-[0.92] max-w-xl">
            Commercial-grade strength training.
          </h1>
          <p className="text-white/50 text-lg mt-5 max-w-md leading-relaxed flex-shrink-1">
            Engineered for space and versatility.
          </p>
          <div className="mt-10 flex gap-4">
            <Link
              to="/shop"
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold uppercase tracking-[0.15em] px-9 py-4 rounded-full transition"
            >
              Shop All
            </Link>
            <Link
              to="/our-story"
              className="border border-white/40 hover:border-white hover:bg-white/5 text-white text-sm font-semibold uppercase tracking-[0.15em] px-9 py-4 rounded-full transition"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-neutral-100">
        <h2 className="font-display text-5xl md:text-6xl text-black mb-12 leading-none max-w-7xl mx-auto px-6">
          Shop
        </h2>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {getNavPlatforms().map((p) => (
            <PlatformCard key={p.id} platform={p} />
          ))}
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="relative bg-neutral-100 py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-2 relative">
            <img
              src="/src/assets/brand/P1259186_a98e293a-5fa5-468a-914d-dcd076a5d7b5.jpg"
              alt="Larry Nolan, founder of Bulletproof Fitness Equipment, with his sister"
              className="w-full h-[560px] object-cover object-top shadow-2xl"
            />
          </div>
          <div className="md:col-span-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-black/40">
              Family-Run Since 2007
            </span>
            <h2 className="font-display text-5xl md:text-6xl text-black leading-[0.95] mt-3 mb-6">
              Built by Lifters,
              <br />
              for Lifters.
            </h2>
            <p className="text-black/60 leading-relaxed text-lg max-w-lg flex-shrink-1">
              At 15, Larry Nolan was told he'd never lift again. He rebuilt his own body, then
              built a company — 5x Inc. 5000 — that never left the family. Today it's still just
              three people: Larry, his sister, and his mother, who hand-packs every order with a
              handwritten thank-you note.
            </p>
            <Link
              to="/our-story"
              className="inline-block mt-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-black border-b border-black/30 hover:border-black transition pb-1"
            >
              Read the full story →
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
