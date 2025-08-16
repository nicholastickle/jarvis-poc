import { config } from '../config/env.js'

export class BaseOpenAIService {
  constructor() {
    this.apiKey = config.openai.apiKey
    this.baseUrl = 'https://api.openai.com/v1'
  }

  isConfigured() {
    return !!this.apiKey
  }

  getHeaders() {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    }
  }

  async makeRequest(endpoint, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('OpenAI API key not configured')
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        ...options
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
      }

      return response
    } catch (error) {
      console.error('OpenAI API request error:', error)
      throw error
    }
  }
}
