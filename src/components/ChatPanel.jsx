import { useState, useRef, useEffect, useCallback } from 'react'
import { config } from '../config/env.js'
import { openaiService } from '../services/openaiService.js'
import { ttsService } from '../services/ttsService.js'
import './ChatPanel.css';

const ChatPanel = () => {
    const [messages, setMessages] = useState([]);
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [response, setResponse] = useState('')
    const [error, setError] = useState('')
    const [isSpeaking, setIsSpeaking] = useState(false)
    const recognitionRef = useRef(null)
    const handleSpeechResultRef = useRef(null) // Ref to store the latest callback
    const chatMessagesRef = useRef(null);



    // Function to handle mock responses if the API is not configured
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
            setMessages([])
            setTranscript('')
            setResponse('')
            return responses.clear
        }

        for (const [key, value] of Object.entries(responses)) {
            if (lowerInput.includes(key)) return value
        }

        return `You said: "${input}". ${config.isConfigured() ? 'Processing with OpenAI...' : 'Using mock responses.'}`
    }

    // Function to handle speech recognition and converting to text

    const handleSpeechResult = useCallback(async (speechText) => {
        setTranscript(speechText)
        setError('')

        try {
            let aiResponse

            if (config.isConfigured()) {
                aiResponse = await openaiService.getResponse(speechText, messages)
            } else {
                aiResponse = getMockResponse(speechText)
            }

            setResponse(aiResponse)

            // Auto-speak the response
            if (aiResponse && aiResponse !== 'Conversation cleared!') {

                setIsSpeaking(true)
                setIsListening(false)
                try {
                    await ttsService.speakText(aiResponse, {}, (playing) => {
                        setIsSpeaking(playing)
                    })
                } catch (ttsError) {
                    console.error('TTS error:', ttsError)
                    setError(`TTS Error: ${ttsError.message}`)
                    setIsSpeaking(false)
                }
            } else {
                setIsSpeaking(false)
            }

            const newEntry = {
                id: Date.now(),
                timestamp: new Date().toLocaleTimeString(),
                user: speechText,
                assistant: aiResponse,
                method: 'voice'
            }
            setMessages(prev => [...prev, newEntry])

        } catch (error) {
            console.error('Error getting AI response:', error)
            const fallbackResponse = getMockResponse(speechText)
            setResponse(fallbackResponse)
            setError('Using mock response (OpenAI unavailable)')
            setIsListening(false)

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
    }, [messages, getMockResponse]) // Include getMockResponse in dependencies

    // Update the ref whenever the callback changes
    useEffect(() => {
        handleSpeechResultRef.current = handleSpeechResult
    }, [handleSpeechResult])

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
            recognitionRef.current = new SpeechRecognition()

            recognitionRef.current.continuous = false
            recognitionRef.current.interimResults = false
            recognitionRef.current.lang = 'en-US'

            recognitionRef.current.onresult = (event) => {
                const speechResult = event.results[0][0].transcript
                // Use ref to avoid stale closure issues
                if (handleSpeechResultRef.current) {
                    handleSpeechResultRef.current(speechResult)
                }
            }

            recognitionRef.current.onend = () => {

            }
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error)
                setError(`Speech error: ${event.error}`)
                setIsListening(false)
            }
        } else {
            setError('Speech recognition not supported in this browser. Please use Chrome.')
        }
    }, []) // No dependencies - setup once on mount

    // Function to toggle the listening state
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

    // Function to clear the conversation history
    const clearConversation = () => {
        setMessages([]);
        setTranscript('')
        setResponse('')
        setError('')
    }

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="chat-panel">
            {/* Header */}
            <div className="chat-header">
                <div className="title-section">
                    <h1>Jarvis - Voice Assistant</h1>
                    <h2>Speak to AI, get intelligent responses</h2>
                </div>

            </div>

            {/* Main Content */}
            <div className="chat-content">
                {/* Avatar/Image Section */}
                <div className="avatar-section">
                    <div className="avatar-container">
                        <div
                            className={`avatar-orb ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}
                        >
                        </div>
                    </div>
                    <button
                        className={`chat-button ${isListening ? 'listening' : ''} ${isSpeaking ? 'disabled' : ''}`}
                        onClick={toggleListening}
                        disabled={error !== '' || !('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) || isSpeaking}
                    >
                        {isListening ? 'Stop Listening' : isSpeaking ? 'Please Wait...' : 'CHAT'}
                    </button>
                </div>

                {/* Chat History */}
                <div className="chat-history-section">
                    <div className="chat-messages" ref={chatMessagesRef}>
                        {messages.map((message) => (

                            <div key={message.id} className="message">

                                <div className='message-you'><strong>You:</strong> {message.user}</div>
                                <br />
                                <div></div>
                                <div className='message-jarvis'><strong>Jarvis:</strong> {message.assistant}</div>


                            </div>

                        ))}

                        {messages.length === 0 && (
                            <div className="empty-chat">No messages yet. Click <i>CHAT</i> to start a conversation</div>
                        )}
                    </div>

                    <button
                        className="clear-chat-button"
                        onClick={clearConversation}
                        disabled={isListening || isSpeaking}
                    >
                        Clear Chat
                    </button>
                </div>
            </div>
            {/* Footer */}
            <footer className="chat-footer">
                <p>Created by N.B.</p>
            </footer>
        </div>
    );
};

export default ChatPanel;