function applyInlineFormatting(text, baseKey) {
  const parts = text.split(/(\*\*[^*]+?\*\*|\*[^*]+?\*|`[^`]+?`)/g)

  return parts.map((part, index) => {
    const key = `${baseKey}-${index}`

    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={key} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      )
    }

    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>
    }

    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code key={key} className="rounded bg-slate-100 px-1 py-0.5 text-xs text-slate-700">
          {part.slice(1, -1)}
        </code>
      )
    }

    return part
  })
}

export default function RichTextContent({ text, size = 'default' }) {
  const lines = text.split('\n')
  const elements = []
  const bodyClass = size === 'large' ? 'text-[15px] leading-7' : 'text-sm leading-6'

  for (let index = 0; index < lines.length; index += 1) {
    const key = `line-${index}`
    const line = lines[index]

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key} className="mt-4 text-sm font-semibold text-slate-900">
          {applyInlineFormatting(line.slice(4), key)}
        </h3>,
      )
      continue
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key} className="mt-5 text-base font-semibold text-slate-900">
          {applyInlineFormatting(line.slice(3), key)}
        </h2>,
      )
      continue
    }

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key} className="mt-5 text-lg font-semibold text-slate-900">
          {applyInlineFormatting(line.slice(2), key)}
        </h1>,
      )
      continue
    }

    if (/^[-*] /.test(line)) {
      elements.push(
        <li key={key} className={`ml-5 list-disc text-slate-700 ${bodyClass}`}>
          {applyInlineFormatting(line.slice(2), key)}
        </li>,
      )
      continue
    }

    if (/^\d+\. /.test(line)) {
      elements.push(
        <li key={key} className={`ml-5 list-decimal text-slate-700 ${bodyClass}`}>
          {applyInlineFormatting(line.replace(/^\d+\. /, ''), key)}
        </li>,
      )
      continue
    }

    if (!line.trim()) {
      elements.push(<div key={key} className="h-2" />)
      continue
    }

    elements.push(
      <p key={key} className={`${bodyClass} text-slate-700`}>
        {applyInlineFormatting(line, key)}
      </p>,
    )
  }

  return <div className="space-y-0.5">{elements}</div>
}
