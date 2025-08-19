# Jarvis - Voice Assistant

> **Intelligent conversational AI with speech-to-text and text-to-speech capabilities**

A modern web-based voice assistant built with React and OpenAI APIs, featuring real-time speech recognition, natural language processing, and audio responses.

## Features

- **Speech Recognition** - Browser-based voice input (Chrome/Edge)
- **OpenAI Integration** - GPT-4o-mini for intelligent conversations  
- **Text-to-Speech** - OpenAI TTS with natural voice synthesis
- **Responsive Design** - Works on desktop and mobile devices
- **Fallback Mode** - Mock responses when OpenAI unavailable
- **Modern UI** - Clean design with smooth animations

## Quick Start

### Prerequisites
- Node.js 18+ 
- OpenAI API key ([Get yours here](https://platform.openai.com/api-keys))
- Chrome or Edge browser (for speech recognition)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nicholastickle/jarvis-poc.git
   cd jarvis-poc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser** → `http://localhost:5173`

## Configuration

### Environment Variables (.env)
```bash
# Required
VITE_OPENAI_API_KEY=your_api_key_here

# Optional (with defaults)
VITE_OPENAI_MODEL=gpt-4o-mini
VITE_OPENAI_TTS_MODEL=tts-1  
VITE_OPENAI_TTS_VOICE=alloy
VITE_APP_NAME=Jarvis Voice Assistant
VITE_SPEECH_TIMEOUT=10000
VITE_DEBUG_MODE=false
```

### Voice Options
- **Voices**: `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`
- **Models**: `gpt-4o-mini`, `gpt-4o`, `gpt-3.5-turbo`

## Development

### Available Scripts
```bash
npm run dev      # Development server
npm run build    # Production build  
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Tech Stack
- **Frontend**: React 19, Vite 7, CSS3
- **APIs**: OpenAI GPT-4o-mini, OpenAI TTS, Web Speech API
- **Architecture**: Service-based, modular components

## Usage

1. **Grant microphone permissions** when prompted
2. **Click "Start Conversation"** to begin voice input
3. **Speak your question** - the app listens automatically
4. **Receive audio response** - AI responds with speech
5. **Continue conversation** - maintains context(not yet implemented) and history

### Voice Commands
- Say **"clear"** to reset conversation history
- **"Hello"**, **"time"**, **"weather"**, **"name"** - try built-in responses

## Architecture

### Project Structure
```
src/
├── components/           # React components
│   ├── VoiceAssistant.jsx   # Main voice interface
│   ├── VoiceIndicator.jsx   # Visual feedback component
│   └── *.css               # Component styles
├── services/            # API services
│   ├── openaiService.js    # GPT chat completions
│   ├── ttsService.js       # Text-to-speech
│   └── baseOpenAIService.js # Shared API logic
├── config/
│   └── env.js              # Environment configuration
└── hooks/               # Custom React hooks
```

### Key Components
- **VoiceAssistant** - Core voice interface with speech recognition
- **VoiceIndicator** - Animated visual feedback during interactions  
- **OpenAI Services** - Modular API integration for chat and TTS

## Browser Compatibility

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| Speech Recognition | ✅ | ✅ | ❌ | ❌ |
| Text-to-Speech | ✅ | ✅ | ✅ | ✅ |
| Audio Playback | ✅ | ✅ | ✅ | ✅ |

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Authors

- **Nicholas Tickle** - [@nicholastickle](https://github.com/nicholastickle)
- **Brighton Tandabantu** - [@brighton](https://github.com/dev-thandabantu)

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

Built by friends with React, OpenAI, and modern web technologies
