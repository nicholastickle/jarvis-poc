
import TTSPanel from "./components/TTSPanel";
import './App.css'

function App() {


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
        </div>
      </div>


    </>
  )
}

export default App
