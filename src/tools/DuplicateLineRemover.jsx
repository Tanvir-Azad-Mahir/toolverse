import { useMemo, useState } from "react";
import { Check, Copy, ListFilter } from "lucide-react";

const editorClass =
  "min-h-56 w-full resize-y rounded-xl border border-white/10 bg-[#101712] px-4 py-3 font-mono text-sm leading-7 text-[#F0FDF4] outline-none transition-colors focus:border-[#86EFAC]/60 focus:ring-0 placeholder:text-[#768B7D]";

export default function DuplicateLineRemover() {
  const [value, setValue] = useState("apple\nbanana\napple\ncherry\nbanana");
  const [trim, setTrim] = useState(true);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(false);
  const [copied, setCopied] = useState(false);

  const { output, removed } = useMemo(() => {
    if (!value) return { output: "", removed: 0 };
    const lines = value.split(/\r?\n/);
    const seen = new Set();
    const unique = lines.filter((line) => {
      const normalized = trim ? line.trim() : line;
      const key = caseSensitive ? normalized : normalized.toLowerCase();
      if (removeEmpty && !normalized) return false;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return { output: unique.join("\n"), removed: lines.length - unique.length };
  }, [value, trim, caseSensitive, removeEmpty]);

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function updateValue(nextValue) {
    setValue(nextValue);
    setCopied(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#F0FDF4] sm:text-xl">
          <ListFilter size={21} className="text-[#86EFAC]" />
          Duplicate Line Remover
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#A5B8AB]">
          Remove repeated lines while preserving their first occurrence and original order.
        </p>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3 rounded-xl border border-white/10 bg-[#1B2420] p-4 text-sm text-[#D5EBDD]">
        {[
          ["Trim whitespace", trim, setTrim],
          ["Case sensitive", caseSensitive, setCaseSensitive],
          ["Remove blank lines", removeEmpty, setRemoveEmpty],
        ].map(([label, checked, setChecked]) => (
          <label key={label} className="inline-flex cursor-pointer items-center gap-2.5">
            <input
              type="checkbox"
              checked={checked}
              onChange={(event) => {
                setChecked(event.target.checked);
                setCopied(false);
              }}
              className="h-4 w-4 accent-[#86EFAC]"
            />
            {label}
          </label>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="dedupe-input" className="block text-sm font-semibold text-[#D5EBDD]">
            Input lines
          </label>
          <textarea
            id="dedupe-input"
            className={editorClass}
            spellCheck={false}
            value={value}
            onChange={(event) => updateValue(event.target.value)}
            placeholder="Paste lines here..."
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="dedupe-output" className="block text-sm font-semibold text-[#D5EBDD]">
            Cleaned output
          </label>
          <textarea
            id="dedupe-output"
            className={editorClass}
            spellCheck={false}
            readOnly
            value={output}
            placeholder="Unique lines will appear here..."
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#A5B8AB]" aria-live="polite">
          <span className="font-semibold text-[#86EFAC]">{removed}</span> {removed === 1 ? "line" : "lines"} removed
        </p>
        <button
          type="button"
          onClick={copyOutput}
          disabled={!output}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#86EFAC] px-5 py-3 text-sm font-bold text-[#101210] transition-colors hover:bg-[#A7F3C0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86EFAC] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copied ? <Check size={17} /> : <Copy size={17} />}
          {copied ? "Copied" : "Copy output"}
        </button>
      </div>
    </div>
  );
}
