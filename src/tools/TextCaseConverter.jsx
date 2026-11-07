import { useState } from "react";
import {
  CaseUpper,
  CaseLower,
  CaseSensitive,
  Type,
  Copy,
  Check,
  RotateCcw,
  Download,
  FileText,
  AlertCircle,
} from "lucide-react";

const modes = [
  { id: "upper", label: "UPPERCASE", icon: CaseUpper },
  { id: "lower", label: "lowercase", icon: CaseLower },
  { id: "title", label: "Title Case", icon: CaseSensitive },
  { id: "sentence", label: "Sentence case", icon: Type },
];

function convertCase(text, mode) {
  switch (mode) {
    case "upper":
      return text.toUpperCase();
    case "lower":
      return text.toLowerCase();
    case "title":
      return text.toLowerCase().replace(/\p{L}[\p{L}\p{M}'’]*/gu, (word) => {
        const letters = Array.from(word);
        return letters[0].toUpperCase() + letters.slice(1).join("");
      });
    case "sentence": {
      const lower = text.toLowerCase();
      return lower.replace(
        /(^|[.!?]+[\s"'“”‘’([{]*|\n\s*)(\p{L})/gu,
        (_, prefix, letter) => prefix + letter.toUpperCase()
      );
    }
    default:
      return text;
  }
}

const editorStyle =
  "w-full min-h-[230px] resize-y rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#07090E] px-4 py-4 text-sm leading-7 text-[#F0FDF4] outline-none transition placeholder:text-[#718478] focus:border-[#10b981]/60 focus:ring-2 focus:ring-[#10b981]/10";

export default function TextCaseConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("upper");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const output = convertCase(text, mode);
  const wordCount = text.trim() ? text.trim().split(/\s+/u).length : 0;

  function updateText(value) {
    setText(value);
    setCopied(false);
    setError("");
  }

  function selectMode(nextMode) {
    setMode(nextMode);
    setCopied(false);
    setError("");
  }

  async function copyResult() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setError("");
    } catch {
      setError("Clipboard access failed. Select the output and copy manually.");
    }
  }

  function downloadResult() {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "toolverse-converted-text.txt";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function clearAll() {
    updateText("");
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-[#F0FDF4] sm:text-xl">
            <CaseSensitive size={23} className="text-[#10b981]" />
            Text Transformation Studio
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#94a3b8]">
            Convert text capitalization instantly with live preview.
          </p>
        </div>
        <span className="rounded-full border border-[#10b981]/20 bg-[#10b981]/10 px-3 py-1.5 text-xs font-medium text-[#10b981]">
          Live conversion
        </span>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-[#F0FDF4]">Choose conversion style</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="group" aria-label="Text case conversion mode">
          {modes.map((item) => {
            const Icon = item.icon;
            const selected = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => selectMode(item.id)}
                className={`flex min-h-[96px] flex-col items-start justify-between gap-3 rounded-xl border p-4 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981] ${
                  selected
                    ? "border-[#10b981]/50 bg-[#10b981]/10 text-[#10b981]"
                    : "border-[rgba(255,255,255,0.1)] bg-[#0D111A] text-[#94a3b8] hover:border-[#10b981]/25 hover:text-[#F0FDF4]"
                }`}
              >
                <Icon size={20} />
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="case-source" className="flex items-center gap-2 text-sm font-semibold text-[#F0FDF4]">
              <FileText size={17} className="text-[#10b981]" />
              Original text
            </label>
            <span className="text-xs text-[#94a3b8]">{text.length.toLocaleString()} chars</span>
          </div>
          <textarea
            id="case-source"
            rows={9}
            value={text}
            onChange={(event) => updateText(event.target.value)}
            placeholder="Type or paste your text here..."
            spellCheck={false}
            className={editorStyle}
          />
          <div className="flex flex-wrap gap-3 text-xs text-[#94a3b8]">
            <span>{wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span>{text.length.toLocaleString()} characters</span>
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="case-result" className="flex items-center gap-2 text-sm font-semibold text-[#F0FDF4]">
              <CaseSensitive size={17} className="text-[#10b981]" />
              Converted text
            </label>
            <span className="text-xs text-[#94a3b8]">{output.length.toLocaleString()} chars</span>
          </div>
          <textarea
            id="case-result"
            rows={9}
            value={output}
            readOnly
            placeholder="Your converted text will appear here..."
            spellCheck={false}
            className={`${editorStyle} border-[#10b981]/20 bg-[#18201C]`}
          />
          <div className="flex items-center gap-2 text-xs text-[#10b981]/80">
            <Check size={14} />
            Updated automatically
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={copyResult}
          disabled={!output}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10b981] px-5 py-3.5 text-sm font-bold text-[#07090E] transition hover:bg-[#A7F3C4] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? <><Check size={17} />Copied</> : <><Copy size={17} />Copy result</>}
        </button>
        <button
          type="button"
          onClick={downloadResult}
          disabled={!output}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#10b981]/25 bg-[#10b981]/10 px-5 py-3.5 text-sm font-semibold text-[#10b981] transition hover:bg-[#10b981]/15 disabled:opacity-40"
        >
          <Download size={17} />
          Download TXT
        </button>
        <button
          type="button"
          onClick={clearAll}
          disabled={!text}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0D111A] px-5 py-3.5 text-sm font-semibold text-[#D5EBDD] transition hover:bg-[#243128] disabled:opacity-40"
        >
          <RotateCcw size={17} />
          Clear
        </button>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-300">
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      <p className="text-center text-xs leading-6 text-[#94a3b8]">
        Text conversion happens entirely in your browser. Your text is not uploaded or stored on a server.
      </p>
    </div>
  );
}
