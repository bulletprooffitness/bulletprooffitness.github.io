import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// react-router doesn't scroll to #hash targets on navigation by default.
// Runs after route content mounts so the target element actually exists.
export default function ScrollToHash() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    const id = hash.slice(1)
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    })
    return () => cancelAnimationFrame(raf)
  }, [hash, pathname])

  return null
}
