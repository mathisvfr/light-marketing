export default function Header({ displayName, onLogout, activeWorkflow }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-slate-50/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-950 shadow-[0_16px_40px_-22px_rgba(15,23,42,0.95)]">
            <span className="text-base font-bold tracking-tight text-white">L</span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-slate-900">
                Light Marketing Studio
              </span>
              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">
                Internal beta
              </span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span>Light Personeelsdiensten B.V.</span>
              {activeWorkflow ? (
                <>
                  <span className="text-slate-300">•</span>
                  <span>
                    {activeWorkflow.icon} {activeWorkflow.title}
                  </span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden rounded-2xl border border-slate-200 bg-white px-3 py-2 md:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Active mode
            </p>
            <p className="mt-1 text-sm font-medium text-slate-700">Workflow-first drafting</p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <span className="text-xs font-semibold text-blue-800">
                {displayName?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs text-slate-400">Signed in as</p>
              <p className="text-sm font-medium text-slate-700">{displayName}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
