'use client'

import { useState, useRef, useEffect } from 'react'
import MarkdownRenderer from './MarkdownRenderer'
import ResponseActions from './ResponseActions'

interface ChatMessage {
  id: string
  role: 'user' | 'coach'
  content: string
  timestamp: Date
}

interface FeedbackChatProps {
  element: string
  elementTitle: string
  originalText: string
  originalFeedback: string
  colorScheme: 'green' | 'purple'
}

export default function FeedbackChat({ 
  element, 
  elementTitle, 
  originalText, 
  originalFeedback,
  colorScheme 
}: FeedbackChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingResponse, setStreamingResponse] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const colors = {
    green: {
      bg: 'hl-lichtgroen-bg',
      border: 'hl-lichtgroen-border',
      text: 'hl-donkergroen-text',
      button: 'hl-donkergroen-bg',
      accent: 'hl-donkergroen-text'
    },
    purple: {
      bg: 'hl-zand-bg', 
      border: 'hl-zand-border',
      text: 'hl-donkerpaars-text',
      button: 'hl-donkerpaars-bg',
      accent: 'hl-donkerpaars-text'
    }
  }

  const color = colors[colorScheme]

  // Initialize chat with context when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const contextMessage: ChatMessage = {
        id: 'context-' + Date.now(),
        role: 'coach',
        content: `Hallo! Ik ben je AI-coach en ik heb zojuist feedback gegeven op je **${elementTitle}** analyse. 

Ik heb je tekst grondig geanalyseerd en specifieke verbeterpunten gegeven. Heb je vragen over mijn feedback? Wil je dat ik iets verder uitleg? Of heb je hulp nodig bij het implementeren van de verbeteringen?

**Voorbeelden van vragen die je kunt stellen:**
- "Kun je uitleggen wat je bedoelt met [specifiek punt]?"
- "Hoe kan ik meer concrete voorbeelden toevoegen?"
- "Wat is een goed voorbeeld van [specifiek concept]?"
- "Kun je me helpen deze zin te verbeteren: [citeer je tekst]?"

Stel gerust je vraag! 🎓`,
        timestamp: new Date()
      }
      setMessages([contextMessage])
    }
  }, [isOpen, messages.length, elementTitle])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingResponse])

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading || isStreaming) return

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsLoading(true)
    setStreamingResponse('')

    // Create abort controller for this request
    abortControllerRef.current = new AbortController()

    try {
      // Create context for the coach
      const chatContext = `
CONTEXT VOOR COACH:
- Student vraagt over feedback voor: ${elementTitle}
- Originele student tekst: "${originalText.substring(0, 1000)}${originalText.length > 1000 ? '...' : ''}"
- Eerder gegeven feedback: "${originalFeedback.substring(0, 1000)}${originalFeedback.length > 1000 ? '...' : ''}"

STUDENT VRAAG: ${currentMessage.trim()}

INSTRUCTIES:
- Beantwoord de vraag specifiek en behulpzaam
- Verwijs naar de originele tekst en feedback waar relevant
- Geef concrete, actionable adviezen
- Gebruik voorbeelden om je punt te verduidelijken
- Blijf in de rol van ervaren HBO-docent
- Houd het gesprek gericht op verbetering van de analyse
- Maximaal 300 woorden per antwoord`

      const response = await fetch('/api/chat-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: chatContext,
          aiModel: 'smart'
        }),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      setIsLoading(false)
      setIsStreaming(true)

      // Process streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No readable stream available')
      }

      let buffer = ''
      let fullResponse = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.error) {
                throw new Error(data.message || 'Streaming error')
              }
              
              if (data.done) {
                // Stream completed
                const coachMessage: ChatMessage = {
                  id: 'coach-' + Date.now(),
                  role: 'coach',
                  content: fullResponse,
                  timestamp: new Date()
                }
                setMessages(prev => [...prev, coachMessage])
                setStreamingResponse('')
                setIsStreaming(false)
                return
              }
              
              if (data.token) {
                fullResponse += data.token
                setStreamingResponse(fullResponse)
              }
            } catch (parseError) {
              console.error('Error parsing streaming data:', parseError)
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Chat error:', error)
      
      if (error.name === 'AbortError') {
        return // Request was aborted
      }

      const errorMessage: ChatMessage = {
        id: 'error-' + Date.now(),
        role: 'coach',
        content: 'Sorry, er is een fout opgetreden. Probeer je vraag opnieuw te stellen.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      abortControllerRef.current = null
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`mt-4 px-4 py-2 ${color.bg} ${color.text} rounded-lg hover:opacity-80 transition-all duration-200 flex items-center space-x-2 border-2 ${color.border}`}
      >
        <span className="material-symbols-sharp hl-icon-sm">chat</span>
        <span>💬 Stel een vraag over deze feedback</span>
      </button>
    )
  }

  return (
    <div className={`mt-6 ${color.bg} rounded-xl border-2 ${color.border} overflow-hidden`}>
      {/* Chat Header */}
      <div className={`${color.button} text-white p-4 flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="material-symbols-sharp text-white hl-icon-sm">psychology</span>
          </div>
          <div>
            <h4 className="font-bold text-lg">Chat met je Coach</h4>
            <p className="text-sm opacity-90">Stel vragen over je {elementTitle} feedback</p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
        >
          <span className="material-symbols-sharp hl-icon-sm">close</span>
        </button>
      </div>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-gray-100 text-gray-800'
                  : `${color.bg} ${color.text}`
              }`}
            >
              {message.role === 'coach' && (
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-6 h-6 ${color.button} rounded-full flex items-center justify-center`}>
                    <span className="material-symbols-sharp text-white" style={{ fontSize: '14px' }}>school</span>
                  </div>
                  <span className="text-sm font-medium">HBO Coach</span>
                </div>
              )}
              
              <MarkdownRenderer 
                content={message.content} 
                className={message.role === 'coach' ? color.text : 'text-gray-800'}
              />
              
              {message.role === 'coach' && (
                <ResponseActions 
                  content={message.content}
                  isMarkdown={true}
                  className="mt-2"
                />
              )}
              
              <div className="text-xs opacity-60 mt-2">
                {message.timestamp.toLocaleTimeString('nl-NL', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Streaming Response */}
        {isStreaming && streamingResponse && (
          <div className="flex justify-start">
            <div className={`max-w-[80%] rounded-lg p-3 ${color.bg} ${color.text}`}>
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-6 h-6 ${color.button} rounded-full flex items-center justify-center`}>
                  <span className="material-symbols-sharp text-white" style={{ fontSize: '14px' }}>school</span>
                </div>
                <span className="text-sm font-medium">HBO Coach</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
              
              <MarkdownRenderer 
                content={streamingResponse} 
                className={color.text}
              />
              <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1 align-text-bottom"></span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-start">
            <div className={`rounded-lg p-3 ${color.bg} ${color.text}`}>
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 ${color.button} rounded-full flex items-center justify-center`}>
                  <span className="material-symbols-sharp text-white" style={{ fontSize: '14px' }}>school</span>
                </div>
                <span className="text-sm">Coach denkt na...</span>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Stel een vraag over de feedback... (bijv. 'Kun je uitleggen wat je bedoelt met...')"
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              disabled={isLoading || isStreaming}
              maxLength={1000}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {currentMessage.length}/1000 karakters
            </div>
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!currentMessage.trim() || isLoading || isStreaming}
            className={`px-4 py-3 ${color.button} text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2`}
          >
            {isLoading || isStreaming ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <span className="material-symbols-sharp hl-icon-white hl-icon-sm">send</span>
            )}
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-600 flex items-center space-x-4">
          <span>💡 Tip: Stel specifieke vragen over de feedback voor de beste hulp</span>
          <span>⌨️ Enter = versturen, Shift+Enter = nieuwe regel</span>
        </div>
      </div>
    </div>
  )
}