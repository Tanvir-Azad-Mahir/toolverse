import { useState } from "react";
import { Check, Copy, Palette } from "lucide-react";

export default function CSSGradientGenerator() {
  const [start, setStart] = useState("#10b981");
  const [end, setEnd] = useState("#356b50");
  const [angle, setAngle] = useState(120);
  const [copied, setCopied] = useState(false);

  const gradient = `linear-gradient(${angle}deg, ${start}, ${end})`;
  const css = `background: ${gradient};`;

  async function copyCSS() {
    try {
      await navigator.clipboard.writeText(css);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  function updateColor(setter, value) {
    setter(value);
    setCopied(false);
  }

  return (
    <div className="space-y-6 text-[#F0FDF4]">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
          <Palette size={21} className="text-[#10b981]" />
          CSS Gradient Generator
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#A5B8AB]">
          Create a custom two-color gradient and copy its CSS.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Start color", value: start, change: setStart },
          { label: "End color", value: end, change: setEnd },
        ].map(({ label, value, change }) => (
          <label key={label} className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0D111A] p-4 text-sm font-medium">
            {label}
            <span className="mt-3 flex items-center gap-3">
              <input
                type="color"
                value={value}
                onChange={(event) => updateColor(change, event.target.value)}
                className="h-10 w-12 cursor-pointer rounded-md border border-[rgba(255,255,255,0.1)] bg-transparent p-1"
                aria-label={label}
              />
              <code className="text-xs text-[#A5B8AB]">{value.toUpperCase()}</code>
            </span>
          </label>
        ))}

        <label className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#0D111A] p-4 text-sm font-medium">
          <span className="flex items-center justify-between gap-2">
            Angle <span className="font-mono text-[#10b981]">{angle}°</span>
          </span>
          <input
            type="range"
            min="0"
            max="360"
            value={angle}
            onChange={(event) => {
              setAngle(Number(event.target.value));
              setCopied(false);
            }}
            className="mt-5 w-full accent-[#10b981]"
            aria-label="Gradient angle"
          />
        </label>
      </div>

      <div
        className="h-52 w-full rounded-2xl border border-[rgba(255,255,255,0.1)] sm:h-64"
        style={{ background: gradient }}
        role="img"
        aria-label={`Gradient preview from ${start} to ${end} at ${angle} degrees`}
      />

      <div className="space-y-3">
        <label htmlFor="gradient-css" className="text-sm font-semibold text-[#F0FDF4]">
          Generated CSS
        </label>
        <pre id="gradient-css" className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#07090E] p-4 font-mono text-sm leading-6 text-[#D5EBDD]">
          <code>{css}</code>
        </pre>
        <button
          type="button"
          onClick={copyCSS}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#10b981] px-5 py-3 text-sm font-bold text-[#07090E] transition-colors hover:bg-[#A7F3C2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
        >
          {copied ? <Check size={17} /> : <Copy size={17} />}
          {copied ? "Copied CSS" : "Copy CSS"}
        </button>
      </div>
    </div>
  );
}
