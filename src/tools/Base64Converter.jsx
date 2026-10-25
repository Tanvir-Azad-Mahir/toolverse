
import { useState } from "react";
import {
  Binary,
  Copy,
  Check,
  ArrowRightLeft,
  Trash2,
  AlertCircle,
} from "lucide-react";

function encodeBase64(text) {
  const bytes = new TextEncoder().encode(text);

  let binary = "";

  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(
      ...bytes.subarray(i, i + 8192)
    );
  }

  return btoa(binary);
}

function decodeBase64(text) {
  const normalized = text.replace(/\s/g, "");
  const binary = atob(normalized);
  const bytes = Uint8Array.from(
    binary,
    (char) => char.charCodeAt(0)
  );

  return new TextDecoder(
    "utf-8",
    { fatal: true }
  ).decode(bytes);
}

export default function Base64Converter() {
  const [mode, setMode] = useState("encode");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  let output = "";
  let error = "";

  if (input) {
    try {
      output = mode === "encode"
        ? encodeBase64(input)
        : decodeBase64(input);
    } catch {
      error = mode === "decode"
        ? "Invalid Base64 input or invalid UTF-8 text."
        : "Unable to encode this text.";
    }
  }

  async function copyResult() {
    if (!output) return;

    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function changeMode(next) {
    setMode(next);
    setCopied(false);
  }

  function swap() {
    if (error) return;

    setInput(output);
    setMode(mode === "encode" ? "decode" : "encode");
    setCopied(false);
  }

  return (
    <div className="space-y-7">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <Binary size={23} className="text-cyan-300" />
          Base64 Converter
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Encode and decode Base64 text with UTF-8 support.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-[#0b1422] p-1.5">
        {[
          { id: "encode", label: "Encode" },
          { id: "decode", label: "Decode" },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => changeMode(option.id)}
            aria-pressed={mode === option.id}
            className={`rounded-lg px-4 py-3 text-sm font-semibold transition ${
              mode === option.id
                ? "bg-cyan-400/15 text-cyan-200"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <label
          htmlFor="base64-input"
          className="text-sm font-semibold text-slate-200"
        >
          {mode === "encode" ? "Input text" : "Base64 input"}
        </label>

        <textarea
          id="base64-input"
          value={input}
          rows={7}
          onChange={(event) => {
            setInput(event.target.value);
            setCopied(false);
          }}
          placeholder={
            mode === "encode"
              ? "Type or paste text here..."
              : "Paste Base64 encoded text..."
          }
          spellCheck={false}
          className="w-full resize-y rounded-xl border border-white/10 bg-[#080f1c] p-4 font-mono text-sm leading-7 text-white outline-none focus:border-cyan-400/50"
        />
      </div>

      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={swap}
          disabled={!input || !!error}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:text-cyan-300 disabled:opacity-40"
        >
          <ArrowRightLeft size={16} />
          Swap input and output
        </button>
      </div>

      <div className="space-y-3">
        <label
          htmlFor="base64-output"
          className="text-sm font-semibold text-slate-200"
        >
          Converted output
        </label>

        <textarea
          id="base64-output"
          value={output}
          readOnly
          rows={7}
          placeholder="Your output will appear here..."
          className="w-full resize-y rounded-xl border border-cyan-400/15 bg-[#0c1725] p-4 font-mono text-sm leading-7 text-cyan-100 outline-none"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-300"
        >
          <AlertCircle size={17} className="shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={copyResult}
          disabled={!output}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 text-sm font-bold text-slate-950 disabled:opacity-40"
        >
          {copied ? <Check size={17} /> : <Copy size={17} />}
          {copied ? "Copied" : "Copy output"}
        </button>

        <button
          type="button"
          onClick={() => {
            setInput("");
            setCopied(false);
          }}
          disabled={!input}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-semibold text-slate-300 disabled:opacity-40"
        >
          <Trash2 size={17} />
          Clear
        </button>
      </div>

      <p className="text-center text-xs leading-6 text-slate-500">
        All conversions happen in your browser.
        Base64 is an encoding format, not encryption.
      </p>
    </div>
  );
}
