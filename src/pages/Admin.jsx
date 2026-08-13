import { useState, useMemo } from "react";
import { products as baseProducts } from "../data/products";
import { platforms } from "../data/platforms";
import { categories } from "../data/categories";
import {
  RELATIONSHIP_TYPES,
  RELATIONSHIP_TYPE_LIST,
} from "../data/relationshipTypes";
import {
  getAllOverrides,
  setOverride,
  clearAllOverrides,
  applyOverrides,
} from "../lib/adminStore";
import PackagesPanel from "../components/admin/PackagesPanel";

// All platforms a relationship can point to, including VTS sub-platforms —
// these are the only valid platformId values for a relationship entry.
const RELATIONSHIP_PLATFORMS = platforms.filter((p) => !p.isHub);

function ProductRow({ product, onChange }) {
  const [expanded, setExpanded] = useState(false);
  const relationships = product.relationships || [];

  function updateCategory(category) {
    onChange(product.handle, { category: category || undefined });
  }

  function addRelationship() {
    onChange(product.handle, {
      relationships: [
        ...relationships,
        { platformId: RELATIONSHIP_PLATFORMS[0]?.id, type: "fits", note: "" },
      ],
    });
  }

  function updateRelationship(index, patch) {
    const next = relationships.map((r, i) =>
      i === index ? { ...r, ...patch } : r,
    );
    onChange(product.handle, { relationships: next });
  }

  function removeRelationship(index) {
    onChange(product.handle, {
      relationships: relationships.filter((_, i) => i !== index),
    });
  }

  const fitsCount = relationships.filter((r) => r.type === "fits").length;
  const pairedCount = relationships.filter(
    (r) => r.type === "paired-with",
  ).length;

  return (
    <div className="border border-white/10 rounded-xl bg-neutral-950 overflow-hidden">
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition"
      >
        <img
          src={product.images?.[0]}
          alt=""
          className="w-12 h-12 object-cover rounded bg-neutral-900 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">
            {product.title}
          </p>
          <p className="text-white/40 text-xs mt-0.5">{product.handle}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {product.category && (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50 border border-white/15 rounded-full px-2 py-1">
              {product.category}
            </span>
          )}
          {relationships.length === 0 && product.role !== "apparel" ? (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-400/80 border border-amber-400/30 rounded-full px-2 py-1">
              Unverified
            </span>
          ) : product.role === "apparel" ? null : (
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50 border border-white/15 rounded-full px-2 py-1">
              {fitsCount} fits · {pairedCount} paired
            </span>
          )}
        </div>
        <span className="text-white/30 text-xs flex-shrink-0">
          {expanded ? "−" : "+"}
        </span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-white/10 space-y-5">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-widest text-white/40 block mb-2">
              Category
            </label>
            <select
              value={product.category || ""}
              onChange={(e) => updateCategory(e.target.value)}
              className="bg-black border border-white/20 rounded px-3 py-2 text-sm text-white w-full max-w-xs"
            >
              <option value="">— None —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                Platform Relationships
              </label>
              <button
                onClick={addRelationship}
                className="text-[11px] font-semibold uppercase tracking-widest text-white border-b border-white/30 hover:border-white transition"
              >
                + Add
              </button>
            </div>

            {relationships.length === 0 && (
              <p className="text-white/30 text-xs italic mb-3">
                No relationships set — this product shows as "Compatibility not
                yet confirmed."
              </p>
            )}

            <div className="space-y-3">
              {relationships.map((r, i) => (
                <div
                  key={i}
                  className="flex flex-wrap items-start gap-2 bg-black rounded-lg p-3 border border-white/10"
                >
                  <select
                    value={r.platformId}
                    onChange={(e) =>
                      updateRelationship(i, { platformId: e.target.value })
                    }
                    className="bg-neutral-900 border border-white/20 rounded px-2 py-1.5 text-sm text-white"
                  >
                    {RELATIONSHIP_PLATFORMS.map((pl) => (
                      <option key={pl.id} value={pl.id}>
                        {pl.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={r.type}
                    onChange={(e) =>
                      updateRelationship(i, { type: e.target.value })
                    }
                    className="bg-neutral-900 border border-white/20 rounded px-2 py-1.5 text-sm text-white"
                  >
                    {RELATIONSHIP_TYPE_LIST.map((t) => (
                      <option key={t} value={t}>
                        {RELATIONSHIP_TYPES[t].label}
                      </option>
                    ))}
                  </select>

                  <input
                    type="text"
                    value={r.note || ""}
                    onChange={(e) =>
                      updateRelationship(i, { note: e.target.value })
                    }
                    placeholder="Optional note (shown on product page)"
                    className="bg-neutral-900 border border-white/20 rounded px-2 py-1.5 text-sm text-white flex-1 min-w-[200px]"
                  />

                  <button
                    onClick={() => removeRelationship(i)}
                    className="text-white/40 hover:text-red-400 text-xs px-2 py-1.5 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const [tab, setTab] = useState("products");
  const [overridesVersion, setOverridesVersion] = useState(0);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState(false);

  const products = useMemo(
    () => applyOverrides(baseProducts),
    [overridesVersion],
  );

  const filtered = search
    ? products.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      )
    : products;

  function handleChange(handle, patch) {
    setOverride(handle, patch);
    setOverridesVersion((v) => v + 1);
  }

  function handleResetAll() {
    if (!confirm("Discard all admin edits? This cannot be undone.")) return;
    clearAllOverrides();
    setOverridesVersion((v) => v + 1);
  }

  function handleCopyCode() {
    const overrides = getAllOverrides();
    const lines = Object.entries(overrides).map(([handle, patch]) => {
      const fields = Object.entries(patch)
        .map(
          ([key, value]) =>
            `    ${key}: ${JSON.stringify(value, null, 2).replace(/\n/g, "\n    ")},`,
        )
        .join("\n");
      return `  '${handle}': {\n${fields}\n  },`;
    });
    const code =
      `// Corrections made in /admin — find each handle in src/data/products.js\n` +
      `// and merge these fields into that product object, then delete this block.\n` +
      `const corrections = {\n${lines.join("\n")}\n}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const overrideCount = Object.keys(getAllOverrides()).length;
  const unverifiedCount = products.filter(
    (p) => (p.relationships || []).length === 0 && p.role !== "apparel",
  ).length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-baseline justify-between mb-2 flex-wrap gap-3">
        <h1 className="font-display text-5xl text-white">Admin</h1>
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Internal tool — not part of the public site
        </span>
      </div>
      <p>
        <span className="text-amber-400 font-bold">Note:</span> This admin panel
        is currently in a beta/prototype state and demos the ability to allow you to directly manage product categories, platform
        compatibility, and packages. This interface is for internal use only and
        will never be accessible to customers.
      </p>
      <br />
      <p className="text-white/50 mb-6 max-w-2xl leading-relaxed">
        Correct product categories, platform compatibility, and packages here.
        Edits save to this browser only (localStorage) — nothing is published
        live.
      </p>

      <div className="flex gap-2 mb-8 border-b border-white/10">
        <button
          onClick={() => setTab("products")}
          className={`text-[11px] font-semibold uppercase tracking-widest px-4 py-3 border-b-2 transition ${
            tab === "products"
              ? "text-white border-white"
              : "text-white/40 border-transparent hover:text-white/70"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setTab("packages")}
          className={`text-[11px] font-semibold uppercase tracking-widest px-4 py-3 border-b-2 transition ${
            tab === "packages"
              ? "text-white border-white"
              : "text-white/40 border-transparent hover:text-white/70"
          }`}
        >
          Packages
        </button>
      </div>

      {tab === "products" && (
        <>
          {unverifiedCount > 0 && (
            <p className="text-amber-400/80 text-sm mb-8">
              {unverifiedCount} product{unverifiedCount !== 1 ? "s" : ""} still
              have unverified compatibility.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mb-8 sticky top-16 z-10 bg-black/95 backdrop-blur py-4 -mx-6 px-6 border-b border-white/10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="bg-neutral-950 border border-white/20 rounded px-4 py-2.5 text-sm text-white flex-1 min-w-[200px]"
            />
            <span className="text-white/40 text-xs whitespace-nowrap">
              {overrideCount} edited
            </span>
            <button
              onClick={handleCopyCode}
              disabled={overrideCount === 0}
              className="text-[11px] font-semibold uppercase tracking-widest bg-white text-black rounded-full px-5 py-2.5 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/90 transition whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy as Code"}
            </button>
            <button
              onClick={handleResetAll}
              disabled={overrideCount === 0}
              className="text-[11px] font-semibold uppercase tracking-widest text-white/50 hover:text-red-400 border border-white/15 rounded-full px-5 py-2.5 disabled:opacity-30 disabled:cursor-not-allowed transition whitespace-nowrap"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-3">
            {filtered.map((p) => (
              <ProductRow key={p.handle} product={p} onChange={handleChange} />
            ))}
          </div>
        </>
      )}

      {tab === "packages" && <PackagesPanel />}
    </div>
  );
}
