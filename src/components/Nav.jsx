import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { getNavPlatforms } from '../data/platforms'
import { useCart } from '../lib/CartContext'
import CartDrawer from './CartDrawer'
import logo from '../assets/brand/logo.png'

const linkClass = ({ isActive }) =>
  `text-xs font-semibold uppercase tracking-widest transition ${
    isActive ? 'text-white' : 'text-white/60 hover:text-white'
  }`

// Shown only while the site is running as a password-gated preview (see
// AuthContext's VITE_DEMO_PASSWORD). Once the site goes live, that env var
// is removed from the deploy and this tab disappears with it — no manual
// find-and-delete needed.
const IS_PREVIEW = Boolean(import.meta.env.VITE_DEMO_PASSWORD)

export default function Nav() {
  const [cartOpen, setCartOpen] = useState(false)
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/10">
      <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center h-9">
          <img src={logo} alt="Bulletproof Fitness Equipment" className="h-full w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          
          <div className="flex items-center gap-3">
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
            <span className="text-white/20 text-xs select-none">|</span>
          </div>
          {getNavPlatforms().map((p) => (
            <NavLink key={p.id} to={`/platform/${p.id}`} className={linkClass}>
              {p.name}
            </NavLink>
          ))}
          <NavLink to="/apparel" className={linkClass}>
            Apparel
          </NavLink>
          <NavLink to="/shop" className={linkClass}>
            Shop All
          </NavLink>
          <NavLink to="/our-story" className={linkClass}>
            Our Story
          </NavLink>
          {IS_PREVIEW && (
            <Link
              to="/admin"
              className="bg-amber-400 hover:bg-amber-300 text-black text-[11px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition"
            >
              Admin
            </Link>
          )}
        </nav>

        <button
          onClick={() => setCartOpen(true)}
          className="relative flex items-center justify-center w-9 h-9 text-white/70 hover:text-white transition"
          aria-label="Open cart"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 6h15l-1.5 9h-13z" />
            <path d="M6 6 5 3H2" />
            <circle cx="9" cy="20" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="18" cy="20" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {count}
            </span>
          )}
        </button>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}
