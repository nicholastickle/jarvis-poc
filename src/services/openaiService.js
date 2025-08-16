// OpenAI API Service
// This is your main responsibility - STT → OpenAI API → Text Response

import { config } from '../config/env.js'

export class OpenAIService {
  constructor() {
    this.apiKey = config.openai.apiKey
    this.model = config.openai.model
    this.baseUrl = 'https://api.openai.com/v1'
  }

  /**
   * Check if OpenAI is properly configured
   * @returns {boolean}
   */
  isConfigured() {
    return !!this.apiKey
  }

  /**
   * Send user input to OpenAI and get text response
   * This is the main method you'll be focusing on
   * @param {string} userInput - The transcribed speech or typed text
   * @param {Array} conversationHistory - Previous messages for context
   * @returns {Promise<string>} - AI response text
   */
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
          stream: false // Nick might want to implement streaming later
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

  /**
   * Build conversation context for the API call
   * @param {Array} history - Previous conversation entries
   * @returns {Array} - Formatted messages for OpenAI API
   */
  buildConversationContext(history) {
    const messages = [
      {
        role: 'system',
        content: 'You are Jarvis, a helpful voice assistant. Keep responses concise and conversational, as they will be read aloud. Be friendly but professional.'
      }
    ]

    // Add recent conversation history (last 5 exchanges to avoid token limits)
    const recentHistory = history.slice(-5)
    
    recentHistory.forEach(entry => {
      messages.push(
        { role: 'user', content: entry.user },
        { role: 'assistant', content: entry.assistant }
      )
    })

    return messages
  }

  /**
   * Estimate token usage (useful for cost tracking)
   * @param {string} text 
   * @returns {number} - Rough token estimate
   */
  estimateTokens(text) {
    // Rough estimate: ~4 characters per token
    return Math.ceil(text.length / 4)
  }

  /**
   * Get current model being used
   * @returns {string}
   */
  getCurrentModel() {
    return this.model
  }
}

// Create singleton instance
export const openaiService = new OpenAIService()
