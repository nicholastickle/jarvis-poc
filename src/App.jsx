
import TTSPanel from "./components/TTSPanel";
// import VoiceIndicator from './components/VoiceIndicator.jsx';
import './App.css'
import { VoiceAssistant } from './components/VoiceAssistant.jsx'

function App() {

  // const [isVoicePlaying, setIsVoicePlaying] = useState(false);

  return (
    <>
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
            {/* <VoiceIndicator isPlaying={isVoicePlaying} size={80} /> */}
          </section>
        </main>
      </div>

    </>
  )
}

export default App
