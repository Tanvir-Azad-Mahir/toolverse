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
      await navigator.clipboard.writeText(uuids.join("\n"));
      setCopied(true);
      setError("");
    } catch {
      setError("Clipboard access failed.");
    }
  }

  function download() {
    if (!uuids.length) return;

    const blob = new Blob([uuids.join("\n")], {
      type: "text/plain;charset=utf-8",
    });

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
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#F0FDF4]">
          <Fingerprint size={22} className="text-[#86EFAC]" />
          UUID Generator
        </h2>

        <p className="mt-2 text-sm text-[#94A3A0]">
          Generate random UUID version 4 identifiers instantly.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border border-[#304038] bg-[#1B2420] p-5 sm:p-6">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-[#C6D6CC]">
            Number of UUIDs
          </span>

          <select
            value={count}
            onChange={(event) => {
              setCount(Number(event.target.value));
              setUuids([]);
              setCopied(false);
            }}
            className="w-full rounded-xl border border-[#304038] bg-[#101210] px-4 py-3 text-sm text-[#F0FDF4] outline-none transition focus:border-[#86EFAC]/60 focus:ring-2 focus:ring-[#86EFAC]/10"
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
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#86EFAC] px-5 py-3.5 text-sm font-bold text-[#101210] transition hover:bg-[#A7F3C3]"
        >
          <RefreshCw size={17} />
          Generate UUIDs
        </button>
      </div>

      {uuids.length > 0 && (
        <div className="space-y-4 rounded-2xl border border-[#86EFAC]/20 bg-[#1B2420] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-[#F0FDF4]">
              Generated identifiers
            </h3>
            <span className="text-xs text-[#94A3A0]">
              {uuids.length} UUIDs
            </span>
          </div>

          <div className="max-h-[350px] space-y-2 overflow-auto rounded-xl border border-[#304038] bg-[#101210] p-3">
            {uuids.map((uuid, index) => (
              <div
                key={`${index}-${uuid}`}
                className="flex items-start gap-3 rounded-lg border border-[#304038]/70 p-3"
              >
                <span className="text-xs text-[#94A3A0]">
                  {index + 1}.
                </span>
                <code className="break-all text-xs leading-6 text-[#C1F7D1] sm:text-sm">
                  {uuid}
                </code>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={copyAll}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#86EFAC] px-5 py-3 text-sm font-bold text-[#101210] transition hover:bg-[#A7F3C3]"
            >
              {copied ? <Check size={17} /> : <Copy size={17} />}
              {copied ? "Copied" : "Copy all"}
            </button>

            <button
              type="button"
              onClick={download}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#86EFAC]/25 bg-[#86EFAC]/10 px-5 py-3 text-sm font-semibold text-[#86EFAC] transition hover:bg-[#86EFAC]/15"
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

      <p className="flex items-start gap-2 text-xs leading-6 text-[#94A3A0]">
        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#86EFAC]" />
        UUIDs are generated locally using crypto.randomUUID().
        They are suitable as identifiers, not as passwords or secrets.
      </p>
    </div>
  );
}
