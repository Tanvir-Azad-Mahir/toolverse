import { useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";

const modes = [
  { id: "upper", label: "UPPERCASE" },
  { id: "lower", label: "lowercase" },
  { id: "title", label: "Title Case" },
  { id: "sentence", label: "Sentence case" },
];

function convertCase(text, mode) {
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text.toLowerCase().replace(/\p{L}[\p{L}\p{M}'’]*/gu, (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
      );
    case "sentence": {
      const lower = text.toLowerCase();
      return lower.replace(/(^|[.!?]+[\s"'“”‘’([{]*|\n\s*)(\p{L})/gu, (_, prefix, letter) =>
        prefix + letter.toUpperCase()
      );
    }
    default:
      return text;
  }
}

export default function TextCaseConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("upper");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const output = convertCase(text, mode);

  async function copyResult() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setError("");
    } catch {
      setError("Copy failed. Select the result and copy it manually.");
    }
  }

  function updateText(value) {
    setText(value);
    setCopied(false);
    setError("");
  }

  return (
    <div className="tool-form">
      <label htmlFor="case-source">Enter your text</label>
      <textarea
        id="case-source"
        rows={7}
        value={text}
        onChange={(event) => updateText(event.target.value)}
        placeholder="Type or paste text here..."
      />

      <div className="field-row" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
        {modes.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-pressed={mode === option.id}
            className={mode === option.id ? "primary-button" : "secondary-button"}
            onClick={() => {
              setMode(option.id);
              setCopied(false);
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label htmlFor="case-result">Converted text</label>
      <textarea
        id="case-result"
        rows={7}
        value={output}
        readOnly
        placeholder="Your converted text will appear here."
        aria-label="Converted text"
      />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <button className="primary-button" type="button" onClick={copyResult} disabled={!output}>
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied" : "Copy result"}
        </button>
        <button className="secondary-button" type="button" onClick={() => updateText("")} disabled={!text}>
          <RotateCcw size={16} /> Clear
        </button>
      </div>

      {error && <p role="alert" style={{ color: "#ff9b9b", margin: 0 }}>{error}</p>}
      <p className="muted" style={{ margin: 0, fontSize: 12 }}>
        Changes happen instantly in your browser. Your text is not uploaded.
      </p>
    </div>
  );
}
