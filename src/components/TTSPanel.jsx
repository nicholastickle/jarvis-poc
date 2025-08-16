import { useState } from "react";
import "./TTSPanel.css";

export default function TTSPanel() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSpeak = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "tts-1-hd",
          voice: "alloy",
          input: text,
          response_format: "mp3",
          speed: 1.0, // Control speed (0.25 to 4.0)
        }),
      });

      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64Audio = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
      audio.play();
    } catch (err) {
      console.error("Error calling TTS API:", err);
    } finally {
      setLoading(false);
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
      <button onClick={handleSpeak} disabled={!text.trim() || loading}>
        {loading ? "Speaking..." : "Speak"}
      </button>
    </div>
  );
}