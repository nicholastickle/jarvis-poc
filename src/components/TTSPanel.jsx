import { useState } from "react";
import "./TTSPanel.css";

export default function TTSPanel() {
  const [text, setText] = useState("");

  // Async function for the button click
  const handleSpeak = async () => {
    try {
      // Simulate async behavior (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 100)); // just a dummy async wait
      console.log("Text to submit:", text);
    } catch (error) {
      console.error("Error handling text:", error);
    }
  };

  return (
    <div className="tts-panel">
      <h2>Text to Speech</h2>
      <textarea
        placeholder="Type something here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSpeak} disabled={!text.trim()}>
        Speak
      </button>
    </div>
  );
}