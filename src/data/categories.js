// Accessory-type categories that cut across platforms (as opposed to platforms.js,
// which are the core machines). A product's `category` field on products.js
// links it here; compatibility badges read each product's `relationships` array
// (see relationshipTypes.js).
export const categories = [
  {
    id: 'handles',
    name: 'Handles',
    tagline: 'Grips for every pull, press, and curl.',
    homeImage: '/src/assets/products/handles-category-padded.png',
  },
  {
    id: 'barbells',
    name: 'Barbells',
    tagline: 'Purpose-built bars that deliver.',
    homeImage: '/src/assets/products/barbells-category-padded.png',
  },
]

export function getCategory(id) {
  return categories.find((c) => c.id === id)
}
