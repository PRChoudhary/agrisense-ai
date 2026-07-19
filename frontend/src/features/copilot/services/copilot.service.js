import api from '../../../services/api'

/** Get all chat sessions for current user */
export const fetchSessions = async () => {
  const response = await api.get('/copilot/sessions')
  return response.data
}

/** Get a single session with messages */
export const fetchSession = async (sessionId) => {
  const response = await api.get(`/copilot/sessions/${sessionId}`)
  return response.data
}

/** Create a new session */
export const createSession = async (title, language = 'EN') => {
  const response = await api.post('/copilot/sessions', { title, language })
  return response.data
}

/** Delete a session */
export const deleteSession = async (sessionId) => {
  const response = await api.delete(`/copilot/sessions/${sessionId}`)
  return response.data
}

/** Update session title */
export const updateSessionTitle = async (sessionId, title) => {
  const response = await api.patch(`/copilot/sessions/${sessionId}`, { title })
  return response.data
}

/**
 * Stream a chat message via SSE fetch
 * Returns an AsyncGenerator that yields SSE events
 * @param {{ message: string, sessionId?: string, language?: string }} params
 */
export const streamChatMessage = async function* ({ message, sessionId, language = 'EN' }) {
  const token = localStorage.getItem('agrisense_token')
  const baseUrl = import.meta.env.VITE_API_URL || '/api/v1'

  const response = await fetch(`${baseUrl}/copilot/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, sessionId, language }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() // Keep incomplete line in buffer

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6))
          yield data
        } catch (e) {
          // Skip malformed events
        }
      }
    }
  }
}
