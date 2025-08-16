
import TTSPanel from "./components/TTSPanel";
import VoiceIndicator from './components/VoiceIndicator.jsx';
import './App.css'

function App() {

  const [isVoicePlaying, setIsVoicePlaying] = useState(false);

  return (
    <>
      <h1>Jarvis Proof of Concept</h1>
      <div>
        <div>
          {/* Section for testing speech to text */}
        </div>
        <div>
          {/* Section for testing prompting the AI */}
        </div>
        <div>
          {/* Section for testing text to speech */}
          <TTSPanel />
          <VoiceIndicator isPlaying={isVoicePlaying} size={80} />
        </div>
      </div>


    </>
  )
}

export default App
