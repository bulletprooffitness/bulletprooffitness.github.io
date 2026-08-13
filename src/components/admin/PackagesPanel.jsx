import { useMemo, useState } from 'react'
import { getProducts } from '../../data/products'
import { getPackages, resolvePackage } from '../../data/packages'
import {
  createPackage,
  updatePackage,
  deletePackage,
  getAllPackageOverrides,
} from '../../lib/packagesStore'
import { platforms } from '../../data/platforms'

const PACKAGE_PLATFORMS = platforms.filter((p) => !p.hiddenFromNav)

function emptyDraft() {
  return {
    id: '',
    platformId: PACKAGE_PLATFORMS[0]?.id || '',
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

function PackageForm({ initial, products, onSave, onCancel }) {
  const [draft, setDraft] = useState(initial)

  const selectedPlatform = PACKAGE_PLATFORMS.find((pl) => pl.id === draft.platformId)
  const platformIds = selectedPlatform
    ? [selectedPlatform.id, ...(selectedPlatform.subPlatformIds || [])]
    : []
  const baseUnitOptions = products.filter(
    (p) => p.role === 'platform' && p.relationships?.some((r) => platformIds.includes(r.platformId))
  )
  const accessoryOptions = products.filter(
    (p) => p.role !== 'platform' && p.relationships?.some((r) => platformIds.includes(r.platformId))
  )

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
    const id = draft.id || slugify(draft.name)
    onSave({ ...draft, id, price: parseFloat(draft.price) })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-white/10 rounded-xl bg-neutral-950 p-5 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            Platform
          </label>
          <select
            value={draft.platformId}
            onChange={(e) => setDraft((d) => ({ ...d, platformId: e.target.value, baseUnitHandle: '' }))}
            className="bg-black border border-white/20 rounded px-3 py-2 text-sm text-white w-full"
          >
            {PACKAGE_PLATFORMS.map((pl) => (
              <option key={pl.id} value={pl.id}>
                {pl.name}
              </option>
            ))}
          </select>
        </div>
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

      <div>
        <label className="text-[11px] font-semibold uppercase tracking-widest text-white/40 block mb-2">
          Base Unit
        </label>
        <select
          value={draft.baseUnitHandle}
          onChange={(e) => setDraft((d) => ({ ...d, baseUnitHandle: e.target.value }))}
          className="bg-black border border-white/20 rounded px-3 py-2 text-sm text-white w-full max-w-md"
        >
          <option value="">— Select base unit —</option>
          {baseUnitOptions.map((p) => (
            <option key={p.handle} value={p.handle}>
              {p.title} · ${p.price.toFixed(0)}
            </option>
          ))}
        </select>
        {baseUnitOptions.length === 0 && (
          <p className="text-amber-400/70 text-xs mt-2">
            No products with role "platform" are tagged to this platform yet.
          </p>
        )}
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
              <span className="text-white/40 tabular-nums text-xs">${p.price.toFixed(0)}</span>
            </label>
          ))}
        </div>
      </div>

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
          className="bg-black border border-white/20 rounded px-3 py-2 text-sm text-white w-full max-w-xs"
        />
        <p className="text-white/30 text-xs mt-2 leading-relaxed flex-shrink-1">
          Savings are calculated automatically from the base unit + accessory prices above. Set
          the price equal to (or above) their total to show no savings badge.
        </p>
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
          ${pkg.price.toFixed(0)}
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

  const products = useMemo(() => getProducts(), [version])
  const allPackages = useMemo(() => getPackages(), [version])
  const overrideCount = useMemo(() => {
    const store = getAllPackageOverrides()
    return store.created.length + Object.keys(store.overrides).length
  }, [version])

  function refresh() {
    setVersion((v) => v + 1)
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

  const editingPackage = editingId ? allPackages.find((p) => p.id === editingId) : null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-white/50 text-sm max-w-2xl leading-relaxed flex-shrink-1">
          Packages bundle a base unit with accessories at one price. Savings are computed from
          live product prices, never entered by hand.
        </p>
        {!creating && !editingId && (
          <button
            onClick={() => setCreating(true)}
            className="text-[11px] font-semibold uppercase tracking-widest bg-white text-black rounded-full px-5 py-2.5 hover:bg-white/90 transition whitespace-nowrap"
          >
            + New Package
          </button>
        )}
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
    </div>
  )
}
