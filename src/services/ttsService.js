import { config } from '../config/env.js'

export class TTSService {
  constructor() {
    this.apiKey = config.openai.apiKey
    this.baseUrl = 'https://api.openai.com/v1'
  }

  isConfigured() {
    return !!this.apiKey
  }

  async synthesizeSpeech(text, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured for TTS')
    }

    if (!text?.trim()) {
      throw new Error('No text provided for synthesis')
    }

    const {
      model = config.openai.ttsModel,
      voice = config.openai.ttsVoice,
      speed = 1.0,
      format = 'mp3'
    } = options

    try {
      const response = await fetch(`${this.baseUrl}/audio/speech`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          voice,
          input: text.trim(),
          response_format: format,
          speed: Math.max(0.25, Math.min(4.0, speed))
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`TTS API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
      }

      return await response.arrayBuffer()
    } catch (error) {
      console.error('TTS synthesis error:', error)
      throw error
    }
  }

  async playAudio(audioBuffer) {
    try {
      const base64Audio = btoa(
        new Uint8Array(audioBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      )

      const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`)
      
      return new Promise((resolve, reject) => {
        audio.onended = resolve
        audio.onerror = reject
        audio.play().catch(reject)
      })
    } catch (error) {
      console.error('Audio playback error:', error)
      throw error
    }
  }

  async speakText(text, options = {}) {
    const audioBuffer = await this.synthesizeSpeech(text, options)
    await this.playAudio(audioBuffer)
  }
}

export const ttsService = new TTSService()
