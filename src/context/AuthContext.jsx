import { createContext, useContext, useState } from 'react'

// Credentials are read from environment variables at build time.
// Set VITE_DEMO_PASSWORD in a .env.local file (not committed to git).
// Note: Vite bakes env vars into the compiled bundle — not a server-side secret.
// The repo stays private; this gate is a light deterrent on top, not real access control.
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD ?? ''
const SESSION_KEY = 'bulletproof_preview_auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1')

  function login(password) {
    if (password === DEMO_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1')
      setAuthed(true)
      return true
    }
    return false
  }

  return <AuthContext.Provider value={{ authed, login }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
