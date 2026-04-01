export default function SkillSelector({ skills, activeSkillId, onSkillChange }) {
  return (
    <div className="pt-4">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {skills.map((skill) => {
          const isActive = skill.id === activeSkillId
          return (
            <button
              key={skill.id}
              onClick={() => onSkillChange(skill.id)}
              title={skill.description}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              <span>{skill.icon}</span>
              <span>{skill.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
