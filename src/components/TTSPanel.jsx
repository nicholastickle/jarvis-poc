import { useState } from 'react'
import './TTSPanel.css'
import { config } from '../config/env.js'
import { ttsService } from '../services/ttsService.js'
import VoiceIndicator from './VoiceIndicator'

export default function TTSPanel() {
  const [text, setText] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState('')

  const handleSpeak = async () => {
    if (!text.trim()) return

    setIsPlaying(true)
    setError('')

    try {
      if (!config.isConfigured()) {
        throw new Error('OpenAI API key not configured. Please add your API key to use TTS.')
      }

      await ttsService.speakText(text, {}, setIsPlaying)



    } catch (error) {
      console.error('TTS error:', error)
      setError(error.message || 'Failed to synthesize speech')
      setIsPlaying(false)
    } finally {
      setIsPlaying(false)
    }
  }

  return (
    <div className="tts-panel">
      <div className="status">
        {config.isConfigured() ? '✅ TTS Ready' : '🔄 API Key Required'}
      </div>

      {error && <div className="error">❌ {error}</div>}

      <textarea
        placeholder="Type something to convert to speech..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isPlaying}
      />

      <button
        onClick={handleSpeak}
        disabled={!text.trim() || isPlaying || !config.isConfigured()}
        className={isPlaying ? 'speaking' : ''}
      >
        {isPlaying ? '🔊 Speaking...' : '🎤 Speak'}
      </button>
      <div className="voice-indicator-container">
        <VoiceIndicator isPlaying={isPlaying} size={60} />
      </div>
    </div>
  )
}