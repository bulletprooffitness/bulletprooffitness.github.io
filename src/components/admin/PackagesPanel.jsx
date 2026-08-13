import { useMemo, useState } from 'react'
import { getProducts } from '../../data/products'
import { getPackages, resolvePackage } from '../../data/packages'
import {
  createPackage,
  updatePackage,
  deletePackage,
  getAllPackageOverrides,
  clearAllPackageOverrides,
} from '../../lib/packagesStore'
import { platforms, resolveToNavPlatform } from '../../data/platforms'
import { displayPrice } from '../../lib/pricing'
import ConfirmModal from './ConfirmModal'

const PACKAGE_PLATFORMS = platforms.filter((p) => !p.hiddenFromNav)
const BASE_UNIT_PRODUCTS_FILTER = (p) => p.role === 'platform'

function emptyDraft() {
  return {
    id: '',
    platformId: '',
    name: '',
    description: '',
    baseUnitHandle: '',
    accessoryHandles: [],
    price: '',
  }
}

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// A base unit's platform is inferred from its single relationship, resolved
// up to the nearest nav-visible platform (e.g. VTS Starter's relationship
// is 'vts-full', which resolves to the 'vts' hub). Returns null when there's
// no exactly-one-relationship to infer from — that's the only case the form
// falls back to a manual platform picker for.
function inferPlatformId(baseUnit) {
  const rels = baseUnit?.relationships || []
  if (rels.length !== 1) return null
  return resolveToNavPlatform(rels[0].platformId)?.id || null
}

function PackageForm({ initial, products, onSave, onCancel }) {
  const [draft, setDraft] = useState(initial)

  const baseUnitProducts = products.filter(BASE_UNIT_PRODUCTS_FILTER)
  const selectedBaseUnit = products.find((p) => p.handle === draft.baseUnitHandle) || null
  const inferredPlatformId = selectedBaseUnit ? inferPlatformId(selectedBaseUnit) : null
  const needsManualPlatform = Boolean(selectedBaseUnit) && !inferredPlatformId
  const effectivePlatformId = inferredPlatformId || draft.platformId
  const effectivePlatform = PACKAGE_PLATFORMS.find((pl) => pl.id === effectivePlatformId)

  const platformIds = effectivePlatform
    ? [effectivePlatform.id, ...(effectivePlatform.subPlatformIds || [])]
    : []
  const accessoryOptions = products.filter(
    (p) => p.role !== 'platform' && p.relationships?.some((r) => platformIds.includes(r.platformId))
  )

  // Live subtotal/discount preview — recomputed on every render, so it
  // updates as soon as the base unit, accessories, or price change. Uses
  // the base unit's default (lowest) variant price, matching how
  // resolvePackage() prices a package before a customer picks a variant.
  const selectedAccessories = accessoryOptions.filter((p) => draft.accessoryHandles.includes(p.handle))
  const baseUnitPrice = selectedBaseUnit ? selectedBaseUnit.variants?.[0]?.price ?? selectedBaseUnit.price : 0
  const subtotal = selectedBaseUnit ? baseUnitPrice + selectedAccessories.reduce((sum, p) => sum + p.price, 0) : 0
  const enteredPrice = parseFloat(draft.price)
  const hasValidPrice = selectedBaseUnit && !Number.isNaN(enteredPrice)
  const discountAmount = hasValidPrice ? Math.max(0, subtotal - enteredPrice) : 0
  const discountPercent = hasValidPrice && subtotal > 0 ? (discountAmount / subtotal) * 100 : 0

  function handleSelectBaseUnit(handle) {
    const baseUnit = products.find((p) => p.handle === handle) || null
    const inferred = baseUnit ? inferPlatformId(baseUnit) : null
    setDraft((d) => ({
      ...d,
      baseUnitHandle: handle,
      platformId: inferred || '',
      // Base unit changed — the accessory list is scoped to the new
      // platform, so previously-checked accessories may no longer apply.
      accessoryHandles: [],
    }))
  }

  function toggleAccessory(handle) {
    setDraft((d) => ({
      ...d,
      accessoryHandles: d.accessoryHandles.includes(handle)
        ? d.accessoryHandles.filter((h) => h !== handle)
        : [...d.accessoryHandles, handle],
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!draft.name.trim() || !draft.baseUnitHandle || !draft.price) return
    if (!effectivePlatformId) return
    const id = draft.id || slugify(draft.name)
    onSave({ ...draft, id, platformId: effectivePlatformId, price: parseFloat(draft.price) })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-white/10 rounded-xl bg-neutral-950 p-5 space-y-4"
    >
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-white/40 block mb-2">
          Package Name
        </label>
        <input
          type="text"
          value={draft.name}
          onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
          placeholder="Isolator Starter Package"
          className="bg-black border border-white/20 rounded px-3 py-2 text-sm text-white w-full"
        />
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-white/40 block mb-2">
          Description
        </label>
        <textarea
          value={draft.description}
          onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
          placeholder="Short marketing copy shown on the platform page"
          rows={2}
          className="bg-black border border-white/20 rounded px-3 py-2 text-sm text-white w-full resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-widest text-white/40 block mb-2">
            Base Unit
          </label>
          <select
            value={draft.baseUnitHandle}
            onChange={(e) => handleSelectBaseUnit(e.target.value)}
            className="bg-black border border-white/20 rounded px-3 py-2 text-sm text-white w-full"
          >
            <option value="">— Select base unit —</option>
            {baseUnitProducts.map((p) => (
              <option key={p.handle} value={p.handle}>
                {p.title} · {displayPrice(p)}
              </option>
            ))}
          </select>
          {baseUnitProducts.length === 0 && (
            <p className="text-amber-400/70 text-xs mt-2">
              No products with role "platform" exist yet.
            </p>
          )}
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-widest text-white/40 block mb-2">
            Platform
          </label>
          {needsManualPlatform ? (
            <>
              <select
                value={draft.platformId}
                onChange={(e) => setDraft((d) => ({ ...d, platformId: e.target.value }))}
                className="bg-black border border-white/20 rounded px-3 py-2 text-sm text-white w-full"
              >
                <option value="">— Select platform —</option>
                {PACKAGE_PLATFORMS.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name}
                  </option>
                ))}
              </select>
              <p className="text-amber-400/70 text-xs mt-2">
                {selectedBaseUnit.relationships?.length === 0
                  ? "This base unit has no confirmed platform relationship yet — pick one manually, or confirm it in Admin › Compatibility first."
                  : 'This base unit is tagged to multiple platforms — pick which one this package belongs to.'}
              </p>
            </>
          ) : (
            <div className="bg-black border border-white/10 rounded px-3 py-2 text-sm text-white/70 w-full">
              {effectivePlatform ? effectivePlatform.name : '— Select a base unit first —'}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-white/40 block mb-2">
          Accessories ({draft.accessoryHandles.length} selected)
        </label>
        <div className="max-h-48 overflow-y-auto border border-white/10 rounded-lg divide-y divide-white/5">
          {accessoryOptions.map((p) => (
            <label
              key={p.handle}
              className="flex items-center gap-3 px-3 py-2 text-sm text-white/80 hover:bg-white/[0.03] cursor-pointer"
            >
              <input
                type="checkbox"
                checked={draft.accessoryHandles.includes(p.handle)}
                onChange={() => toggleAccessory(p.handle)}
                className="accent-red-600"
              />
              <span className="flex-1 flex-shrink-1">{p.title}</span>
              <span className="text-white/40 tabular-nums text-xs">{displayPrice(p)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-widest text-white/40 block mb-2">
            Package Price
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={draft.price}
            onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
            placeholder="1499.00"
            className="bg-black border border-white/20 rounded px-3 py-2 text-sm text-white w-full"
          />
          <p className="text-white/30 text-xs mt-2 leading-relaxed flex-shrink-1">
            Set the price equal to (or above) the subtotal to show no savings badge.
          </p>
        </div>

        <div className="bg-black border border-white/10 rounded-lg px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/40">
              Subtotal {selectedBaseUnit ? `(1 base unit + ${selectedAccessories.length} accessor${selectedAccessories.length === 1 ? 'y' : 'ies'})` : ''}
            </span>
            <span className="text-white tabular-nums">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2 pt-2 border-t border-white/10">
            <span className="text-white/40">Discount</span>
            <span className={`tabular-nums ${discountAmount > 0 ? 'text-red-400' : 'text-white/50'}`}>
              {hasValidPrice
                ? `-$${discountAmount.toFixed(2)} (${discountPercent.toFixed(0)}%)`
                : '—'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="text-[11px] font-semibold uppercase tracking-widest bg-white text-black rounded-full px-5 py-2.5 hover:bg-white/90 transition"
        >
          Save Package
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[11px] font-semibold uppercase tracking-widest text-white/50 hover:text-white border border-white/15 rounded-full px-5 py-2.5 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

function PackageRow({ pkg, onEdit, onDelete }) {
  const resolved = resolvePackage(pkg)
  const platform = PACKAGE_PLATFORMS.find((p) => p.id === pkg.platformId)

  return (
    <div className="border border-white/10 rounded-xl bg-neutral-950 p-5 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <p className="text-white text-sm font-medium">{pkg.name}</p>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40 border border-white/15 rounded-full px-2 py-0.5">
            {platform?.name || pkg.platformId}
          </span>
        </div>
        <p className="text-white/40 text-xs mb-2">
          {resolved.baseUnit ? resolved.baseUnit.title : '⚠ missing base unit'} +{' '}
          {resolved.accessories.length} accessor{resolved.accessories.length === 1 ? 'y' : 'ies'}
        </p>
        <p className="text-white/60 text-sm tabular-nums">
          ${resolved.price.toFixed(0)}
          {resolved.savings > 0 && (
            <span className="text-white/30">
              {' '}
              (individual ${resolved.individualPrice.toFixed(0)}, save ${resolved.savings.toFixed(0)})
            </span>
          )}
        </p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={onEdit}
          className="text-[11px] font-semibold uppercase tracking-widest text-white/60 hover:text-white border border-white/15 rounded-full px-4 py-2 transition"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="text-[11px] font-semibold uppercase tracking-widest text-white/40 hover:text-red-400 border border-white/15 rounded-full px-4 py-2 transition"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default function PackagesPanel() {
  const [version, setVersion] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [confirmingReset, setConfirmingReset] = useState(false)

  const products = useMemo(() => getProducts(), [version])
  const allPackages = useMemo(() => getPackages(), [version])
  const overrideCount = useMemo(() => {
    const store = getAllPackageOverrides()
    return store.created.length + Object.keys(store.overrides).length
  }, [version])

  function refresh() {
    setVersion((v) => v + 1)
  }

  // Unlike Products' "Copy as Code" (which copies field-level patches to
  // merge into existing records), packages here are full new-or-edited
  // records — the useful export is each one as a ready-to-paste object
  // literal matching packages.js's own array shape, since a brand-new
  // package has no existing entry to patch against.
  function handleCopyCode() {
    const lines = allPackages.map((pkg) => {
      const { id, platformId, name, description, baseUnitHandle, accessoryHandles, price } = pkg
      const fields = [
        `    id: ${JSON.stringify(id)},`,
        `    platformId: ${JSON.stringify(platformId)},`,
        `    name: ${JSON.stringify(name)},`,
        `    description: ${JSON.stringify(description)},`,
        `    baseUnitHandle: ${JSON.stringify(baseUnitHandle)},`,
        `    accessoryHandles: ${JSON.stringify(accessoryHandles)},`,
        `    price: ${price},`,
      ].join('\n')
      return `  {\n${fields}\n  },`
    })
    const code =
      `// Packages from /admin — replace the \`packages\` array in src/data/packages.js\n` +
      `// with this (or merge in the entries that changed), then delete this comment.\n` +
      `export const packages = [\n${lines.join('\n')}\n]`
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleSave(draft) {
    const exists = allPackages.some((p) => p.id === draft.id)
    if (exists) {
      updatePackage(draft.id, draft)
    } else {
      createPackage(draft)
    }
    setEditingId(null)
    setCreating(false)
    refresh()
  }

  function handleDelete(id) {
    if (!confirm('Delete this package? This cannot be undone.')) return
    deletePackage(id)
    refresh()
  }

  function handleDownloadBackup() {
    const store = getAllPackageOverrides()
    const blob = new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const date = new Date().toISOString().slice(0, 10)
    link.href = url
    link.download = `bulletproof-package-edits-${date}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  function handleConfirmReset() {
    clearAllPackageOverrides()
    setEditingId(null)
    setCreating(false)
    setConfirmingReset(false)
    refresh()
  }

  const editingPackage = editingId ? allPackages.find((p) => p.id === editingId) : null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-white/50 text-sm max-w-2xl leading-relaxed flex-shrink-1">
          Packages bundle a base unit with accessories at one price. Savings are computed from
          live product prices, never entered by hand.
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleCopyCode}
            disabled={allPackages.length === 0}
            className="text-[11px] font-semibold uppercase tracking-widest text-white/70 hover:text-white border border-white/15 rounded-full px-5 py-2.5 disabled:opacity-30 disabled:cursor-not-allowed transition whitespace-nowrap"
          >
            {copied ? 'Copied!' : 'Copy as Code'}
          </button>
          <button
            onClick={() => setConfirmingReset(true)}
            disabled={overrideCount === 0}
            className="text-[11px] font-semibold uppercase tracking-widest text-white/50 hover:text-red-400 border border-white/15 rounded-full px-5 py-2.5 disabled:opacity-30 disabled:cursor-not-allowed transition whitespace-nowrap"
          >
            Clear Local Edits
          </button>
          {!creating && !editingId && (
            <button
              onClick={() => setCreating(true)}
              className="text-[11px] font-semibold uppercase tracking-widest bg-white text-black rounded-full px-5 py-2.5 hover:bg-white/90 transition whitespace-nowrap"
            >
              + New Package
            </button>
          )}
        </div>
      </div>

      {creating && (
        <PackageForm
          initial={emptyDraft()}
          products={products}
          onSave={handleSave}
          onCancel={() => setCreating(false)}
        />
      )}

      {editingPackage && (
        <PackageForm
          initial={{ ...editingPackage, price: String(editingPackage.price) }}
          products={products}
          onSave={handleSave}
          onCancel={() => setEditingId(null)}
        />
      )}

      <div className="space-y-3">
        {allPackages.length === 0 && !creating && (
          <p className="text-white/30 text-sm italic">No packages yet.</p>
        )}
        {allPackages.map((pkg) => (
          <PackageRow
            key={pkg.id}
            pkg={pkg}
            onEdit={() => setEditingId(pkg.id)}
            onDelete={() => handleDelete(pkg.id)}
          />
        ))}
      </div>

      {overrideCount > 0 && (
        <p className="text-white/30 text-xs">
          {overrideCount} package edit{overrideCount !== 1 ? 's' : ''} saved to this browser only
          (localStorage) — hand these off to the developer to add to src/data/packages.js
          permanently.
        </p>
      )}

      <ConfirmModal
        open={confirmingReset}
        title="Clear Local Edits?"
        description="This discards every package created or edited in this browser and restores the built-in defaults. This cannot be undone."
        confirmLabel="Clear Edits"
        onConfirm={handleConfirmReset}
        onCancel={() => setConfirmingReset(false)}
        onDownload={handleDownloadBackup}
        downloadLabel="Download Backup"
        downloadDescription="Downloads the edited data copy as a back up."
      />
    </div>
  )
}
