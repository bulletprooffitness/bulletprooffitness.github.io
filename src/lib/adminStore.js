// Admin overlay: lets someone correct product data (category, relationships)
// in the browser without a backend. Edits persist to localStorage and are
// merged over the base mock data at read time — the base products.js file
// is never mutated. Use the "Copy as Code" export in the admin screen to
// promote a correction into the real source file.
const STORAGE_KEY = 'bulletproof_admin_overrides_v1'

function readOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeOverrides(overrides) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
}

export function getOverride(handle) {
  return readOverrides()[handle] || null
}

export function getAllOverrides() {
  return readOverrides()
}

export function setOverride(handle, patch) {
  const overrides = readOverrides()
  overrides[handle] = { ...(overrides[handle] || {}), ...patch }
  writeOverrides(overrides)
}

export function clearOverride(handle) {
  const overrides = readOverrides()
  delete overrides[handle]
  writeOverrides(overrides)
}

export function clearAllOverrides() {
  localStorage.removeItem(STORAGE_KEY)
}

// Merges base product data with any admin overrides for that handle.
export function applyOverrides(products) {
  const overrides = readOverrides()
  return products.map((p) => (overrides[p.handle] ? { ...p, ...overrides[p.handle] } : p))
}
