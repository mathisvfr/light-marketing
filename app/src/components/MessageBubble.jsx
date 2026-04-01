import { useState } from 'react'
import RichTextContent from './RichTextContent'

/** Loading dots animation shown while streaming */
function LoadingDots() {
  return (
    <div className="flex gap-1 items-center py-1">
      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" />
    </div>
  )
}

export default function MessageBubble({ role, content }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API not available
    }
  }

  if (role === 'user') {
    return (
      <div className="mb-3 flex justify-end">
        <div className="max-w-[96%] wrap-break-word rounded-3xl rounded-tr-md bg-blue-900 px-4 py-3 text-sm leading-7 text-white shadow-[0_18px_35px_-25px_rgba(15,23,42,0.9)]">
          {content}
        </div>
      </div>
    )
  }

  // Assistant bubble
  return (
    <div className="group mb-3 flex justify-start">
      <div className="w-full max-w-full">
        <div className="w-full wrap-break-word rounded-3xl rounded-tl-md border border-slate-200 bg-white px-4 py-3 shadow-[0_18px_35px_-25px_rgba(15,23,42,0.45)] text-slate-700">
          {content ? (
            <RichTextContent text={content} />
          ) : (
            <LoadingDots />
          )}
        </div>

        {/* Copy button — visible on hover when content is ready */}
        {content && (
          <div className="flex items-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition px-1"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
