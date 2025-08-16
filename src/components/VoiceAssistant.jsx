import { useState, useRef, useEffect } from 'react'
import { config } from '../config/env.js'
import { openaiService } from '../services/openaiService.js'

export function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')
  const [conversationHistory, setConversationHistory] = useState([])
  
  const recognitionRef = useRef(null)

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

      recognitionRef.current.onend = () => setIsListening(false)
      recognitionRef.current.onerror = (event) => {
        setError(`Speech error: ${event.error}`)
        setIsListening(false)
      }
    }
  }, [])

  const handleSpeechResult = async (speechText) => {
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
    }
  }

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

  return (
    <div className="voice-assistant">
      <div className="status">
        {config.isConfigured() ? '✅ OpenAI Ready' : '🔄 Mock Mode'} | 
        History: {conversationHistory.length}
      </div>

      <main>
        {error && <div className="error">❌ {error}</div>}
        {isListening && <div className="listening">🎤 Listening...</div>}
        
        <button 
          className={`voice-btn ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
          disabled={!recognitionRef.current}
        >
          {isListening ? '🛑 Stop' : '🎤 Listen'}
        </button>

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
