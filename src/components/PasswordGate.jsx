import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function PasswordGate({ children }) {
  const { authed, login } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (authed) return children

  function handleSubmit(e) {
    e.preventDefault()
    if (!login(password)) {
      setError('Incorrect password.')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display text-3xl tracking-wide text-white">BULLETPROOF</span>
          <p className="text-white/50 text-xs uppercase tracking-widest mt-1">Private Preview</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-900 border border-white/10 rounded p-8 space-y-4">
          <div>
            <label htmlFor="preview-password" className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              id="preview-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              className="w-full bg-black border border-white/20 rounded px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-600/50 transition"
              placeholder="Enter password"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            className="w-full justify-center py-3 text-sm font-semibold uppercase tracking-widest bg-red-600 hover:bg-red-700 text-white rounded transition"
          >
            View Preview
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-5">This preview is not public.</p>
      </div>
    </div>
  )
}
