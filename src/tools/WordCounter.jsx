import { useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
  const sentences = text.trim()
    ? text.split(/[.!?]+/u).filter((s) => s.trim()).length
    : 0;
  const paragraphs = text.trim()
    ? text.split(/\n\s*\n/u).filter((s) => s.trim()).length
    : 0;

  return (
    <div className="tool-form">
      <label>
        Your text
        <textarea rows="10" value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..." />
      </label>
      <div className="stats-grid">
        {[
          ["Words", words],
          ["Characters", text.length],
          ["No spaces", text.replace(/\s/g, "").length],
          ["Sentences", sentences],
          ["Paragraphs", paragraphs],
          ["Reading time", `${Math.ceil(words / 200)} min`],
        ].map(([label, value]) => (
          <div className="stat-card" key={label}>
            <span>{label}</span><strong>{value}</strong>
          </div>
        ))}
      </div>
      <button className="secondary-button" onClick={() => setText("")}>Clear text</button>
    </div>
  );
}
