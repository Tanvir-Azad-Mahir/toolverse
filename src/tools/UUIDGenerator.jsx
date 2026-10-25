
import { useState } from "react";
import {
  Fingerprint,
  RefreshCw,
  Copy,
  Check,
  Download,
  ShieldCheck,
} from "lucide-react";

export default function UUIDGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  function generate() {
    try {
      const result = Array.from(
        { length: count },
        () => crypto.randomUUID()
      );

      setUuids(result);
      setCopied(false);
      setError("");
    } catch {
      setError("UUID generation is unavailable in this browser.");
    }
  }

  async function copyAll() {
    if (!uuids.length) return;

    try {
      await navigator.clipboard.writeText(
        uuids.join("\n")
      );
      setCopied(true);
      setError("");
    } catch {
      setError("Clipboard access failed.");
    }
  }

  function download() {
    if (!uuids.length) return;

    const blob = new Blob(
      [uuids.join("\n")],
      { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "toolverse-uuids.txt";

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <div className="space-y-7">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <Fingerprint size={22} className="text-cyan-300" />
          UUID Generator
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Generate random UUID version 4 identifiers instantly.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border border-white/10 bg-[#0c1625] p-5 sm:p-6">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-300">
            Number of UUIDs
          </span>

          <select
            value={count}
            onChange={(event) => {
              setCount(Number(event.target.value));
              setUuids([]);
              setCopied(false);
            }}
            className="w-full rounded-xl border border-white/10 bg-[#0b1422] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
          >
            {[1, 5, 10, 25, 50, 100].map((value) => (
              <option key={value} value={value}>
                {value} UUID{value > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={generate}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:brightness-110"
        >
          <RefreshCw size={17} />
          Generate UUIDs
        </button>
      </div>

      {uuids.length > 0 && (
        <div className="space-y-4 rounded-2xl border border-cyan-400/20 bg-[#0c1726] p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">
              Generated identifiers
            </h3>

            <span className="text-xs text-slate-400">
              {uuids.length} UUIDs
            </span>
          </div>

          <div className="max-h-[350px] space-y-2 overflow-auto rounded-xl border border-white/10 bg-[#080f1c] p-3">
            {uuids.map((uuid, index) => (
              <div
                key={`${index}-${uuid}`}
                className="flex items-start gap-3 rounded-lg border border-white/[0.05] p-3"
              >
                <span className="text-xs text-slate-500">
                  {index + 1}.
                </span>
                <code className="break-all text-xs leading-6 text-cyan-200 sm:text-sm">
                  {uuid}
                </code>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={copyAll}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3 text-sm font-bold text-slate-950"
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? "Copied" : "Copy all"}
            </button>

            <button
              type="button"
              onClick={download}
              className="flex items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200"
            >
              <Download size={17} />
              Download TXT
            </button>
          </div>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      <p className="flex items-start gap-2 text-xs leading-6 text-slate-500">
        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-cyan-300" />
        UUIDs are generated locally using crypto.randomUUID().
        They are suitable as identifiers, not as passwords or secrets.
      </p>
    </div>
  );
}
