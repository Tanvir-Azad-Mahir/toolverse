import { useMemo, useState } from "react";
import { Check, Copy, Download, Table2 } from "lucide-react";

const fieldClass =
  "mt-2 min-h-52 w-full resize-y rounded-xl border border-white/10 bg-[#101610] px-4 py-3 font-mono text-sm leading-6 text-[#F0FDF4] outline-none transition-colors placeholder:text-[#81958A] focus:border-[#10b981]/60 focus:ring-0";

const panelClass =
  "max-h-72 overflow-auto whitespace-pre-wrap break-words rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#101610] p-4 font-mono text-sm leading-6 text-[#D5EBDD]";

function downloadCSV(content) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "toolverse.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      disabled={!text}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#202B24] px-5 py-3 text-sm font-semibold text-[#E0F2E5] transition-colors hover:border-[#10b981]/40 hover:bg-[#2A372E] disabled:cursor-not-allowed disabled:opacity-40"
    >
      {copied ? <Check size={17} /> : <Copy size={17} />}
      {copied ? "Copied" : "Copy CSV"}
    </button>
  );
}

export default function JSONToCSV() {
  const [value, setValue] = useState(
    '[{"name":"ToolVerse","count":12},{"name":"Tools","count":22}]'
  );

  const parsed = useMemo(() => {
    try {
      const rows = JSON.parse(value);
      if (!Array.isArray(rows) || !rows.every((row) => row && typeof row === "object" && !Array.isArray(row))) {
        throw new Error("Expected an array of objects");
      }

      const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
      const escapeCell = (cell) =>
        `"${String(cell == null ? "" : typeof cell === "object" ? JSON.stringify(cell) : cell).replaceAll('"', '""')}"`;

      const csv = [
        columns.map(escapeCell).join(","),
        ...rows.map((row) => columns.map((column) => escapeCell(row[column])).join(",")),
      ].join("\r\n");

      return { csv, error: "", rows: rows.length };
    } catch (error) {
      return { csv: "", error: error.message, rows: 0 };
    }
  }, [value]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#F0FDF4] sm:text-xl">
          <Table2 size={21} className="text-[#10b981]" />
          JSON to CSV Converter
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#A5B8AB]">
          Convert an array of JSON objects into a downloadable CSV file, directly in your browser.
        </p>
      </div>

      <label className="block text-sm font-semibold text-[#E0F2E5]">
        JSON array
        <textarea
          className={fieldClass}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          spellCheck={false}
          placeholder='[{"name":"Example"}]'
        />
      </label>

      <div aria-live="polite">
        {parsed.error ? (
          <p role="alert" className="text-sm text-red-300">{parsed.error}</p>
        ) : (
          <p className="text-sm text-[#10b981]">{parsed.rows} row(s) ready</p>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-[#E0F2E5]">CSV preview</h3>
        <pre className={panelClass}>{parsed.csv || "No CSV output yet."}</pre>
      </div>

      <div className="flex flex-wrap gap-3">
        <CopyButton text={parsed.csv} />
        <button
          type="button"
          disabled={!parsed.csv}
          onClick={() => downloadCSV(parsed.csv)}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#10b981] px-5 py-3 text-sm font-bold text-[#07090E] transition-colors hover:bg-[#A3F5BD] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={17} />
          Download CSV
        </button>
      </div>
    </div>
  );
}
