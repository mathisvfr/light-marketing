import { useState, useCallback, useEffect } from 'react'
import { SKILLS } from '../config/skills'

const MODEL = 'claude-sonnet-4-20250514'
const API_URL = 'https://api.anthropic.com/v1/messages'

/**
 * Chat hook — manages message history and streaming API calls to Anthropic.
 * Resets automatically when activeSkillId changes.
 */
export function useChat(activeSkillId, options = {}) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { onAssistantComplete } = options

  // Clear conversation when the active skill changes
  useEffect(() => {
    setMessages([])
    setError(null)
  }, [activeSkillId])

  const sendMessage = useCallback(
    async (text, meta = {}) => {
      const trimmed = text?.trim()
      if (!trimmed || isLoading) return

      const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
      if (!apiKey || apiKey === 'sk-ant-your-key-here') {
        setError(
          'Anthropic API key not configured. Copy .env.example to .env.local and add your key.',
        )
        return
      }

      const skill = SKILLS.find((s) => s.id === activeSkillId) ?? SKILLS[0]
      const userMessage = { role: 'user', content: trimmed }
      const history = [...messages, userMessage]

      // Optimistically add user message + empty assistant placeholder
      setMessages([...history, { role: 'assistant', content: '' }])
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            // Required header for direct browser usage
            'anthropic-dangerous-allow-browser': 'true',
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: 2048,
            stream: true,
            system: skill.systemPrompt,
            messages: history,
          }),
        })

        if (!response.ok) {
          let msg = `API error ${response.status}`
          try {
            const body = await response.json()
            msg = body?.error?.message ?? msg
          } catch {
            /* ignore */
          }
          throw new Error(msg)
        }

        // Stream the response via SSE
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulated = ''
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          // Keep last (possibly incomplete) line in the buffer
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            try {
              const event = JSON.parse(data)
              if (
                event.type === 'content_block_delta' &&
                event.delta?.type === 'text_delta'
              ) {
                accumulated += event.delta.text
                // Update the last (assistant) message in-place while streaming
                setMessages((prev) => {
                  const updated = [...prev]
                  updated[updated.length - 1] = {
                    role: 'assistant',
                    content: accumulated,
                  }
                  return updated
                })
              }
            } catch {
              // Ignore SSE parse errors (pings, partial lines, etc.)
            }
          }
        }

        onAssistantComplete?.({
          content: accumulated,
          requestMeta: meta,
          skillId: activeSkillId,
        })
      } catch (err) {
        setError(err.message)
        // Remove the empty assistant placeholder on error
        setMessages((prev) => {
          const last = prev[prev.length - 1]
          return last?.role === 'assistant' && !last.content ? prev.slice(0, -1) : prev
        })
      } finally {
        setIsLoading(false)
      }
    },
    [messages, isLoading, activeSkillId],
  )

  const clearConversation = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  const loadConversation = useCallback((nextMessages) => {
    setMessages(nextMessages)
    setError(null)
  }, [])

  return { messages, isLoading, error, sendMessage, clearConversation, loadConversation }
}
