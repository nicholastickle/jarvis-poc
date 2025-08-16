import { config } from '../config/env.js'
import { BaseOpenAIService } from './baseOpenAIService.js'

export class OpenAIService extends BaseOpenAIService {
  constructor() {
    super()
    this.model = config.openai.model
  }

  async getResponse(userInput, conversationHistory = []) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      // Build conversation context from history
      const messages = this.buildConversationContext(conversationHistory)
      
      // Add current user input
      messages.push({
        role: 'user',
        content: userInput
      })

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: messages,
          max_tokens: 150,
          temperature: 0.7,
          stream: false
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenAI API')
      }

      return data.choices[0].message.content.trim()
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw error // Let the calling component handle the error
    }
  }

  buildConversationContext(history) {
    const messages = [
      {
        role: 'system',
        content: 'You are Jarvis, a helpful voice assistant. Keep responses concise and conversational, as they will be read aloud. Be friendly but professional.'
      }
    ]

    const recentHistory = history.slice(-5)
    
    recentHistory.forEach(entry => {
      messages.push(
        { role: 'user', content: entry.user },
        { role: 'assistant', content: entry.assistant }
      )
    })

    return messages
  }

  estimateTokens(text) {
    return Math.ceil(text.length / 4)
  }

  getCurrentModel() {
    return this.model
  }
}

export const openaiService = new OpenAIService()
