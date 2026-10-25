
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
      return text
        .toLowerCase()
        .replace(/\p{L}[\p{L}\p{M}'’]*/gu, (word) => {
          const letters = Array.from(word);
          return letters[0].toUpperCase() +
            letters.slice(1).join("");
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
  "w-full min-h-[230px] resize-y rounded-xl border border-white/10 bg-[#080f1c] px-4 py-4 text-sm leading-7 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10";

export default function TextCaseConverter() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("upper");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const output = convertCase(text, mode);

  const wordCount = text.trim()
    ? text.trim().split(/\s+/u).length
    : 0;

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
      setError(
        "Clipboard access failed. Select the output and copy manually."
      );
    }
  }

  function downloadResult() {
    if (!output) return;

    const blob = new Blob([output], {
      type: "text/plain;charset=utf-8",
    });

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
      {/* Heading */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
            <CaseSensitive
              size={23}
              className="text-cyan-300"
            />
            Text Transformation Studio
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Convert text capitalization instantly with live preview.
          </p>
        </div>

        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200">
          Live conversion
        </span>
      </div>

      {/* Conversion mode */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-200">
          Choose conversion style
        </p>

        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          role="group"
          aria-label="Text case conversion mode"
        >
          {modes.map((item) => {
            const Icon = item.icon;
            const selected = mode === item.id;

            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={selected}
                onClick={() => selectMode(item.id)}
                className={`flex min-h-[96px] flex-col items-start justify-between gap-3 rounded-xl border p-4 text-left transition ${
                  selected
                    ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-200"
                    : "border-white/10 bg-[#0b1422] text-slate-400 hover:border-white/25 hover:text-white"
                }`}
              >
                <Icon size={20} />

                <span className="text-xs font-semibold">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input and output editors */}
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="case-source"
              className="flex items-center gap-2 text-sm font-semibold text-slate-200"
            >
              <FileText size={17} className="text-cyan-300" />
              Original text
            </label>

            <span className="text-xs text-slate-500">
              {text.length.toLocaleString()} chars
            </span>
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

          <div className="flex flex-wrap gap-3 text-xs text-slate-500">
            <span>{wordCount.toLocaleString()} words</span>
            <span>•</span>
            <span>{text.length.toLocaleString()} characters</span>
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="case-result"
              className="flex items-center gap-2 text-sm font-semibold text-slate-200"
            >
              <CaseSensitive
                size={17}
                className="text-cyan-300"
              />
              Converted text
            </label>

            <span className="text-xs text-slate-500">
              {output.length.toLocaleString()} chars
            </span>
          </div>

          <textarea
            id="case-result"
            rows={9}
            value={output}
            readOnly
            placeholder="Your converted text will appear here..."
            spellCheck={false}
            className={`${editorStyle} border-cyan-400/15 bg-[#0c1725]`}
          />

          <div className="flex items-center gap-2 text-xs text-emerald-300/80">
            <Check size={14} />
            Updated automatically
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={copyResult}
          disabled={!output}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? (
            <>
              <Check size={17} />
              Copied
            </>
          ) : (
            <>
              <Copy size={17} />
              Copy result
            </>
          )}
        </button>

        <button
          type="button"
          onClick={downloadResult}
          disabled={!output}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15 disabled:opacity-40"
        >
          <Download size={17} />
          Download TXT
        </button>

        <button
          type="button"
          onClick={clearAll}
          disabled={!text}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 disabled:opacity-40"
        >
          <RotateCcw size={17} />
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-300"
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* Privacy */}
      <p className="text-center text-xs leading-6 text-slate-500">
        Text conversion happens entirely in your browser.
        Your text is not uploaded or stored on a server.
      </p>
    </div>
  );
}
