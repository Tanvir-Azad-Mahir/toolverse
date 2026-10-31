import { useState } from "react";
import { Contrast } from "lucide-react";

const surface =
  "rounded-xl border border-[#33443A] bg-[#171F1A] px-4 py-3 text-sm text-[#E3EEE6]";

function luminance(hex) {
  const channels = [1, 3, 5].map((index) =>
    parseInt(hex.slice(index, index + 2), 16) / 255
  );
  const linear = channels.map((value) =>
    value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  );
  return linear.reduce(
    (sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index],
    0
  );
}

export default function ColorContrastChecker() {
  const [fg, setFg] = useState("#F0FDF4");
  const [bg, setBg] = useState("#101210");
  const foregroundLuminance = luminance(fg);
  const backgroundLuminance = luminance(bg);
  const ratio =
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);

  const checks = [
    ["Normal text · AA", 4.5],
    ["Normal text · AAA", 7],
    ["Large text · AA", 3],
    ["Large text · AAA", 4.5],
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#F0FDF4] sm:text-xl">
          <Contrast size={22} className="text-[#86EFAC]" />
          Color Contrast Checker
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#A5B8AB]">
          Compare text and background colors against WCAG contrast thresholds.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "Text color", value: fg, onChange: setFg, id: "contrast-text" },
          { label: "Background color", value: bg, onChange: setBg, id: "contrast-background" },
        ].map(({ label, value, onChange, id }) => (
          <label key={id} htmlFor={id} className="text-sm font-medium text-[#DCE9DF]">
            {label}
            <div className="mt-2 flex min-h-14 items-center gap-3 rounded-xl border border-[#33443A] bg-[#171F1A] px-3 py-2">
              <input
                id={id}
                type="color"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-9 w-11 cursor-pointer rounded-md border-0 bg-transparent"
              />
              <span className="font-mono text-sm uppercase text-[#DCE9DF]">{value}</span>
            </div>
          </label>
        ))}
      </div>

      <div
        className="rounded-2xl border border-[#33443A] p-6 sm:p-8"
        style={{ color: fg, backgroundColor: bg }}
      >
        <h3 className="text-2xl font-bold sm:text-3xl">Sample heading</h3>
        <p className="mt-3 text-sm leading-7 sm:text-base">
          The quick brown fox jumps over the lazy dog.
        </p>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#A5B8AB]">
            Contrast ratio
          </p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-[#F0FDF4]">
            {ratio.toFixed(2)}:1
          </p>
        </div>
        <span className="text-xs text-[#A5B8AB]">WCAG 2.x contrast criteria</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {checks.map(([label, threshold]) => {
          const passes = ratio >= threshold;
          return (
            <div key={label} className={`${surface} flex items-center justify-between gap-3`}>
              <span>{label}</span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  passes
                    ? "bg-[#86EFAC]/10 text-[#86EFAC]"
                    : "bg-red-400/10 text-red-300"
                }`}
              >
                {passes ? "Pass" : "Fail"}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-xs leading-6 text-[#A5B8AB]">
        WCAG AA requires at least 4.5:1 for normal text and 3:1 for large text.
        Contrast alone does not guarantee complete accessibility.
      </p>
    </div>
  );
}
