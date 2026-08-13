import { useCart } from '../lib/CartContext'

function lineKey(item) {
  return item.kind === 'package' ? `package:${item.id}` : `product:${item.handle}`
}

export default function CartDrawer({ open, onClose }) {
  const { items, removeItem, updateQuantity, subtotal } = useCart()

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-black border-l border-white/10 z-50 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="font-display text-2xl text-white">Cart</h2>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white text-2xl leading-none px-2"
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <p className="text-white/40 text-sm">Your cart is empty.</p>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={lineKey(item)} className="flex gap-4">
                  <div className="w-20 h-20 bg-neutral-900 rounded flex-shrink-0 overflow-hidden">
                    {item.image && (
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium flex-shrink-1">{item.title}</p>
                        {item.kind === 'package' && item.components?.length > 0 && (
                          <p className="text-white/35 text-xs mt-1 leading-relaxed flex-shrink-1">
                            {item.components.map((c) => c.title).join(' + ')}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item)}
                        className="text-white/30 hover:text-red-400 text-xs flex-shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-white/15 rounded-full">
                        <button
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          className="w-7 h-7 text-white/60 hover:text-white text-sm"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="text-white text-xs w-6 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          className="w-7 h-7 text-white/60 hover:text-white text-sm"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-white/80 text-sm tabular-nums">
                        ${(item.price * item.quantity).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-white/10 px-6 py-6">
            <div className="flex items-center justify-between mb-5">
              <span className="text-white/50 text-sm">Subtotal</span>
              <span className="text-white text-xl font-light tabular-nums">${subtotal.toFixed(0)}</span>
            </div>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold uppercase tracking-widest px-6 py-4 rounded-full transition">
              Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
