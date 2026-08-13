/**
 * Bulletproof preview-site password gate.
 *
 * The real password lives only here, as a Worker secret (`wrangler secret put
 * BP_PREVIEW_PASSWORD`) — it is never sent to or stored in the browser bundle.
 * On a correct POST /login, issues an HMAC-signed session token (site's
 * origin never sees the password or secret key, only the opaque token).
 * POST /verify checks a token's signature + expiry without touching D1/KV —
 * stateless, so there's nothing to provision beyond the two secrets below.
 *
 *   POST /login   { password } -> { token } | 401
 *   POST /verify  { token }    -> { valid: true|false }
 *
 * Required secrets (wrangler secret put <name>):
 *   BP_PREVIEW_PASSWORD   - the real preview password
 *   SESSION_SECRET      - random string used to HMAC-sign session tokens
 */

const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7 // 7 days

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

async function issueToken(env) {
  const expires = Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS
  const payload = `${expires}`
  const sig = await hmac(env.SESSION_SECRET, payload)
  return `${payload}.${sig}`
}

async function verifyToken(env, token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return false
  const [payload, sig] = token.split('.')
  const expected = await hmac(env.SESSION_SECRET, payload)
  if (sig !== expected) return false
  const expires = parseInt(payload, 10)
  if (!Number.isFinite(expires)) return false
  return Date.now() / 1000 < expires
}

async function readJson(request) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin')
    const headers = corsHeaders(origin)

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers })
    }

    const url = new URL(request.url)

    if (request.method === 'POST' && url.pathname === '/login') {
      const { password } = await readJson(request)
      if (typeof password === 'string' && password === env.BP_PREVIEW_PASSWORD) {
        const token = await issueToken(env)
        return Response.json({ token }, { headers })
      }
      return Response.json({ error: 'invalid' }, { status: 401, headers })
    }

    if (request.method === 'POST' && url.pathname === '/verify') {
      const { token } = await readJson(request)
      const valid = await verifyToken(env, token)
      return Response.json({ valid }, { headers })
    }

    return Response.json({ error: 'not found' }, { status: 404, headers })
  },
}
