import { createContext, useContext, useEffect, useState } from 'react'

// Real password check happens server-side in worker/auth.worker.js — the
// password itself is never in this bundle. login() posts the entered
// password to the Worker; on success it stores the signed session token it
// returns and re-sends that token (not the password) for future verify()
// calls. See worker/auth.worker.js for why: Vite bakes VITE_* env vars into
// the shipped JS as plain text, so any client-side-only check is readable by
// anyone who opens dev tools — this Worker is what makes the gate real.
const AUTH_ENDPOINT = import.meta.env.VITE_AUTH_ENDPOINT ?? 'https://preview-auth.fosterapps.com'
const SESSION_KEY = 'bulletproof_preview_token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(SESSION_KEY))
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!token) {
      setChecking(false)
      return
    }
    fetch(`${AUTH_ENDPOINT}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => setAuthed(Boolean(data.valid)))
      .catch(() => setAuthed(false))
      .finally(() => setChecking(false))
  }, [token])

  async function login(password) {
    try {
      const res = await fetch(`${AUTH_ENDPOINT}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) return false
      const data = await res.json()
      if (!data.token) return false
      sessionStorage.setItem(SESSION_KEY, data.token)
      setToken(data.token)
      setAuthed(true)
      return true
    } catch {
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ authed, checking, login }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
