import { useState, useCallback, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { streamChatMessage } from '../services/copilot.service'
import { detectLanguage } from '../utils/chatUtils'

/** Message shape: { id, role, content, createdAt, isStreaming } */

export function useStreamingChat(initialSessionId = null) {
  const [messages, setMessages] = useState([])
  const [sessionId, setSessionId] = useState(initialSessionId)
  const [sessionTitle, setSessionTitle] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(false)
  const queryClient = useQueryClient()

  /** Load an existing session's messages */
  const loadSession = useCallback((session) => {
    setSessionId(session.id)
    setSessionTitle(session.title)
    setMessages(
      (session.messages || []).map(m => ({
        id: m.id,
        role: m.role.toLowerCase(),
        content: m.content,
        createdAt: m.createdAt,
        isStreaming: false,
      }))
    )
  }, [])

  /** Clear chat for a new conversation */
  const newChat = useCallback(() => {
    setMessages([])
    setSessionId(null)
    setSessionTitle(null)
    setError(null)
  }, [])

  /** Send a message and stream the response */
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isStreaming) return

    const language = detectLanguage(text)
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
      isStreaming: false,
    }

    // Append user message immediately
    setMessages(prev => [...prev, userMessage])
    setIsStreaming(true)
    setError(null)
    abortRef.current = false

    // Add streaming placeholder for assistant
    const assistantId = `assistant-${Date.now()}`
    setMessages(prev => [...prev, {
      id: assistantId,
      role: 'assistant',
      content: '',
      createdAt: new Date().toISOString(),
      isStreaming: true,
    }])

    try {
      let newSessionId = sessionId

      for await (const event of streamChatMessage({ message: text, sessionId, language })) {
        if (abortRef.current) break

        if (event.type === 'start') {
          if (event.sessionId && !newSessionId) {
            newSessionId = event.sessionId
            setSessionId(event.sessionId)
          }
        } else if (event.type === 'token') {
          setMessages(prev => prev.map(m =>
            m.id === assistantId
              ? { ...m, content: m.content + event.content }
              : m
          ))
        } else if (event.type === 'done') {
          if (event.sessionId) {
            setSessionId(event.sessionId)
            if (event.sessionTitle) setSessionTitle(event.sessionTitle)
          }
          // Mark streaming complete
          setMessages(prev => prev.map(m =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          ))
          // Refresh session list
          queryClient.invalidateQueries({ queryKey: ['copilot', 'sessions'] })
        } else if (event.type === 'error') {
          setError(event.content)
          setMessages(prev => prev.map(m =>
            m.id === assistantId
              ? { ...m, content: event.content, isStreaming: false, isError: true }
              : m
          ))
        }
      }
    } catch (err) {
      const errMsg = err.message || 'Failed to connect to AI. Please check your connection.'
      setError(errMsg)
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, content: errMsg, isStreaming: false, isError: true }
          : m
      ))
    } finally {
      setIsStreaming(false)
      setMessages(prev => prev.map(m =>
        m.id === assistantId && m.isStreaming ? { ...m, isStreaming: false } : m
      ))
    }
  }, [sessionId, isStreaming, queryClient])

  const stopStreaming = useCallback(() => {
    abortRef.current = true
    setIsStreaming(false)
  }, [])

  return {
    messages,
    sessionId,
    sessionTitle,
    isStreaming,
    error,
    sendMessage,
    loadSession,
    newChat,
    stopStreaming,
  }
}
