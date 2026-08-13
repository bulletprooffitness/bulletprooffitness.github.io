import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getNavPlatforms } from '../data/platforms'
import { categories } from '../data/categories'

// Same 6 destinations as the Home "Shop" grid (4 platforms + 2 categories),
// just surfaced from the nav so they're reachable without scrolling home
// first. Deliberately reuses getNavPlatforms()/categories rather than its
// own list, so adding a platform/category to Home adds it here too.
export default function CategoryDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    function handleEscape(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const items = [
    ...getNavPlatforms().map((p) => ({
      key: p.id,
      to: `/platform/${p.id}`,
      name: p.name,
      tagline: p.tagline,
      image: p.homeImage,
    })),
    ...categories.map((c) => ({
      key: c.id,
      to: `/category/${c.id}`,
      name: c.name,
      tagline: c.tagline,
      image: c.homeImage,
    })),
  ]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest transition ${
          open ? 'text-white' : 'text-white/60 hover:text-white'
        }`}
        aria-expanded={open}
      >
        Shop Categories
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-200 origin-top ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="w-[560px] bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-4 grid grid-cols-3 gap-3">
          {items.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              onClick={() => setOpen(false)}
              className="group rounded-xl overflow-hidden bg-neutral-900 border border-white/5 hover:border-white/20 transition"
            >
              <div className="relative aspect-square bg-neutral-800 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.06]"
                />
              </div>
              <div className="px-3 py-2.5">
                <p className="text-white text-xs font-semibold leading-snug flex-shrink-1">{item.name}</p>
                <p className="text-white/40 text-[11px] leading-snug mt-0.5 flex-shrink-1 line-clamp-2">
                  {item.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
