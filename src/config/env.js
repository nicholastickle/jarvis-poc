// Environment configuration utility
// Vite exposes env vars that start with VITE_ to the client

export const config = {
  // OpenAI Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o-mini',
    ttsModel: import.meta.env.VITE_OPENAI_TTS_MODEL || 'tts-1',
    ttsVoice: import.meta.env.VITE_OPENAI_TTS_VOICE || 'alloy'
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Jarvis Voice Assistant',
    speechTimeout: parseInt(import.meta.env.VITE_SPEECH_TIMEOUT) || 10000,
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true'
  },

  // Helper method to check if OpenAI is configured
  isConfigured() {
    return !!this.openai.apiKey
  }
}

// Debug logging in development
if (config.app.debugMode && import.meta.env.DEV) {
  console.log('🔧 Environment Configuration:', {
    openaiConfigured: config.isConfigured(),
    model: config.openai.model,
    app: config.app
  })
}
