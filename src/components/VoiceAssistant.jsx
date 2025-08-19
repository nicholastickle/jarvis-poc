import { useState, useRef, useEffect, useCallback } from 'react'
import { config } from '../config/env.js'
import { openaiService } from '../services/openaiService.js'
import { ttsService } from '../services/ttsService.js'
import VoiceIndicator from './VoiceIndicator'
import './VoiceAssistant.css'

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [conversationHistory, setConversationHistory] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)

  const recognitionRef = useRef(null)

  const getMockResponse = (input) => {
    const responses = {
      'hello': 'Hello! How can I help you?',
      'time': `It's ${new Date().toLocaleTimeString()}`,
      'weather': 'The weather is looking great today!',
      'name': 'I am Jarvis, your voice assistant.',
      'test': 'STT is working perfectly!',
      'clear': 'Conversation cleared!',
    }

    const lowerInput = input.toLowerCase()

    if (lowerInput.includes('clear')) {
      setConversationHistory([])
      setTranscript('')
      setResponse('')
      return responses.clear
    }

    for (const [key, value] of Object.entries(responses)) {
      if (lowerInput.includes(key)) return value
    }

    return `You said: "${input}". ${config.isConfigured() ? 'Processing with OpenAI...' : 'Using mock responses.'}`
  }

  const handleSpeechResult = useCallback(async (speechText) => {
    setTranscript(speechText)
    setError('')

    try {
      let aiResponse

      if (config.isConfigured()) {
        aiResponse = await openaiService.getResponse(speechText, conversationHistory)
      } else {
        aiResponse = getMockResponse(speechText)
      }

      setResponse(aiResponse)

      // Auto-speak the response
      if (aiResponse && aiResponse !== 'Conversation cleared!') {
        try {
          setIsSpeaking(true)
          await ttsService.speakText(aiResponse, {}, (playing) => {
            setIsSpeaking(playing)
          })
        } catch (ttsError) {
          console.error('TTS error:', ttsError)
          setError(`TTS Error: ${ttsError.message}`)
          setIsSpeaking(false)
        }
      }

      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        user: speechText,
        assistant: aiResponse,
        method: 'voice'
      }
      setConversationHistory(prev => [...prev, newEntry])

    } catch (error) {
      console.error('Error getting AI response:', error)
      const fallbackResponse = getMockResponse(speechText)
      setResponse(fallbackResponse)
      setError('Using mock response (OpenAI unavailable)')
      
      // Auto-speak fallback response too
      if (fallbackResponse) {
        try {
          setIsSpeaking(true)
          await ttsService.speakText(fallbackResponse, {}, (playing) => {
            setIsSpeaking(playing)
          })
        } catch (ttsError) {
          console.error('TTS fallback error:', ttsError)
          setIsSpeaking(false)
        }
      }
    }
  }, [conversationHistory]) // Simplified dependencies

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript
        handleSpeechResult(speechResult)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setError(`Speech error: ${event.error}`)
        setIsListening(false)
      }
    } else {
      setError('Speech recognition not supported in this browser. Please use Chrome.')
    }
  }, [handleSpeechResult]) // Only depend on the callback, not autoSpeak directly

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
    } else {
      setError('')
      setTranscript('')
      setResponse('')
      setIsListening(true)
      recognitionRef.current.start()
    }
  }

  const speakLastResponse = async () => {
    if (!response) return
    
    try {
      setIsSpeaking(true)
      await ttsService.speakText(response, {}, (playing) => setIsSpeaking(playing))
    } catch (ttsError) {
      console.error('TTS error:', ttsError)
      setError(`TTS Error: ${ttsError.message}`)
      setIsSpeaking(false)
    }
  }

  const clearConversation = () => {
    setConversationHistory([])
    setTranscript('')
    setResponse('')
    setError('')
  }

  return (
    <div className="voice-assistant">
      <div className="status">
        {config.isConfigured() ? '✅ OpenAI Ready' : '🔄 Mock Mode'} |
        History: {conversationHistory.length}
      </div>

      <main>
        {error && <div className="error">❌ {error}</div>}
        {isListening && <div className="listening">🎤 Listening...</div>}
        {isSpeaking && <div className="speaking">🔊 Speaking...</div>}

        <div className="controls">
          <button
            className={`voice-btn primary ${isListening ? 'listening' : ''} ${isSpeaking ? 'disabled' : ''}`}
            onClick={toggleListening}
            disabled={error !== '' || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) || isSpeaking}
          >
            {isListening ? '🛑 Stop Listening' : isSpeaking ? '⏳ Please Wait...' : '🎤 Start Conversation'}
          </button>

          {response && (
            <button
              className="voice-btn secondary"
              onClick={speakLastResponse}
              disabled={isSpeaking}
            >
              🔊 Repeat Response
            </button>
          )}

          {conversationHistory.length > 0 && (
            <button
              className="voice-btn secondary clear"
              onClick={clearConversation}
              disabled={isListening || isSpeaking}
            >
              🗑️ Clear Chat
            </button>
          )}
        </div>

        <div className="voice-indicator-container">
          <VoiceIndicator isPlaying={isListening || isSpeaking} size={100} />
        </div>

        {transcript && (
          <div className="result">
            <strong>You:</strong> {transcript}
          </div>
        )}

        {response && (
          <div className="result">
            <strong>Jarvis:</strong> {response}
          </div>
        )}

        {conversationHistory.length > 0 && (
          <div className="history">
            <h3>Recent Conversations</h3>
            {conversationHistory.slice(-3).map((entry) => (
              <div key={entry.id} className="history-item">
                <small>{entry.timestamp}</small>
                <div><strong>You:</strong> {entry.user}</div>
                <div><strong>Jarvis:</strong> {entry.assistant}</div>
              </div>
            ))}
            {conversationHistory.length > 3 && (
              <small>... and {conversationHistory.length - 3} more</small>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
