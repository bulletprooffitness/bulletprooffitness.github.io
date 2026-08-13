// Centered confirm dialog matching CartDrawer's overlay conventions
// (bg-black/60 backdrop, duration-300 fade, z-50) so admin-only dialogs
// still feel like part of the same site rather than a bolted-on browser
// confirm(). Generic enough to reuse for other destructive admin actions.
export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onDownload,
  downloadLabel = 'Download Backup',
  downloadDescription,
  onCancel,
}) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onCancel}
      />
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300 ${
          open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="w-full max-w-sm bg-neutral-950 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-6">
          <h2 className="font-display text-2xl text-white leading-none mb-3">{title}</h2>
          <p className="text-white/50 text-sm leading-relaxed flex-shrink-1 mb-6">{description}</p>

          {onDownload && (
            <button
              onClick={onDownload}
              className="w-full flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white border border-white/15 hover:border-white/30 rounded-full px-5 py-3 transition mb-2"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3v12" />
                <path d="M7 10l5 5 5-5" />
                <path d="M5 21h14" />
              </svg>
              {downloadLabel}
            </button>
          )}
          {onDownload && downloadDescription && (
            <p className="text-white/30 text-xs leading-relaxed flex-shrink-1 mb-5">
              {downloadDescription}
            </p>
          )}

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 text-[11px] font-semibold uppercase tracking-widest text-white/60 hover:text-white border border-white/15 rounded-full px-5 py-3 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 text-[11px] font-semibold uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 rounded-full px-5 py-3 transition"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
