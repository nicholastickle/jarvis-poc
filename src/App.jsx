
import './App.css'
import { VoiceAssistant } from './components/VoiceAssistant.jsx'

function App() {
  return (
    <>
      <div className="app-container">
        <header className="app-header">
          <h1>Jarvis - Voice Assistant</h1>
          <p>Speak to AI, get intelligent responses</p>
        </header>

        <main className="app-main">
          <section className="voice-section">
            <VoiceAssistant />
          </section>
        </main>
      </div>

    </>
  )
}

export default App
