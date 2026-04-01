import { QUICK_ACTIONS } from '../config/quickActions'

export default function QuickActions({ onSelect }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Quick Actions
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            onClick={() => onSelect(action.prompt)}
            className="text-left px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-800 transition-all"
          >
            <span className="mr-1.5">{action.icon}</span>
            <span className="font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
