// Relationship types between a product and a platform. Extensible — add new
// types here (e.g. 'adapter-fit' once that's a real offering) without touching
// any component that renders them, since badge/label logic reads from this map.
export const RELATIONSHIP_TYPES = {
  fits: {
    label: 'Fits',
    badgeLabel: 'Also fits',
    description: 'Physically attaches to this platform (natively or via a standard adapter).',
    showsBadge: true,
  },
  'paired-with': {
    label: 'Commonly Paired With',
    badgeLabel: null,
    description:
      "Used alongside this platform (e.g. mounts to a rack or stand nearby) but doesn't attach to it directly.",
    showsBadge: false,
  },
}

export const RELATIONSHIP_TYPE_LIST = Object.keys(RELATIONSHIP_TYPES)
