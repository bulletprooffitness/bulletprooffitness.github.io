// products.js / platforms.js / categories.js / OurStory.jsx historically
// referenced product and brand images as raw string paths like
// '/src/assets/products/foo.jpg'. That works in dev (Vite serves the whole
// project tree) but silently breaks in production: Vite only bundles an
// asset it sees imported somewhere, so a string that's never `import`ed
// never makes it into dist/assets, and the built site 404s on every image.
//
// import.meta.glob eagerly imports every file in both folders at build
// time, producing real hashed URLs — this map exists so the data files can
// keep passing around plain filenames without every one of them needing its
// own hand-written import statement.
const productModules = import.meta.glob('../assets/products/*', { eager: true, query: '?url', import: 'default' })
const brandModules = import.meta.glob('../assets/brand/*', { eager: true, query: '?url', import: 'default' })

function buildLookup(modules) {
  const lookup = {}
  for (const [path, url] of Object.entries(modules)) {
    const filename = path.split('/').pop()
    lookup[filename] = url
  }
  return lookup
}

const productAssets = buildLookup(productModules)
const brandAssets = buildLookup(brandModules)

// Accepts either a bare filename ('foo.jpg') or a legacy full path
// ('/src/assets/products/foo.jpg') and resolves it to the real built URL.
export function productAsset(filenameOrPath) {
  const filename = filenameOrPath.split('/').pop()
  const url = productAssets[filename]
  if (!url) {
    throw new Error(`productAsset: no file named "${filename}" in src/assets/products`)
  }
  return url
}

export function brandAsset(filenameOrPath) {
  const filename = filenameOrPath.split('/').pop()
  const url = brandAssets[filename]
  if (!url) {
    throw new Error(`brandAsset: no file named "${filename}" in src/assets/brand`)
  }
  return url
}
