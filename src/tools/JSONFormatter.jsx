
import { useState } from "react";
import {
  Braces,
  Copy,
  Check,
  Download,
  Trash2,
  AlertCircle,
  CheckCircle2,
  WandSparkles,
  FileJson,
} from "lucide-react";

const inputStyle =
  "w-full min-h-[250px] resize-y rounded-xl border border-white/10 bg-[#080f1c] px-4 py-4 font-mono text-[13px] leading-7 text-slate-200 outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 placeholder:text-slate-600";

const sampleJSON = `{
  "name": "ToolVerse",
  "free": true,
  "tools": ["Image Compressor", "JSON Formatter"],
  "version": 1
}`;

export default function JSONFormatter() {
  const [input, setInput] = useState(
    '{"name":"ToolVerse","free":true}'
  );
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState("pretty");
  const [copied, setCopied] = useState(false);

  let validationError = "";
  let isValid = false;

  if (input.trim()) {
    try {
      JSON.parse(input);
      isValid = true;
    } catch (error) {
      validationError = error.message;
    }
  }

  function handleInputChange(value) {
    setInput(value);
    setOutput("");
    setCopied(false);
  }

  function handleModeChange(value) {
    setMode(value);
    setOutput("");
    setCopied(false);
  }

  function formatJSON() {
    if (!isValid) return;

    const parsed = JSON.parse(input);

    setOutput(
      mode === "minify"
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, 2)
    );

    setCopied(false);
  }

  async function copyOutput() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function downloadJSON() {
    if (!output) return;

    const blob = new Blob([output], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "toolverse-formatted.json";
    link.click();

    URL.revokeObjectURL(url);
  }

  function clearAll() {
    setInput("");
    setOutput("");
    setCopied(false);
  }

  return (
    <div className="space-y-7">
      {/* Tool heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
            <Braces size={21} className="text-cyan-300" />
            JSON Workspace
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Format, validate, and minify JSON directly in your browser.
          </p>
        </div>

        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1.5 text-xs font-medium text-cyan-200">
          Client-side processing
        </span>
      </div>

      {/* Mode selection */}
      <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-[#0b1422] p-1.5">
        {[
          { id: "pretty", label: "Pretty Print" },
          { id: "minify", label: "Minify JSON" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => handleModeChange(item.id)}
            aria-pressed={mode === item.id}
            className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
              mode === item.id
                ? "bg-cyan-400/15 text-cyan-200 shadow-sm"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Input editor */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="json-input"
            className="flex items-center gap-2 text-sm font-semibold text-slate-200"
          >
            <FileJson size={17} className="text-cyan-300" />
            Input JSON
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleInputChange(sampleJSON)}
              className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/5"
            >
              Load sample
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-red-400/30 hover:text-red-300"
            >
              <Trash2 size={14} />
              Clear
            </button>
          </div>
        </div>

        <textarea
          id="json-input"
          spellCheck={false}
          value={input}
          onChange={(event) =>
            handleInputChange(event.target.value)
          }
          placeholder='Paste JSON here, e.g. {"hello": "world"}'
          className={inputStyle}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div aria-live="polite">
            {!input.trim() ? (
              <span className="text-xs text-slate-500">
                Enter JSON to begin.
              </span>
            ) : isValid ? (
              <span className="inline-flex items-center gap-2 text-xs font-medium text-emerald-300">
                <CheckCircle2 size={15} />
                Valid JSON
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 text-xs font-medium text-red-300">
                <AlertCircle size={15} />
                Invalid JSON
              </span>
            )}
          </div>

          <span className="text-xs text-slate-500">
            {input.length.toLocaleString()} characters
          </span>
        </div>

        {validationError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-xs leading-6 text-red-300"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}
      </div>

      {/* Format button */}
      <button
        type="button"
        disabled={!isValid}
        onClick={formatJSON}
        className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-4 text-sm font-bold text-slate-950 shadow-[0_12px_35px_rgba(34,211,238,0.13)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <WandSparkles size={18} />
        {mode === "pretty" ? "Format JSON" : "Minify JSON"}
      </button>

      {/* Output */}
      {output && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
              <CheckCircle2
                size={18}
                className="text-emerald-300"
              />
              Processed output
            </h3>

            <span className="text-xs text-slate-500">
              {output.length.toLocaleString()} characters
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080f1c]">
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.025] px-4 py-3">
              <span className="inline-flex items-center gap-2 font-mono text-xs text-slate-400">
                <FileJson size={15} />
                output.json
              </span>

              <span className="text-xs text-emerald-300">
                {mode === "pretty" ? "Formatted" : "Minified"}
              </span>
            </div>

            <pre className="max-h-[450px] overflow-auto whitespace-pre-wrap break-words p-5 font-mono text-[13px] leading-7 text-cyan-100">
              {output}
            </pre>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={copyOutput}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              {copied ? (
                <>
                  <Check size={17} className="text-emerald-300" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={17} />
                  Copy JSON
                </>
              )}
            </button>

            <button
              type="button"
              onClick={downloadJSON}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/15"
            >
              <Download size={17} />
              Download JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
