// Bundle products — a package pairs a base unit with a set of accessories at
// a single price. Kept separate from products.js because packages reference
// other products (baseUnitHandle, accessoryHandles) rather than standing
// alone, and because individualPrice/savings must be *computed* from the
// live prices of those referenced products, never hand-entered — otherwise
// a later price change on an accessory silently makes every package's
// savings figure wrong.
//
// price: what the package sells for when its base unit's default (first)
// variant is selected. If the base unit has multiple variants at different
// prices (e.g. Isolator's 3X3 vs 2X2/2X3), picking a pricier one adds that
// variant's price difference over the default on top of `price` — see
// resolvePackage()'s variantIndex param.
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
    baseUnitHandle: 'isolator',
    accessoryHandles: ['isolator-cam', 'iso-arms-pair'],
    price: 1499.0,
  },
  {
    id: 'vts-starter-package',
    platformId: 'vts',
    name: 'VTS Starter Package',
    description: 'VTS Starter plus the Feather bar and Swivel Handles — a complete Smith-machine-style setup on your existing rack.',
    baseUnitHandle: 'vts-trolley-pair',
    accessoryHandles: ['swivel-handle-pair', 'vts-feather-barbell'],
    price: 1299.0,
  },
  {
    id: 'isolator-side-port-package',
    platformId: 'isolator',
    name: 'Isolator Side Port Package',
    description: 'Use the Isolator multi-directionally, with weights and/or cable resistance!',
    baseUnitHandle: 'isolator',
    accessoryHandles: ['adjustable-multi-horn', 'isolator-crossbow-cam'],
    price: 1699.0,
  },
  {
    id: 'vts-and-all-bar',
    platformId: 'vts',
    name: 'VTS and All Bar',
    description: 'VTS with the specialized All Bar barbell, capable of many grips and movements.',
    baseUnitHandle: 'vts-trolley-pair',
    accessoryHandles: ['all-bar'],
    price: 1199.0,
  },
  {
    id: "vts-lite-starter",
    platformId: "vts",
    name: "VTS Lite Starter",
    description: "VTS Lite carriages, Feather Barbell, and 9\" Weight Horns",
    baseUnitHandle: "vts-lite-rack-attachment-pair",
    accessoryHandles: ["vts-feather-barbell","vts-9in-weight-horns-pair"],
    price: 799,
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

// Resolves a package's referenced products and derived pricing for a given
// base-unit variant (defaults to index 0, the base unit's default variant).
// Returns null for a handle that no longer exists (e.g. a product was
// removed) rather than throwing, so a stale reference degrades instead of
// crashing the platform page.
export function resolvePackage(pkg, variantIndex = 0) {
  const baseUnit = getProduct(pkg.baseUnitHandle) || null
  const accessories = (pkg.accessoryHandles || []).map((handle) => getProduct(handle)).filter(Boolean)

  const baseVariants = baseUnit?.variants || []
  const defaultVariantPrice = baseVariants[0]?.price ?? baseUnit?.price ?? 0
  const selectedVariantPrice = baseVariants[variantIndex]?.price ?? defaultVariantPrice
  const variantUpcharge = selectedVariantPrice - defaultVariantPrice

  const baseUnitPrice = selectedVariantPrice
  const componentPrices = [baseUnitPrice, ...accessories.map((a) => a.price)]
  const individualPrice = componentPrices.reduce((sum, price) => sum + price, 0)
  const price = pkg.price + variantUpcharge
  const savings = Math.max(0, individualPrice - price)

  return {
    ...pkg,
    baseUnit,
    accessories,
    variantIndex,
    baseUnitPrice,
    price,
    individualPrice,
    savings,
  }
}

export { getAllPackageOverrides }


