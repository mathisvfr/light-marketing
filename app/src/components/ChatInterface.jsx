import { useEffect, useMemo, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'
import RichTextContent from './RichTextContent'
import { useChat } from '../hooks/useChat'
import { OUTPUT_ACTIONS } from '../config/workflows'

export default function ChatInterface({
  workflow,
  generationRequest,
  onRequestConsumed,
  importedItem,
  onImportedItemConsumed,
  onAssistantComplete,
  onSaveCurrent,
  isCurrentSaved,
  currentDocument,
  isLocked,
}) {
  const [inputText, setInputText] = useState('')
  const [copied, setCopied] = useState(false)
  const messagesEndRef = useRef(null)

  const { messages, isLoading, error, sendMessage, clearConversation, loadConversation } = useChat(
    workflow.skillId,
    {
      onAssistantComplete: ({ content, requestMeta, skillId }) => {
        onAssistantComplete?.({
          content,
          requestMeta,
          skillId,
          workflowId: workflow.id,
          workflowTitle: workflow.title,
        })
      },
    },
  )

  const latestAssistantMessage = useMemo(
    () => [...messages].reverse().find((message) => message.role === 'assistant' && message.content),
    [messages],
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!generationRequest) return
    sendMessage(generationRequest.prompt, generationRequest.meta)
    onRequestConsumed?.()
  }, [generationRequest, onRequestConsumed, sendMessage])

  useEffect(() => {
    if (!importedItem) return
    loadConversation([{ role: 'assistant', content: importedItem.content }])
    onImportedItemConsumed?.()
  }, [importedItem, loadConversation, onImportedItemConsumed])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = inputText.trim()
    if (!trimmed || isLoading) return

    sendMessage(trimmed, {
      title: `${workflow.title} follow-up`,
      persistRecent: false,
      source: 'manual-follow-up',
    })
    setInputText('')
  }

  const handleRefinement = (instruction) => {
    if (!latestAssistantMessage || isLoading) return

    sendMessage(
      `${instruction}\n\nUse the last assistant output as the source material. Preserve all relevant details unless improving them is necessary.`,
      {
        title: `${workflow.title} refinement`,
        persistRecent: false,
        source: 'refinement',
      },
    )
  }

  const handleCopy = async () => {
    if (!latestAssistantMessage?.content) return

    try {
      await navigator.clipboard.writeText(latestAssistantMessage.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard may be unavailable in some browser contexts.
    }
  }

  const handleSave = () => {
    if (!latestAssistantMessage?.content) return

    onSaveCurrent?.({
      title: currentDocument?.title || workflow.title,
      content: latestAssistantMessage.content,
      workflowId: workflow.id,
      workflowTitle: workflow.title,
      brief: currentDocument?.brief || null,
    })
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(event)
    }
  }

  return (
    <section className="overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_24px_60px_-35px_rgba(15,23,42,0.45)]">
      <div className="border-b border-slate-100 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_32%)] px-5 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Step 3
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">Review the draft</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Generate a first draft from the brief, then tighten it with one-click edits or a short follow-up note.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <ContextChip label={`Audience: ${currentDocument?.brief?.audience || workflow.audience}`} />
            <ContextChip label={`Channel: ${currentDocument?.brief?.channel || workflow.channel}`} />
            <ContextChip label={`Language: ${currentDocument?.brief?.language || workflow.language}`} />
          </div>
        </div>
      </div>

      {isLocked ? (
        <div className="p-5">
          <div className="rounded-4xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-200 text-3xl">
              🔒
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">Step 3 is locked</h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
              Complete Step 2 and click "Generate first draft" to unlock this workspace.
            </p>
          </div>
        </div>
      ) : (
      <div className="p-5">
        {latestAssistantMessage ? (
          <div className="rounded-4xl border border-slate-200 bg-slate-50/70 p-5">
            <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Latest draft
                </p>
                <h3 className="mt-1 text-lg font-semibold text-slate-900">
                  {currentDocument?.title || workflow.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <ActionButton onClick={handleCopy}>{copied ? 'Copied' : 'Copy draft'}</ActionButton>
                <ActionButton onClick={handleSave}>{isCurrentSaved ? 'Saved' : 'Save draft'}</ActionButton>
                <ActionButton onClick={clearConversation}>Clear workspace</ActionButton>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {OUTPUT_ACTIONS.map((action) => (
                <button
                  key={action.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleRefinement(action.instruction)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:text-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {action.label}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-3xl bg-white p-6 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.9)]">
              <RichTextContent text={latestAssistantMessage.content} size="large" />
            </div>
          </div>
        ) : (
          <EmptyWorkspace workflow={workflow} />
        )}

        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Conversation trail
            </p>
            <div className="mt-4 max-h-90 space-y-2 overflow-y-auto pr-1">
              {messages.length === 0 ? (
                <p className="text-sm leading-6 text-slate-400">
                  The conversation will appear here after you generate a first draft.
                </p>
              ) : (
                messages.map((message, index) => (
                  <MessageBubble key={`${message.role}-${index}`} role={message.role} content={message.content} />
                ))
              )}
              {error ? <ErrorBanner message={error} /> : null}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Refine manually
              </p>
              <span className="text-xs text-slate-300">Shift+Enter</span>
            </div>
            <textarea
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              onKeyDown={handleKeyDown}
              rows={5}
              disabled={isLoading}
              placeholder="Example: make this more direct for employers in logistics"
              className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-950 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isLoading ? <Spinner /> : <SendIcon />}
              {isLoading ? 'Sending…' : 'Send follow-up'}
            </button>
          </form>
        </div>
      </div>
      )}
    </section>
  )
}

function EmptyWorkspace({ workflow }) {
  return (
    <div className="rounded-4xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-100 text-3xl">
        {workflow.icon}
      </div>
      <h3 className="mt-5 text-xl font-semibold text-slate-900">Generate your first draft</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
        Fill in the guided brief on the left. This workspace is designed for quick drafting, review, and iteration during client meetings.
      </p>
    </div>
  )
}

function ContextChip({ label }) {
  return <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm">{label}</span>
}

function ActionButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
    >
      {children}
    </button>
  )
}

function ErrorBanner({ message }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
      {message}
    </div>
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

function SendIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  )
}
