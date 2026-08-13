// Shopify-Storefront-shaped mock product data for the Phase 1 demo.
// Swapping this module for a real Storefront API client later is a
// fetch-layer change, not a data-shape change — every field here mirrors
// what the Storefront API returns (variants, images, tags).
//
// role: "platform" | "attachment" | "accessory" | "standalone" | "apparel"
//
// relationships: how this product relates to platforms — see relationshipTypes.js.
//   [{ platformId, type: 'fits' | 'paired-with', note?: string }]
// Reference platform ids directly (e.g. 'isolator'), and for VTS use the
// specific sub-platform ('vts-full' or 'vts-lite') — never the hub id 'vts' —
// since compatibility genuinely differs between the two.
//
// An empty or missing `relationships` array means "not yet verified" —
// deliberately left blank rather than guessed. Confirm with the business
// before publishing; use the Admin > Compatibility screen to fill these in.

export const products = [
  {
    handle: 'isolator-3x3',
    title: 'ISOLATOR 3X3',
    role: 'platform',
    relationships: [{ platformId: 'isolator', type: 'fits' }],
    price: 899.0,
    // Sourced from their real product copy (docs/scan/products_p1.json), condensed.
    description:
      'A cost-effective, space-saving base unit for isolated exercises you\'d otherwise need a full commercial gym for. Includes the carriage, weight holder, and pins, plus the preacher pad/seat, short leg pad, long leg pad, and curl arm attachment. 3x3" post.',
    images: [
      '/src/assets/products/isolator-3x3_-1.jpg',
      '/src/assets/products/isolator-3x3_-2.jpg',
    ],
    variants: [{ title: '3X3', price: 899.0, available: true }],
    // Placeholder spec values for demo layout — confirm real numbers before this goes live.
    specs: { postSize: '3" x 3"', footprint: '48" x 24"', weightCapacity: '400 lb / side', camOptions: '5' },
  },
  {
    handle: 'isolator-2x2-2x3',
    title: 'ISOLATOR 2X2/2X3',
    role: 'platform',
    relationships: [{ platformId: 'isolator', type: 'fits' }],
    price: 939.0,
    description:
      'The same ISOLATOR base unit — carriage, weight holder, pins, and full attachment set (preacher pad/seat, short and long leg pads, curl arm attachment) — sized for a 2x2" or 2x3" post.',
    images: ['/src/assets/products/test-2-1.jpg', '/src/assets/products/test-2-2.jpg'],
    variants: [{ title: '2X2/2X3', price: 939.0, available: true }],
    specs: { postSize: '2" x 2" / 2" x 3"', footprint: '42" x 22"', weightCapacity: '350 lb / side', camOptions: '5' },
  },
  {
    handle: 'isolator-cam',
    title: 'ISOLATOR Cam',
    role: 'attachment',
    relationships: [{ platformId: 'isolator', type: 'fits' }],
    price: 318.99,
    description:
      'The core cam module that drives ISOLATOR resistance. Available in multiple ratio and upright configurations.',
    images: [
      '/src/assets/products/isolator-cam-1-1.png',
      '/src/assets/products/isolator-cam-1-2.png',
    ],
    variants: [{ title: 'Standard', price: 318.99, available: true }],
  },
  {
    handle: 'isolator-crossbow-cam',
    title: 'ISOLATOR Crossbow Cam',
    role: 'attachment',
    relationships: [{ platformId: 'isolator', type: 'fits' }],
    price: 299.98,
    description:
      'The Crossbow Cam variant — a distinct cam product from the standard ISOLATOR Cam, offering a different resistance profile. Pre-packaged pulley/cable configurations are sold as separate SKUs (e.g. "1:1 Ratio Back Upright").',
    images: [
      '/src/assets/products/isolator-crossbow-cam-1-1.png',
      '/src/assets/products/isolator-crossbow-cam-1-2.png',
    ],
    variants: [{ title: 'Standard', price: 299.98, available: true }],
  },
  {
    handle: 'hex-port-attachment-2',
    title: 'Hex Port Attachment 2.0',
    role: 'accessory',
    category: 'attachments',
    // Mounts to a standard rack, power cage, or Solo Stand — not Isolator-specific.
    // Commonly used alongside Isolator setups, but does not attach to Isolator itself.
    relationships: [
      { platformId: 'solo-stand', type: 'fits' },
      {
        platformId: 'isolator',
        type: 'paired-with',
        note: 'Mounts to any standard rack, power cage, or Solo Stand — commonly used alongside Isolator setups.',
      },
    ],
    price: 79.99,
    description:
      'Mounts to the rack post above your setup for seated leg curls without flipping the carriage — slide in the self-adjusting leg pad or your own seat/pad. Also enables preacher curls for barbells and dumbbells.',
    images: [
      '/src/assets/products/hex-port-attachment-1.png',
      '/src/assets/products/hex-port-attachment-2.png',
    ],
    variants: [{ title: 'Standard', price: 79.99, available: true }],
  },
  {
    handle: 'iso-arms-pair',
    title: 'ISO Arms (PAIR)',
    role: 'accessory',
    relationships: [{ platformId: 'isolator', type: 'fits' }],
    price: 449.0,
    description:
      "Plug-and-play extensions that mount into the ISOLATOR's left and right hex ports, turning it from an isolation machine into a multi-angle leverage press, row, and dip machine.",
    images: [
      '/src/assets/products/iso-arms-pair-1-1.png',
      '/src/assets/products/iso-arms-pair-1-2.png',
    ],
    variants: [{ title: 'Standard', price: 449.0, available: true }],
  },
  {
    handle: 'adjustable-multi-horn',
    title: 'Adjustable Multi Horn',
    role: 'accessory',
    relationships: [{ platformId: 'isolator', type: 'fits' }],
    price: 699.0,
    description:
      'A fully adjustable, plate-loaded resistance curve system — change the angle, height, and configuration of the weight horns to fine-tune how resistance is applied throughout the movement.',
    images: [
      '/src/assets/products/triple-weight-horn-1.png',
      '/src/assets/products/triple-weight-horn-2.png',
    ],
    variants: [{ title: 'Standard', price: 699.0, available: true }],
  },
  {
    handle: 'the-solo-stand-deluxe',
    title: 'The Solo Stand Deluxe',
    role: 'platform',
    relationships: [{ platformId: 'solo-stand', type: 'fits' }],
    price: 349.0,
    description:
      "A compact, foldable, single-post stand — a smaller, more affordable alternative to the Tri-Post Rack for running the ISOLATOR without a squat rack. Fits in a corner of a garage.",
    images: [
      '/src/assets/products/the-solo-stand-1.png',
      '/src/assets/products/the-solo-stand-2.png',
    ],
    variants: [{ title: 'Standard', price: 349.0, available: true }],
  },
  {
    handle: 'direct-flight-multi-flight',
    title: 'Direct Flight Multi-Flight',
    role: 'standalone',
    relationships: [{ platformId: 'standalone', type: 'fits' }],
    price: 349.0,
    description:
      'A rack-attached multi-flight machine built to avoid the drop-off and inconsistent resistance curves typical of plate-loaded rack attachments, without the floor space a full commercial multi-flight machine demands.',
    images: ['/src/assets/products/direct-flight-1.png', '/src/assets/products/direct-flight-2.png'],
    variants: [{ title: 'Standard', price: 349.0, available: true }],
  },
  {
    handle: 'vbs-vertical-belt-squat-system',
    title: 'VBS Vertical Belt Squat System',
    role: 'standalone',
    relationships: [{ platformId: 'standalone', type: 'fits' }],
    price: 1249.99,
    description:
      'True vertical, plate-loaded belt squat resistance in a footprint that fits a real gym. Lock it for strict vertical reps, or unlock it for natural 3D hip articulation without swing, pulley drag, or lever arcs.',
    images: [
      '/src/assets/products/vbs-vertical-belt-squat-system-1.png',
      '/src/assets/products/vbs-vertical-belt-squat-system-2.png',
    ],
    variants: [{ title: 'Standard', price: 1249.99, available: true }],
  },
  {
    handle: 'vts-starter',
    title: 'VTS STARTER',
    role: 'platform',
    // Starter bundle is the full-duty VTS line specifically.
    relationships: [{ platformId: 'vts-full', type: 'fits' }],
    price: 899.0,
    // Their own product page had no body copy for this bundle — described here
    // using the real VTS Rack Attachment copy below, since Starter is that unit.
    description:
      "The entry point into VTS (Versa Trolley System) — converts a squat rack or rig into a Smith-machine-style trainer using your own barbell, with UHMW rollers to protect the upright and a hex port system for attachments.",
    images: ['/src/assets/products/vts-starter-1.png', '/src/assets/products/vts-starter-2.png'],
    variants: [{ title: 'Starter', price: 899.0, available: true }],
  },
  {
    handle: 'vts-rack-attachment-pair',
    title: 'VTS Rack Attachment (PAIR)',
    role: 'accessory',
    category: 'attachments',
    relationships: [{ platformId: 'vts-full', type: 'fits' }],
    price: 899.0,
    description:
      "The VTS (Versa Trolley System) — converts your squat rack or rig into a Smith-machine-style trainer using your own barbell, with a proprietary clamp system and UHMW rollers to protect the upright. The hex port system opens up the full VTS attachment ecosystem.",
    images: [
      '/src/assets/products/vts-rack-attachment-pair-1-1.png',
      '/src/assets/products/vts-rack-attachment-pair-1-2.png',
    ],
    variants: [{ title: 'Standard', price: 899.0, available: true }],
  },
  {
    handle: '360-bearing-handle-pair',
    title: '360 Bearing Handles (PAIR)',
    role: 'accessory',
    category: 'handles',
    // Confirmed: fits VTS (full-duty) only — not VTS Lite, not Isolator.
    relationships: [{ platformId: 'vts-full', type: 'fits' }],
    price: 489.0,
    description:
      "One of the largest bearing assemblies in a gym attachment — allows 360° rotation under load, and latches onto the VTS uprights like a Smith machine.",
    images: ['/src/assets/products/360-bearing-handle-1.png'],
    variants: [{ title: 'Standard', price: 489.0, available: true }],
  },
  {
    handle: 'swivel-handle-pair',
    title: 'Swivel Handle (PAIR)',
    role: 'accessory',
    category: 'handles',
    // Confirmed by their own product copy: "attach directly to your VTS (not VTS
    // Lite) uprights using your existing hooks." VTS-only, explicitly not VTS Lite.
    relationships: [{ platformId: 'vts-full', type: 'fits' }],
    price: 399.0,
    description:
      "Attaches directly to your VTS uprights (not VTS Lite) using your existing hooks — the stability of a fixed handle with the slight articulation of a swivel, for trolley and jammer-style pressing and pulling movements.",
    images: ['/src/assets/products/swivel-handle-1.png', '/src/assets/products/swivel-handle-2.png'],
    variants: [{ title: 'Standard', price: 399.0, available: true }],
  },
  {
    handle: 'all-bar',
    title: 'All Bar',
    role: 'accessory',
    category: 'barbells',
    // Confirmed: fits both VTS and VTS Lite. General rule (from the business,
    // not their site copy): full-spanning bars that clamp both trolleys work on
    // both VTS and VTS Lite. VTS Lite trolleys can't accept isolated/single-side
    // handles — those (e.g. Swivel Handle, 360 Bearing Handles) are VTS-only.
    relationships: [
      { platformId: 'vts-full', type: 'fits' },
      { platformId: 'vts-lite', type: 'fits' },
    ],
    price: 399.99,
    // Their product page had no body copy — name and category confirmed, full
    // description not yet available from their site.
    description: 'A full-spanning barbell that clamps both VTS trolleys, for cable-fed squats, presses, and pulls.',
    images: ['/src/assets/products/all-bar-1.png'],
    variants: [{ title: 'Standard', price: 399.99, available: true }],
  },
  {
    handle: 'vts-feather-barbell',
    title: 'VTS Feather Barbell',
    role: 'accessory',
    category: 'barbells',
    // Inferred, not confirmed: full-spanning barbell, so per the business's stated
    // rule it should fit both VTS and VTS Lite — but their product copy only
    // confirms "VTS unit" without addressing Lite explicitly. Flag for confirmation.
    relationships: [
      { platformId: 'vts-full', type: 'fits' },
      { platformId: 'vts-lite', type: 'fits', note: 'Inferred from full-spanning-bar rule — not explicitly confirmed.' },
    ],
    price: 135.0,
    description:
      'A 13 lb barbell that ditches traditional weight sleeves for removable side weight horns, pairing with your VTS unit for a lighter, ~23 lb total setup versus a standard 45 lb bar.',
    images: [
      '/src/assets/products/vts-feather-barbell-1.png',
      '/src/assets/products/vts-feather-barbell-2.png',
    ],
    variants: [{ title: 'Standard', price: 135.0, available: true }],
  },
  {
    handle: 't-shirt-bp-logo',
    title: 'T-SHIRT - BP Logo',
    role: 'apparel',
    apparelCategory: 'tees',
    price: 26.0,
    description: 'Classic Bulletproof logo tee.',
    images: [
      '/src/assets/products/copy-of-t-shirt-bulletproof-black-logo-1.jpg',
      '/src/assets/products/copy-of-t-shirt-bulletproof-black-logo-2.jpg',
    ],
    variants: [
      { title: 'S', price: 26.0, available: true },
      { title: 'M', price: 26.0, available: true },
      { title: 'L', price: 26.0, available: true },
      { title: 'XL', price: 26.0, available: true },
    ],
  },
  {
    handle: 'hoodie-bulletproof-logo',
    title: 'HOODIE - Bulletproof Logo',
    role: 'apparel',
    apparelCategory: 'hoodies',
    price: 60.0,
    description: 'Bulletproof logo hoodie.',
    images: [
      '/src/assets/products/hoodie-bulletproof-basic-1.jpg',
      '/src/assets/products/hoodie-bulletproof-basic-2.jpg',
    ],
    variants: [
      { title: 'S', price: 60.0, available: true },
      { title: 'M', price: 60.0, available: true },
      { title: 'L', price: 60.0, available: true },
      { title: 'XL', price: 60.0, available: true },
    ],
  },
  {
    handle: 'hat-black-garage-gym-royalty',
    title: 'HAT - Black Garage Gym Royalty',
    role: 'apparel',
    apparelCategory: 'hats',
    price: 29.99,
    description: 'Black Garage Gym Royalty snapback hat.',
    images: [
      '/src/assets/products/black-garage-gym-royalty-hat-1.jpg',
      '/src/assets/products/black-garage-gym-royalty-hat-2.jpg',
    ],
    variants: [{ title: 'One Size', price: 29.99, available: true }],
  },
]

// Admin corrections (category, relationships, etc.) live in localStorage and
// are merged over this base data at read time — see lib/adminStore.js.
// All lookups below go through getProducts() so edits show up everywhere
// without needing to touch every page that reads product data.
import { applyOverrides } from '../lib/adminStore'

export function getProducts() {
  return applyOverrides(products)
}

export function getProduct(handle) {
  return getProducts().find((p) => p.handle === handle)
}

// Accepts a hub platform id (e.g. 'vts') and expands it to include its
// sub-platforms so hub pages show products tagged to either fork.
export function getProductsByPlatform(platformId, subPlatformIds = []) {
  const ids = [platformId, ...subPlatformIds]
  return getProducts().filter((p) => p.relationships?.some((r) => ids.includes(r.platformId)))
}

export function getApparel() {
  return getProducts().filter((p) => p.role === 'apparel')
}

export function getEquipment() {
  return getProducts().filter((p) => p.role !== 'apparel')
}

export function getProductsByCategory(category) {
  return getProducts().filter((p) => p.category === category)
}

// Resolves the base-unit and accessory home-grid destinations for a
// platform card. Packages are resolved separately via
// getPackagesByPlatform() in data/packages.js (kept out of this function to
// avoid a circular import — packages.js already imports getProduct from
// here).
export function getPlatformLinks(platform) {
  const ids = platform.isHub ? platform.subPlatformIds : [platform.id, ...(platform.subPlatformIds || [])]
  const related = getProducts().filter((p) => p.relationships?.some((r) => ids.includes(r.platformId)))
  const baseUnits = related.filter((p) => p.role === 'platform')
  const accessories = related.filter((p) => p.role !== 'platform')
  return { baseUnits, accessories }
}
