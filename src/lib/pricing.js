// A product's top-level `price` is its lowest variant's price — the number
// shown on cards/listings before a specific variant is picked. These
// helpers make that "starting price" framing explicit rather than letting
// call sites read product.price directly and imply a single fixed price.

// True when a product's variants actually differ in price (a plain
// single-variant product, or one where every size costs the same, doesn't
// need "From" framing — it's just the price).
export function hasVariantPriceRange(product) {
  const prices = (product.variants || []).map((v) => v.price)
  return new Set(prices).size > 1
}

// Formatted price string for a card/listing context — prefixes "From " only
// when the product's variants genuinely differ in price.
export function displayPrice(product) {
  const amount = product.price.toFixed(0)
  return hasVariantPriceRange(product) ? `From $${amount}` : `$${amount}`
}

// A variant can carry its own `images` (e.g. different post sizes are
// visually distinct products); falls back to the product's own images when
// a variant doesn't specify its own.
export function resolveVariantImages(product, variantIndex) {
  const variant = product.variants?.[variantIndex]
  return variant?.images?.length ? variant.images : product.images
}
