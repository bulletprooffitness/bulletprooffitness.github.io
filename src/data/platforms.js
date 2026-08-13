// Core equipment platforms. Not exhaustive by design — new platforms can be
// added here without touching product records, since compatibility is
// expressed on the product side via `relationships` (see relationshipTypes.js).
//
// Packages (bundles) for a platform live in data/packages.js, keyed by
// platformId — not stored on the platform record itself.
//
// heroImage/homeImage below are bare filenames from src/assets/products/,
// resolved through productAsset() at the bottom of this file — see the note
// in data/products.js for why they can't be raw '/src/assets/...' strings.
import { productAsset } from '../lib/assets'

const rawPlatforms = [
  {
    id: 'isolator',
    name: 'ISOLATOR',
    tagline: 'The most cost-effective, space-saving way to do isolated exercises.',
    // Sourced from their real product copy (docs/scan/products_p1.json).
    description:
      "A cost-effective, space-saving solution for isolated exercises you'd otherwise need a limited-equipment gym for. Mounts to a rack post; the base carriage/weight-holder unit takes interchangeable pins and attachments (preacher pad/seat, leg pads, curl arm).",
    heroImage: '/src/assets/products/isolator-3x3_-1.jpg',
    // Padded onto a larger off-white canvas with real margin so it can bleed
    // into the "Shop by Platform" section background without a visible seam.
    homeImage: '/src/assets/products/isolator-3x3_-1-padded.png',
  },
  {
    id: 'vts',
    name: 'VTS / VTS Lite',
    tagline: 'Versa Trolley System — turns your rack into a Smith-machine-style trainer.',
    // "VTS" = Versa Trolley System, not "Vertical" — confirmed by their real
    // product copy on VTS Rack Attachment / VTS Lite Rack Attachment.
    description:
      'The VTS (Versa Trolley System) converts a squat rack or rig into a Smith-machine-style trainer using your own barbell, with a hex port system for attachments. VTS has rollers on all four sides of the upright for the widest range of movements; VTS Lite is the lighter-duty, single-side-roller variant — compatibility differs between the two, so check each accessory before buying.',
    heroImage: '/src/assets/products/vts-starter-1.png',
    homeImage: '/src/assets/products/vts-starter-1-padded.png',
    // VTS is a "hub" platform on Home/nav — one tile/link — but forks into two
    // distinct sub-platforms for compatibility purposes, since not every
    // accessory fits both. Product relationships reference subPlatformIds
    // ('vts-full' / 'vts-lite'), never the hub id 'vts', directly.
    // Rule of thumb (from the business, not their site copy): full-spanning
    // accessories that clamp both trolleys fit both VTS and VTS Lite; isolated/
    // single-side accessories (most handles) are VTS-only, since VTS Lite
    // trolleys can't accept single-side handles.
    subPlatformIds: ['vts-full', 'vts-lite'],
    isHub: true,
  },
  {
    id: 'vts-full',
    name: 'VTS',
    tagline: 'Rollers on all four sides of the upright — the full-duty configuration.',
    description:
      'The full-duty VTS configuration: rollers on all four sides of the rack upright, for the widest range of movements and attachment compatibility (including single-side/isolated handles).',
    heroImage: '/src/assets/products/vts-starter-1.png',
    homeImage: '/src/assets/products/vts-starter-1-padded.png',
    parentPlatformId: 'vts',
    hiddenFromNav: true,
  },
  {
    id: 'vts-lite',
    name: 'VTS Lite',
    tagline: 'The lighter-duty, more affordable Versa Trolley System.',
    description:
      "The lighter-duty VTS configuration — same squat-rack-to-Smith-machine conversion at lower cost. Trolleys can't accept single-side/isolated handles, so compatibility with some accessories differs from full VTS.",
    heroImage: '/src/assets/products/vts-starter-1.png',
    homeImage: '/src/assets/products/vts-starter-1-padded.png',
    parentPlatformId: 'vts',
    hiddenFromNav: true,
  },
  {
    id: 'solo-stand',
    name: 'Solo Stand',
    tagline: 'A compact, foldable stand for running the ISOLATOR without a squat rack.',
    description:
      "A compact, foldable, single-post alternative to the Tri-Post Rack for running the ISOLATOR standalone — smaller and more affordable, fits in a corner of a garage.",
    heroImage: '/src/assets/products/the-solo-stand-1.png',
    homeImage: '/src/assets/products/the-solo-stand-1-padded.png',
  },
  {
    id: 'standalone',
    name: 'Standalone Machines',
    tagline: 'Purpose-built machines: Direct Flight, VBS Belt Squat.',
    description:
      'Dedicated machines built for a specific movement pattern rather than a modular attachment ecosystem — Direct Flight (rack-attached multi-flight) and the VBS Vertical Belt Squat System.',
    heroImage: '/src/assets/products/direct-flight-1.png',
    homeImage: '/src/assets/products/direct-flight-1-padded.png',
  },
]

export const platforms = rawPlatforms.map((p) => ({
  ...p,
  heroImage: productAsset(p.heroImage),
  homeImage: productAsset(p.homeImage),
}))

export function getPlatform(id) {
  return platforms.find((p) => p.id === id)
}

// Platforms shown as their own tile/link on Home and in primary nav.
export function getNavPlatforms() {
  return platforms.filter((p) => !p.hiddenFromNav)
}

// Walks a platform id up through parentPlatformId until it reaches a
// nav-visible platform — e.g. 'vts-full' (a hidden sub-platform) resolves to
// the 'vts' hub. Used to infer a package's platformId from its base unit's
// single relationship, so Admin doesn't need a separate platform picker for
// the common case. Returns null if the id doesn't resolve to anything (bad
// data) rather than guessing.
export function resolveToNavPlatform(platformId) {
  let current = getPlatform(platformId)
  while (current && current.hiddenFromNav) {
    current = current.parentPlatformId ? getPlatform(current.parentPlatformId) : null
  }
  return current || null
}
