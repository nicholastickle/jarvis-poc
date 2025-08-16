import './App.css'
import { VoiceAssistant } from './components/VoiceAssistant.jsx'
import TTSPanel from './components/TTSPanel'

function App() {
  return (
    <div>
      <h1>Jarvis - Voice Assistant</h1>
      <div>
        <div>
          <h2>Speech to Text & AI</h2>
          <VoiceAssistant />
        </div>
        <div>
          <TTSPanel />
        </div>
      </div>
    </div>
  )
}

export default App
