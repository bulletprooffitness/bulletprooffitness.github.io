import { createContext, useContext, useEffect, useState } from 'react'

// Cart state, persisted to localStorage. Shaped so the swap to a real
// Storefront API cart later is a fetch-layer change inside this file only —
// components consume add/remove/updateQuantity/items via useCart() and don't
// know or care whether the cart lives in localStorage or a Shopify cartId.
//
// A line item is either a single product:
//   { kind: 'product', handle, title, price, image, quantity }
// or a resolved package, added as one collapsed line at the bundle price:
//   { kind: 'package', id, title, price, image, quantity, components: [{ title }] }
const STORAGE_KEY = 'bulletproof_cart_v1'

const CartContext = createContext(null)

function readCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function lineKey(item) {
  return item.kind === 'package' ? `package:${item.id}` : `product:${item.handle}`
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  function addItem(item, quantity = 1) {
    setItems((prev) => {
      const key = lineKey(item)
      const existing = prev.find((i) => lineKey(i) === key)
      if (existing) {
        return prev.map((i) => (lineKey(i) === key ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [...prev, { ...item, quantity }]
    })
  }

  function removeItem(item) {
    const key = lineKey(item)
    setItems((prev) => prev.filter((i) => lineKey(i) !== key))
  }

  function updateQuantity(item, quantity) {
    const key = lineKey(item)
    if (quantity <= 0) {
      removeItem(item)
      return
    }
    setItems((prev) => prev.map((i) => (lineKey(i) === key ? { ...i, quantity } : i)))
  }

  function clearCart() {
    setItems([])
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
