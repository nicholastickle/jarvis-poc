import './App.css'
import { VoiceAssistant } from './components/VoiceAssistant.jsx'
import TTSPanel from './components/TTSPanel'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Jarvis - Voice Assistant</h1>
        <p>Speak to AI, get intelligent responses</p>
      </header>
      
      <main className="app-main">
        <section className="stt-section">
          <VoiceAssistant />
        </section>
        
        <section className="tts-section">
          <TTSPanel />
        </section>
      </main>
    </div>
  )
}

export default App
