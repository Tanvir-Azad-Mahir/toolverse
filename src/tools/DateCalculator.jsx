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
  "w-full min-w-0 rounded-xl border border-[#34443A] bg-[#101710] px-4 py-3.5 text-sm text-[#F0FDF4] outline-none transition-colors focus:border-[#10b981]/60 focus:ring-2 focus:ring-[#10b981]/10";

function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(0, 0, 0, 0);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) return null;

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
      result = Math.round((end.getTime() - start.getTime()) / DAY_MS);
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
        outputDate.getUTCDate() + (operation === "add" ? count : -count)
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

  const activeClass = "border-[#10b981]/45 bg-[#10b981]/10 text-[#B7F7CD]";
  const inactiveClass = "border-[#34443A] bg-[#151C18] text-[#A5B8AB] hover:border-[#536A5A] hover:text-[#F0FDF4]";

  return (
    <div className="space-y-7 text-[#F0FDF4]">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <CalendarDays size={22} className="text-[#10b981]" />
          Date Calculator
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#A5B8AB]">
          Calculate date differences and future or past dates.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <button
          type="button"
          aria-pressed={mode === "difference"}
          onClick={() => setMode("difference")}
          className={`flex min-w-0 items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-colors sm:p-4 sm:text-sm ${mode === "difference" ? activeClass : inactiveClass}`}
        >
          <Calculator size={18} className="shrink-0" />
          Date difference
        </button>
        <button
          type="button"
          aria-pressed={mode === "add"}
          onClick={() => setMode("add")}
          className={`flex min-w-0 items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-colors sm:p-4 sm:text-sm ${mode === "add" ? activeClass : inactiveClass}`}
        >
          <Clock3 size={18} className="shrink-0" />
          Add / subtract
        </button>
      </div>

      <div className="space-y-5 rounded-2xl border border-[#34443A] bg-[#0D111A] p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold">
            {mode === "difference" ? "Select your dates" : "Calculate a new date"}
          </h3>
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2 rounded-lg text-xs font-medium text-[#10b981] hover:text-[#C6FBD8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#10b981]"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="min-w-0 space-y-2">
            <span className="block text-xs font-medium text-[#C6D8CA]">
              {mode === "difference" ? "Start date" : "Starting date"}
            </span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputClass}
            />
          </label>
          {mode === "difference" ? (
            <label className="min-w-0 space-y-2">
              <span className="block text-xs font-medium text-[#C6D8CA]">End date</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className={inputClass}
              />
            </label>
          ) : (
            <label className="min-w-0 space-y-2">
              <span className="block text-xs font-medium text-[#C6D8CA]">Number of days</span>
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
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setOperation("add")}
              aria-pressed={operation === "add"}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-medium transition-colors sm:text-sm ${operation === "add" ? activeClass : inactiveClass}`}
            >
              <Plus size={17} /> Add days
            </button>
            <button
              type="button"
              onClick={() => setOperation("subtract")}
              aria-pressed={operation === "subtract"}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-medium transition-colors sm:text-sm ${operation === "subtract" ? activeClass : inactiveClass}`}
            >
              <Minus size={17} /> Subtract days
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#10b981]/20 bg-[#17241B] p-5 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#A5B8AB]">
          {mode === "difference" ? "Days between dates" : "Calculated date"}
        </p>
        <div aria-live="polite">
          {error ? (
            <p className="mt-5 text-sm text-amber-300">{error}</p>
          ) : mode === "difference" ? (
            <>
              <p className="mt-4 text-4xl font-extrabold text-[#10b981] sm:text-5xl">
                {Math.abs(result).toLocaleString()}
                <span className="ml-2 text-lg font-medium text-[#C6D8CA]">days</span>
              </p>
              <p className="mt-4 text-sm text-[#A5B8AB]">
                {result < 0
                  ? "The end date is before the start date."
                  : result === 0
                    ? "Both dates are the same."
                    : "The end date is after the start date."}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#34443A] pt-5 text-xs text-[#A5B8AB]">
                <span>{formatDate(start)}</span>
                <ArrowRight size={16} className="shrink-0 text-[#10b981]" />
                <span>{formatDate(end)}</span>
              </div>
            </>
          ) : (
            <>
              <p className="mt-4 break-words text-2xl font-bold leading-relaxed text-[#10b981] sm:text-3xl">
                {formatDate(outputDate)}
              </p>
              <p className="mt-3 text-sm text-[#A5B8AB]">
                {operation === "add" ? "Added" : "Subtracted"}{" "}
                {Number(days).toLocaleString()} calendar days.
              </p>
            </>
          )}
        </div>
      </div>

      <p className="text-center text-xs leading-6 text-[#94a3b8]">
        Calculations use calendar dates, not elapsed hours. The difference excludes the start date.
      </p>
    </div>
  );
}
