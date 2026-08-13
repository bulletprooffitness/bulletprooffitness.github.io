import logo from '../assets/brand/logo.png'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <img src={logo} alt="Bulletproof Fitness Equipment" className="h-8 w-auto object-contain" />
          <p className="text-white/40 text-sm mt-3 max-w-xs">
            Commercial-grade strength training. Engineered for space and versatility.
          </p>
        </div>
        <p className="text-white/30 text-xs self-end">
          Private preview — not a public site.
        </p>
      </div>
    </footer>
  )
}
