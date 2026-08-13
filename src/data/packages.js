// Bundle products — a package pairs a base unit with a set of accessories at
// a single price. Kept separate from products.js because packages reference
// other products (baseUnitHandle, accessoryHandles) rather than standing
// alone, and because individualPrice/savings must be *computed* from the
// live prices of those referenced products, never hand-entered — otherwise
// a later price change on an accessory silently makes every package's
// savings figure wrong.
//
// price: what the package actually sells for.
// savings is derived as individualPrice - price, and only shown when > 0 —
// a package can exist purely for convenience (bundled checkout, one SKU)
// with no discount, in which case no savings badge renders.
import { getProduct } from './products'
import { getAllPackageOverrides, applyPackageOverrides } from '../lib/packagesStore'

export const packages = [
  {
    id: 'isolator-starter-package',
    platformId: 'isolator',
    name: 'Isolator Starter Package',
    description: 'The base unit plus the Cam and ISO Arms — everything you need to start running isolated exercises out of the box.',
    baseUnitHandle: 'isolator-3x3',
    accessoryHandles: ['isolator-cam', 'iso-arms-pair'],
    price: 1499.0,
  },
  {
    id: 'vts-starter-package',
    platformId: 'vts',
    name: 'VTS Starter Package',
    description: 'VTS Starter plus the Rack Attachment and Swivel Handles — a complete Smith-machine-style setup on your existing rack.',
    baseUnitHandle: 'vts-starter',
    accessoryHandles: ['vts-rack-attachment-pair', 'swivel-handle-pair'],
    price: 1999.0,
  },
]

export function getPackages() {
  return applyPackageOverrides(packages)
}

export function getPackage(id) {
  return getPackages().find((pkg) => pkg.id === id)
}

export function getPackagesByPlatform(platformId) {
  return getPackages().filter((pkg) => pkg.platformId === platformId)
}

// Resolves a package's referenced products and derived pricing. Returns
// null for a handle that no longer exists (e.g. a product was removed)
// rather than throwing, so a stale reference degrades instead of crashing
// the platform page.
export function resolvePackage(pkg) {
  const baseUnit = getProduct(pkg.baseUnitHandle) || null
  const accessories = (pkg.accessoryHandles || []).map((handle) => getProduct(handle)).filter(Boolean)
  const componentPrices = [baseUnit, ...accessories].filter(Boolean).map((p) => p.price)
  const individualPrice = componentPrices.reduce((sum, price) => sum + price, 0)
  const savings = Math.max(0, individualPrice - pkg.price)

  return {
    ...pkg,
    baseUnit,
    accessories,
    individualPrice,
    savings,
  }
}

export { getAllPackageOverrides }
