import { useState } from "react";
import { Copy } from "lucide-react";

export default function JSONFormatter() {
  const [input, setInput] = useState('{"name":"ToolVerse","free":true}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("pretty");

  function run() {
    try {
      const parsed = JSON.parse(input);
      setOutput(mode === "minify"
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, 2));
      setError("");
    } catch (e) {
      setOutput("");
      setError(e.message);
    }
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      setError("Clipboard access failed. Select and copy the output manually.");
    }
  }

  return (
    <div className="tool-form">
      <label>
        Input JSON
        <textarea className="code-input" rows="8" value={input}
          onChange={(e) => setInput(e.target.value)} spellCheck="false" />
      </label>
      <div className="field-row">
        <label>
          Output format
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="pretty">Pretty print</option>
            <option value="minify">Minify</option>
          </select>
        </label>
        <button className="primary-button" onClick={run}>Format JSON</button>
      </div>
      {error && <p className="error-text">{error}</p>}
      {output && <div className="output-wrap">
        <pre>{output}</pre>
        <button className="secondary-button" onClick={copyOutput}>
          <Copy size={16} /> Copy output
        </button>
      </div>}
    </div>
  );
}
