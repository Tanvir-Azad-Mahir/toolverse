
import { useState } from "react";
import {
  Calculator,
  Percent,
  TrendingUp,
  BadgePercent,
  ArrowRightLeft,
  RotateCcw,
  CheckCircle2,
  Info,
} from "lucide-react";

const modes = [
  {
    id: "of",
    label: "Percentage of a number",
    short: "X% of Y",
    icon: Percent,
    firstLabel: "Percentage (X)",
    secondLabel: "Number (Y)",
    explanation: "Calculate a percentage of any number.",
  },
  {
    id: "what",
    label: "Find the percentage",
    short: "X is what % of Y?",
    icon: Calculator,
    firstLabel: "Value (X)",
    secondLabel: "Total (Y)",
    explanation: "Find what percentage one value represents of another.",
  },
  {
    id: "change",
    label: "Percentage change",
    short: "Increase / decrease",
    icon: TrendingUp,
    firstLabel: "Original value",
    secondLabel: "New value",
    explanation: "Calculate the percentage increase or decrease.",
  },
  {
    id: "discount",
    label: "Discount calculator",
    short: "Price after discount",
    icon: BadgePercent,
    firstLabel: "Discount (%)",
    secondLabel: "Original price",
    explanation: "Calculate the final price after a discount.",
  },
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0b1422] px-4 py-3.5 text-base font-medium text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10";

function parseNumber(value) {
  if (String(value).trim() === "") return null;

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function formatNumber(value, suffix = "") {
  if (value === null || !Number.isFinite(value)) {
    return "—";
  }

  return `${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 6,
  }).format(value)}${suffix}`;
}

function calculate(mode, x, y) {
  if (x === null || y === null) {
    return { result: null, error: "Enter both values to calculate." };
  }

  switch (mode) {
    case "of":
      return { result: (x / 100) * y, error: "" };

    case "what":
      return y === 0
        ? { result: null, error: "The total cannot be zero." }
        : { result: (x / y) * 100, error: "" };

    case "change":
      return x === 0
        ? { result: null, error: "The original value cannot be zero." }
        : {
            result: ((y - x) / Math.abs(x)) * 100,
            error: "",
          };

    case "discount":
      return x < 0 || x > 100
        ? {
            result: null,
            error: "Enter a discount between 0% and 100%.",
          }
        : { result: y * (1 - x / 100), error: "" };

    default:
      return { result: null, error: "Invalid calculation." };
  }
}

export default function PercentageCalculator() {
  const [mode, setMode] = useState("of");
  const [a, setA] = useState("20");
  const [b, setB] = useState("150");

  const selectedMode = modes.find((item) => item.id === mode);
  const x = parseNumber(a);
  const y = parseNumber(b);

  const { result, error } = calculate(mode, x, y);
  const validResult = result !== null && Number.isFinite(result);

  const isPercentResult = mode === "what" || mode === "change";

  const savings =
    mode === "discount" && validResult && y !== null
      ? y - result
      : null;

  const calculationLabel = {
    of: "Calculated amount",
    what: "Percentage",
    change: "Percentage change",
    discount: "Final price",
  }[mode];

  function reset() {
    setMode("of");
    setA("20");
    setB("150");
  }

  function swapValues() {
    setA(b);
    setB(a);
  }

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2.5 text-lg font-bold text-white sm:text-xl">
            <Calculator size={22} className="text-cyan-300" />
            Percentage Workspace
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Calculate percentages, discounts, and changes instantly.
          </p>
        </div>

        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200">
          Instant results
        </span>
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {modes.map((item) => {
          const Icon = item.icon;
          const selected = mode === item.id;

          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setMode(item.id)}
              className={`flex min-h-[110px] flex-col items-start justify-between gap-3 rounded-2xl border p-4 text-left transition duration-200 ${
                selected
                  ? "border-cyan-400/50 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,0.06)]"
                  : "border-white/10 bg-[#0b1422] hover:border-white/25 hover:bg-white/[0.04]"
              }`}
            >
              <Icon
                size={21}
                className={
                  selected ? "text-cyan-300" : "text-slate-400"
                }
              />

              <span
                className={`text-xs font-semibold leading-5 ${
                  selected ? "text-white" : "text-slate-300"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Calculator panel */}
      <div className="space-y-6 rounded-2xl border border-white/10 bg-[#0c1625] p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">
              {selectedMode.short}
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              {selectedMode.explanation}
            </p>
          </div>

          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300 transition hover:text-white"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <label className="block min-w-0">
            <span className="mb-2 block text-xs font-semibold text-slate-300">
              {selectedMode.firstLabel}
            </span>
            <input
              type="number"
              step="any"
              value={a}
              onChange={(event) => setA(event.target.value)}
              placeholder="Enter first value"
              className={inputClass}
            />
          </label>

          <button
            type="button"
            onClick={swapValues}
            aria-label="Swap entered values"
            title="Swap values"
            className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-cyan-400/30 hover:text-cyan-300"
          >
            <ArrowRightLeft size={18} />
          </button>

          <label className="block min-w-0">
            <span className="mb-2 block text-xs font-semibold text-slate-300">
              {selectedMode.secondLabel}
            </span>
            <input
              type="number"
              step="any"
              value={b}
              onChange={(event) => setB(event.target.value)}
              placeholder="Enter second value"
              className={inputClass}
            />
          </label>
        </div>

        {error && (
          <p
            role="status"
            className="flex items-center gap-2 text-xs text-amber-300"
          >
            <Info size={15} />
            {error}
          </p>
        )}
      </div>

      {/* Result panel */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-[#112a3d] via-[#101f33] to-[#0c1726] p-6 sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl"
        />

        <div className="relative">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              {calculationLabel}
            </span>

            {validResult && (
              <CheckCircle2
                size={20}
                className="text-emerald-300"
              />
            )}
          </div>

          <div
            aria-live="polite"
            className="mt-5 break-all text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            {formatNumber(
              validResult ? result : null,
              isPercentResult ? "%" : ""
            )}
          </div>

          {mode === "change" && validResult && (
            <p
              className={`mt-3 text-sm font-semibold ${
                result > 0
                  ? "text-emerald-300"
                  : result < 0
                    ? "text-red-300"
                    : "text-slate-300"
              }`}
            >
              {result > 0
                ? "Percentage increase"
                : result < 0
                  ? "Percentage decrease"
                  : "No change"}
            </p>
          )}

          {mode === "discount" && savings !== null && (
            <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
              <span className="text-sm text-slate-400">
                Amount saved
              </span>
              <span className="text-lg font-bold text-emerald-300">
                {formatNumber(savings)}
              </span>
            </div>
          )}

          {mode === "of" && validResult && (
            <p className="mt-4 text-sm text-slate-400">
              {formatNumber(x)}% of {formatNumber(y)} ={" "}
              <span className="font-semibold text-cyan-200">
                {formatNumber(result)}
              </span>
            </p>
          )}

          {mode === "what" && validResult && (
            <p className="mt-4 text-sm text-slate-400">
              {formatNumber(x)} is{" "}
              <span className="font-semibold text-cyan-200">
                {formatNumber(result, "%")}
              </span>{" "}
              of {formatNumber(y)}.
            </p>
          )}
        </div>
      </div>

      {/* Information */}
      <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
        <Info
          size={18}
          className="mt-0.5 shrink-0 text-cyan-300"
        />
        <p className="text-xs leading-6 text-slate-400">
          Results update automatically as you type.
          Calculations run locally in your browser,
          without sending your numbers to a server.
        </p>
      </div>
    </div>
  );
}
