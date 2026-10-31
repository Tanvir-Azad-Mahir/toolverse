import { useMemo, useState } from "react";
import { Copy, Check, Link2, AlertCircle } from "lucide-react";

const inputClass =
  "w-full min-h-40 resize-y rounded-xl border border-[#304038] bg-[#101210] px-4 py-3 font-mono text-sm leading-7 text-[#F0FDF4] outline-none transition placeholder:text-[#718579] focus:border-[#86EFAC]/60 focus-visible:ring-2 focus-visible:ring-[#86EFAC]/15";

export default function URLEncoderDecoder() {
  const [value, setValue] = useState("hello world & more");
  const [mode, setMode] = useState("encode");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    try {
      return {
        text: mode === "encode" ? encodeURIComponent(value) : decodeURIComponent(value),
        error: "",
      };
    } catch (error) {
      return { text: "", error: error.message };
    }
  }, [value, mode]);

  async function copyResult() {
    if (!result.text) return;
    try {
      await navigator.clipboard.writeText(result.text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#F0FDF4] sm:text-xl">
          <Link2 size={21} className="text-[#86EFAC]" />
          URL Encoder / Decoder
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#94A3A0]">
          Encode or decode URL components locally in your browser.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-[#304038] bg-[#1B2420] p-1.5">
        {["encode", "decode"].map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={mode === option}
            onClick={() => {
              setMode(option);
              setCopied(false);
            }}
            className={`rounded-lg px-4 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86EFAC] ${
              mode === option
                ? "bg-[#86EFAC]/15 text-[#86EFAC]"
                : "text-[#94A3A0] hover:bg-white/5 hover:text-[#F0FDF4]"
            }`}
          >
            {option === "encode" ? "Encode" : "Decode"}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label htmlFor="url-codec-input" className="block text-sm font-semibold text-[#D5EBDD]">
          Input text
        </label>
        <textarea
          id="url-codec-input"
          className={inputClass}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setCopied(false);
          }}
          placeholder="Enter text"
          spellCheck={false}
        />
      </div>

      {result.error && (
        <p role="alert" className="flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/[0.06] p-3 text-sm text-red-300">
          <AlertCircle size={17} className="mt-0.5 shrink-0" />
          {result.error}
        </p>
      )}

      <div className="space-y-2">
        <label htmlFor="url-codec-output" className="block text-sm font-semibold text-[#D5EBDD]">
          {mode === "encode" ? "Encoded output" : "Decoded output"}
        </label>
        <pre
          id="url-codec-output"
          aria-live="polite"
          className="min-h-28 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-[#365243] bg-[#171F1A] p-4 font-mono text-sm leading-7 text-[#D5EBDD]"
        >
          {result.text}
        </pre>
      </div>

      <button
        type="button"
        onClick={copyResult}
        disabled={!result.text}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#86EFAC] px-5 py-3 text-sm font-bold text-[#101C14] transition hover:bg-[#A7F3C0] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        {copied ? <Check size={17} /> : <Copy size={17} />}
        {copied ? "Copied" : "Copy output"}
      </button>
    </div>
  );
}
