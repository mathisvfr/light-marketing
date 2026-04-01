export default function LibraryPanel({ recentItems, savedItems, onOpenItem, onToggleSave }) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <LibrarySection
        title="Recent outputs"
        eyebrow="History"
        items={recentItems}
        emptyText="New drafts will appear here after generation."
        onOpenItem={onOpenItem}
        onToggleSave={onToggleSave}
      />
      <LibrarySection
        title="Saved outputs"
        eyebrow="Library"
        items={savedItems}
        emptyText="Use Save on a draft you want to keep for the client meeting."
        onOpenItem={onOpenItem}
        onToggleSave={onToggleSave}
      />
    </div>
  )
}

function LibrarySection({ title, eyebrow, items, emptyText, onOpenItem, onToggleSave }) {
  return (
    <section className="rounded-4xl border border-slate-200 bg-white p-5 shadow-[0_18px_42px_-36px_rgba(15,23,42,0.35)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{eyebrow}</p>
      <div className="mt-2 flex items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">{items.length}</span>
      </div>

      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-400">
            {emptyText}
          </div>
        ) : (
          items.map((item) => (
            <article key={item.id} className="rounded-3xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                    {item.workflowTitle}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-slate-900">{item.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleSave(item)}
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    item.saved ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {item.saved ? 'Saved' : 'Save'}
                </button>
              </div>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">{item.preview}</p>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                <span>{formatTimestamp(item.createdAt)}</span>
                <button
                  type="button"
                  onClick={() => onOpenItem(item)}
                  className="font-medium text-blue-700 hover:text-blue-900"
                >
                  Open in workspace
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  )
}

function formatTimestamp(value) {
  return new Date(value).toLocaleString([], {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
