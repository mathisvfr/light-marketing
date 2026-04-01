export default function WorkflowGallery({ workflows, activeWorkflowId, onSelect }) {
  return (
    <section className="rounded-4xl border border-slate-200 bg-white p-4 shadow-[0_22px_50px_-38px_rgba(15,23,42,0.42)]">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Step 1
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">Choose the task</h2>
        </div>
        <p className="text-sm text-slate-500">Start with the job you want done, not with a blank prompt.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {workflows.map((workflow) => {
          const isActive = workflow.id === activeWorkflowId

          return (
            <button
              key={workflow.id}
              type="button"
              onClick={() => onSelect(workflow.id)}
              className={`group rounded-3xl border px-4 py-4 text-left transition-all ${
                isActive
                  ? 'border-blue-300 bg-blue-50 shadow-[0_18px_35px_-28px_rgba(37,99,235,0.35)]'
                  : 'border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${
                      isActive ? 'bg-blue-100 text-blue-800' : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {workflow.eyebrow}
                  </span>
                  <h3 className="mt-2 text-base font-semibold text-slate-900">{workflow.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">{workflow.summary}</p>
                </div>
                <span className="text-2xl" aria-hidden="true">
                  {workflow.icon}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <Chip active={isActive} label={workflow.audience} />
                <Chip active={isActive} label={workflow.channel} />
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function Chip({ active, label }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 ${
        active ? 'bg-white/10 text-blue-50' : 'bg-slate-100 text-slate-600'
      }`}
    >
      {label}
    </span>
  )
}
