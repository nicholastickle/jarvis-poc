export const config = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
    ttsModel: import.meta.env.VITE_OPENAI_TTS_MODEL || 'tts-1',
    ttsVoice: import.meta.env.VITE_OPENAI_TTS_VOICE || 'alloy'
  },

  app: {
    name: import.meta.env.VITE_APP_NAME || 'Jarvis Voice Assistant',
    speechTimeout: parseInt(import.meta.env.VITE_SPEECH_TIMEOUT) || 10000,
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true'
  },

  isConfigured() {
    return !!this.openai.apiKey
  }
}

if (config.app.debugMode && import.meta.env.DEV) {
  console.log('🔧 Environment Configuration:', {
    openaiConfigured: config.isConfigured(),
    model: config.openai.model,
    app: config.app
  })
}
