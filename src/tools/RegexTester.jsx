import { useMemo, useState } from "react";

const inputClass =
  "w-full rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#07090E] px-4 py-3 font-mono text-sm text-[#F0FDF4] outline-none transition placeholder:text-[#71857A] focus:border-[#10b981]/60 focus:ring-2 focus:ring-[#10b981]/10";

const panelClass =
  "rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0D111A] p-4 text-sm text-[#D5EBDD]";

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\b\\w+@\\w+\\.\\w+\\b");
  const [flags, setFlags] = useState("gi");
  const [text, setText] = useState("Contact team@example.com and help@toolverse.dev");

  const data = useMemo(() => {
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const matches = [...text.matchAll(re)].slice(0, 500);
      return { matches, error: "" };
    } catch (error) {
      return { matches: [], error: error.message };
    }
  }, [pattern, flags, text]);

  const highlightedText = useMemo(() => {
    if (data.error) return null;
    let position = 0;
    const chunks = [];

    data.matches.forEach((match, index) => {
      if (match.index < position) return;
      chunks.push(text.slice(position, match.index));
      chunks.push(
        <mark
          key={index}
          className="rounded bg-[#10b981]/20 px-0.5 text-[#B6F7CE]"
        >
          {match[0] || "⟨empty⟩"}
        </mark>
      );
      position = match.index + match[0].length;
    });

    chunks.push(text.slice(position));
    return chunks;
  }, [data, text]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#F0FDF4]">Regex Tester</h2>
        <p className="mt-2 text-sm text-[#94a3b8]">
          Test regular expressions and inspect matches in real time.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px]">
        <label className="min-w-0 text-sm font-medium text-[#D5EBDD]">
          Pattern
          <input
            className={`${inputClass} mt-2`}
            value={pattern}
            onChange={(event) => setPattern(event.target.value)}
            spellCheck={false}
          />
        </label>
        <label className="text-sm font-medium text-[#D5EBDD]">
          Flags
          <input
            className={`${inputClass} mt-2`}
            value={flags}
            onChange={(event) => setFlags(event.target.value)}
            placeholder="gi"
            spellCheck={false}
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-[#D5EBDD]">
        Sample text
        <textarea
          className={`${inputClass} mt-2 min-h-40 resize-y`}
          value={text}
          onChange={(event) => setText(event.target.value)}
          spellCheck={false}
        />
      </label>

      {data.error ? (
        <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-300">
          {data.error}
        </p>
      ) : (
        <div className="space-y-4">
          <p aria-live="polite" className="text-sm font-medium text-[#10b981]">
            {data.matches.length} match(es)
            {data.matches.length === 500 ? " (first 500)" : ""}
          </p>

          <div className={`${panelClass} max-h-56 overflow-auto whitespace-pre-wrap break-words leading-7`}>
            {highlightedText}
          </div>

          <div className="space-y-2 text-sm text-[#94a3b8]">
            {data.matches.slice(0, 20).map((match, index) => (
              <p key={index} className="break-words font-mono text-xs leading-6">
                #{index + 1} at {match.index}: {JSON.stringify(match[0])}
                {match.length > 1
                  ? ` • Groups: ${JSON.stringify(match.slice(1))}`
                  : ""}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
