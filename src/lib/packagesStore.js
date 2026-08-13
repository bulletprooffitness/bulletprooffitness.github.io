// Admin overlay for packages, mirroring lib/adminStore.js's pattern: edits
// persist to localStorage and merge over the base packages.js array at read
// time, keyed by package id. The base file is never mutated — "Copy as Code"
// in the admin screen promotes an override into a real source-file entry.
const STORAGE_KEY = 'bulletproof_admin_packages_v1'

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { created: [], overrides: {}, deleted: [] }
  } catch {
    return { created: [], overrides: {}, deleted: [] }
  }
}

function writeStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function getAllPackageOverrides() {
  return readStore()
}

export function createPackage(pkg) {
  const store = readStore()
  store.created.push(pkg)
  writeStore(store)
}

export function updatePackage(id, patch) {
  const store = readStore()
  store.overrides[id] = { ...(store.overrides[id] || {}), ...patch }
  writeStore(store)
}

export function deletePackage(id) {
  const store = readStore()
  if (!store.deleted.includes(id)) store.deleted.push(id)
  writeStore(store)
}

export function clearAllPackageOverrides() {
  localStorage.removeItem(STORAGE_KEY)
}

// Merges base packages with admin-created/edited/deleted packages.
export function applyPackageOverrides(basePackages) {
  const store = readStore()
  const merged = basePackages
    .filter((pkg) => !store.deleted.includes(pkg.id))
    .map((pkg) => (store.overrides[pkg.id] ? { ...pkg, ...store.overrides[pkg.id] } : pkg))
  const createdActive = store.created.filter((pkg) => !store.deleted.includes(pkg.id))
  const createdMerged = createdActive.map((pkg) =>
    store.overrides[pkg.id] ? { ...pkg, ...store.overrides[pkg.id] } : pkg
  )
  return [...merged, ...createdMerged]
}
