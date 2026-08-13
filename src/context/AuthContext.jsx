import { createContext, useContext, useEffect, useState } from 'react'

// Real password check happens server-side in worker/auth.worker.js — the
// password itself is never in this bundle. login() posts the entered
// password to the Worker; on success it stores the signed session token it
// returns and re-sends that token (not the password) for future verify()
// calls. See worker/auth.worker.js for why: Vite bakes VITE_* env vars into
// the shipped JS as plain text, so any client-side-only check is readable by
// anyone who opens dev tools — this Worker is what makes the gate real.
const AUTH_ENDPOINT =
  import.meta.env.VITE_AUTH_ENDPOINT ?? 'https://bulletproof-preview-auth.fosterapps.workers.dev'
const SESSION_KEY = 'bulletproof_preview_token'

// Matches worker/auth.worker.js's TOKEN_TTL_SECONDS — surfaced in the UI
// (login screen + logout) so a "remember me" session isn't a silent,
// unexplained thing a repeat visitor might grow suspicious of.
export const REMEMBER_ME_DAYS = 7

const AuthContext = createContext(null)

// The token can live in either storage depending on "remember me" at login
// time. Check both so a page load doesn't miss a token stored the other way
// (e.g. after switching devices/tabs, or after this code path changes).
function readStoredToken() {
  const local = localStorage.getItem(SESSION_KEY)
  if (local) return { token: local, remembered: true }
  const session = sessionStorage.getItem(SESSION_KEY)
  if (session) return { token: session, remembered: false }
  return { token: null, remembered: false }
}

export function AuthProvider({ children }) {
  const [{ token, remembered }, setStored] = useState(readStoredToken)
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

  async function login(password, rememberMe) {
    try {
      const res = await fetch(`${AUTH_ENDPOINT}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) return false
      const data = await res.json()
      if (!data.token) return false

      // Clear whichever storage isn't being used, so a later "remember me"
      // toggle change doesn't leave a stale token behind in the other one.
      if (rememberMe) {
        localStorage.setItem(SESSION_KEY, data.token)
        sessionStorage.removeItem(SESSION_KEY)
      } else {
        sessionStorage.setItem(SESSION_KEY, data.token)
        localStorage.removeItem(SESSION_KEY)
      }
      setStored({ token: data.token, remembered: Boolean(rememberMe) })
      setAuthed(true)
      return true
    } catch {
      return false
    }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
    setStored({ token: null, remembered: false })
    setAuthed(false)
  }

  return (
    <AuthContext.Provider value={{ authed, checking, remembered, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
