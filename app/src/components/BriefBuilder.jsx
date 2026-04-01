const AUDIENCE_OPTIONS = ['Job seekers', 'Employers', 'Mixed audience']
const CHANNEL_OPTIONS = ['LinkedIn', 'Email', 'Website', 'Instagram', 'Facebook', 'Multi-channel']
const LANGUAGE_OPTIONS = ['Dutch', 'English', 'Dutch + English']

export default function BriefBuilder({
  workflow,
  values,
  onChange,
  onGenerate,
  isLoading,
  isLocked,
  canGenerate,
  missingRequiredFields,
}) {
  return (
    <section className="rounded-4xl border border-slate-200 bg-white p-5 shadow-[0_22px_50px_-38px_rgba(15,23,42,0.42)] xl:sticky xl:top-24">
      {isLocked ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Finish Step 1 first: confirm your task selection to unlock this brief.
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Step 2
          </p>
          <h2 className="mt-1 text-xl font-semibold text-slate-900">Fill in the brief</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Keep this short. The goal is to give the model just enough context to produce a usable first draft.
          </p>
        </div>
        <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl md:flex">
          {workflow.icon}
        </div>
      </div>

      <fieldset disabled={isLocked} className="contents">
        <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Current workflow</p>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xl shadow-sm">
            {workflow.icon}
          </div>
          <div>
            <p className="text-base font-semibold text-slate-900">{workflow.title}</p>
            <p className="text-sm leading-6 text-slate-500">{workflow.summary}</p>
          </div>
        </div>
        </div>

        <div className="mt-5 space-y-4 rounded-3xl border border-slate-200 bg-white p-4 disabled:opacity-60">
          <SegmentedField
            label="Audience"
            value={values.audience || workflow.audience}
            options={AUDIENCE_OPTIONS}
            onChange={(value) => onChange('audience', value)}
          />
          <SegmentedField
            label="Channel"
            value={values.channel || workflow.channel}
            options={CHANNEL_OPTIONS}
            onChange={(value) => onChange('channel', value)}
          />
          <SegmentedField
            label="Language"
            value={values.language || workflow.language}
            options={LANGUAGE_OPTIONS}
            onChange={(value) => onChange('language', value)}
          />
        </div>

        <div className="mt-5 space-y-3">
          {workflow.fields.map((field) => (
            <FieldControl key={field.name} field={field} value={values[field.name] || ''} onChange={onChange} />
          ))}
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">
            {missingRequiredFields.length > 0
              ? `Add ${missingRequiredFields.length} required field${missingRequiredFields.length > 1 ? 's' : ''} to continue.`
              : 'Brief complete. You can now generate the first draft and unlock Step 3.'}
          </p>
          <button
            type="button"
            onClick={onGenerate}
            disabled={isLoading || !canGenerate || isLocked}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLoading ? <Spinner /> : <RocketIcon />}
            {isLoading ? 'Generating draft…' : 'Generate first draft'}
          </button>
        </div>
      </fieldset>
    </section>
  )
}

function SegmentedField({ label, value, options, onChange }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = option === value
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-full border px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'border-blue-500 bg-blue-50 text-blue-800'
                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function FieldControl({ field, value, onChange }) {
  const multilineFields = new Set([
    'whyApply',
    'callToAction',
    'sourceNotes',
    'constraints',
    'themes',
    'sections',
    'currentIssue',
    'personalization',
    'proof',
  ])
  const isMultiline = multilineFields.has(field.name)

  return (
    <label className="block rounded-3xl border border-slate-200 bg-slate-50/70 px-4 py-3 transition hover:border-slate-300 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {field.label}
        {field.required ? <span className="text-rose-500"> *</span> : null}
      </span>

      {isMultiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(event) => onChange(field.name, event.target.value)}
          placeholder={field.placeholder}
          className="min-h-24 w-full resize-y bg-transparent text-sm leading-6 text-slate-900 placeholder:text-slate-400 outline-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(field.name, event.target.value)}
          placeholder={field.placeholder}
          className="w-full bg-transparent text-sm leading-6 text-slate-900 placeholder:text-slate-400 outline-none"
        />
      )}
    </label>
  )
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

function RocketIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 15l4-4m0 0l5-5a3.536 3.536 0 015 5l-5 5m-5-5l5 5m-5-5L7 17l-2 5 5-2 1-3"
      />
    </svg>
  )
}
