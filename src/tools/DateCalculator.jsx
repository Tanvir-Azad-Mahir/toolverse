
import { useState } from "react";
import {
  CalendarDays,
  Calculator,
  Plus,
  Minus,
  Clock3,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

const DAY_MS = 86400000;

const inputClass =
  "w-full rounded-xl border border-white/10 bg-[#0b1422] px-4 py-3.5 text-sm text-white outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10";

function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);

  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatDate(date) {
  if (!date) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timeZone: "UTC",
  }).format(date);
}

export default function DateCalculator() {
  const [mode, setMode] = useState("difference");
  const [startDate, setStartDate] = useState(todayString);
  const [endDate, setEndDate] = useState(todayString);
  const [days, setDays] = useState("30");
  const [operation, setOperation] = useState("add");

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  let result = null;
  let outputDate = null;
  let error = "";

  if (mode === "difference") {
    if (start && end) {
      result = Math.round(
        (end.getTime() - start.getTime()) / DAY_MS
      );
    } else {
      error = "Select two valid dates.";
    }
  } else {
    const count = Number(days);

    if (
      !start ||
      days.trim() === "" ||
      !Number.isSafeInteger(count) ||
      count < 0 ||
      count > 100000
    ) {
      error = "Enter a valid date and 0–100,000 whole days.";
    } else {
      outputDate = new Date(start.getTime());

      outputDate.setUTCDate(
        outputDate.getUTCDate() +
          (operation === "add" ? count : -count)
      );

      if (Number.isNaN(outputDate.getTime())) {
        error = "The resulting date is outside the supported range.";
        outputDate = null;
      }
    }
  }

  function reset() {
    setStartDate(todayString());
    setEndDate(todayString());
    setDays("30");
    setOperation("add");
  }

  return (
    <div className="space-y-7">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <CalendarDays size={22} className="text-cyan-300" />
          Date Calculator
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Calculate date differences and future or past dates.
        </p>
      </div>

      {/* Calculation modes */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          aria-pressed={mode === "difference"}
          onClick={() => setMode("difference")}
          className={`flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-semibold transition ${
            mode === "difference"
              ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-200"
              : "border-white/10 bg-[#0b1422] text-slate-400"
          }`}
        >
          <Calculator size={18} />
          Date difference
        </button>

        <button
          type="button"
          aria-pressed={mode === "add"}
          onClick={() => setMode("add")}
          className={`flex items-center justify-center gap-2 rounded-xl border p-4 text-sm font-semibold transition ${
            mode === "add"
              ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-200"
              : "border-white/10 bg-[#0b1422] text-slate-400"
          }`}
        >
          <Clock3 size={18} />
          Add / subtract
        </button>
      </div>

      {/* Input panel */}
      <div className="space-y-5 rounded-2xl border border-white/10 bg-[#0c1625] p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">
            {mode === "difference"
              ? "Select your dates"
              : "Calculate a new date"}
          </h3>

          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2 text-xs font-medium text-cyan-300"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="block text-xs font-medium text-slate-300">
              {mode === "difference"
                ? "Start date"
                : "Starting date"}
            </span>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </label>

          {mode === "difference" ? (
            <label className="space-y-2">
              <span className="block text-xs font-medium text-slate-300">
                End date
              </span>

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </label>
          ) : (
            <label className="space-y-2">
              <span className="block text-xs font-medium text-slate-300">
                Number of days
              </span>

              <input
                type="number"
                min="0"
                max="100000"
                step="1"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className={inputClass}
              />
            </label>
          )}
        </div>

        {mode === "add" && (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setOperation("add")}
              aria-pressed={operation === "add"}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm ${
                operation === "add"
                  ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                  : "border-white/10 text-slate-400"
              }`}
            >
              <Plus size={17} />
              Add days
            </button>

            <button
              type="button"
              onClick={() => setOperation("subtract")}
              aria-pressed={operation === "subtract"}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm ${
                operation === "subtract"
                  ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                  : "border-white/10 text-slate-400"
              }`}
            >
              <Minus size={17} />
              Subtract days
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-[#112a3d] to-[#0c1726] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {mode === "difference"
            ? "Days between dates"
            : "Calculated date"}
        </p>

        <div aria-live="polite">
          {error ? (
            <p className="mt-5 text-sm text-amber-300">
              {error}
            </p>
          ) : mode === "difference" ? (
            <>
              <p className="mt-4 text-4xl font-extrabold text-cyan-300 sm:text-5xl">
                {Math.abs(result).toLocaleString()}
                <span className="ml-2 text-lg font-medium text-slate-300">
                  days
                </span>
              </p>

              <p className="mt-4 text-sm text-slate-400">
                {result < 0
                  ? "The end date is before the start date."
                  : result === 0
                    ? "Both dates are the same."
                    : "The end date is after the start date."}
              </p>

              <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5 text-xs text-slate-400">
                <span>{formatDate(start)}</span>
                <ArrowRight size={16} className="shrink-0" />
                <span>{formatDate(end)}</span>
              </div>
            </>
          ) : (
            <>
              <p className="mt-4 text-2xl font-bold leading-relaxed text-cyan-300 sm:text-3xl">
                {formatDate(outputDate)}
              </p>

              <p className="mt-3 text-sm text-slate-400">
                {operation === "add" ? "Added" : "Subtracted"}{" "}
                {Number(days).toLocaleString()} calendar days.
              </p>
            </>
          )}
        </div>
      </div>

      <p className="text-center text-xs leading-6 text-slate-500">
        Calculations use calendar dates, not elapsed
        hours. The difference excludes the start date.
      </p>
    </div>
  );
}
