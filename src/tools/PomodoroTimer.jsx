import { useEffect, useRef, useState } from "react";

const inputClass =
  "mt-2 w-full rounded-xl border border-[#304038] bg-[#101210] px-4 py-3 font-mono text-sm text-[#F0FDF4] outline-none transition focus:border-[#86EFAC] focus-visible:ring-2 focus-visible:ring-[#86EFAC]/20";
const primaryButton =
  "rounded-xl bg-[#86EFAC] px-5 py-3 text-sm font-semibold text-[#101210] transition hover:bg-[#A7F3C2] disabled:opacity-40";
const secondaryButton =
  "rounded-xl border border-[#304038] bg-[#1B2420] px-4 py-3 text-sm font-semibold text-[#D5EBDD] transition hover:border-[#86EFAC]/40 hover:bg-[#24342B]";

export default function PomodoroTimer() {
  const [work, setWork] = useState(25);
  const [rest, setRest] = useState(5);
  const [phase, setPhase] = useState("Work");
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const deadline = useRef(null);

  useEffect(() => {
    if (!running) return;
    deadline.current = Date.now() + remaining * 1000;
    const tick = () => {
      setRemaining(Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000)));
    };
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (remaining !== 0 || !running) return;
    setRunning(false);
    const next = phase === "Work" ? "Break" : "Work";
    setPhase(next);
    setRemaining((next === "Work" ? work : rest) * 60);
  }, [remaining, running, phase, work, rest]);

  function reset() {
    setRunning(false);
    setPhase("Work");
    setRemaining(work * 60);
  }

  function skip() {
    setRunning(false);
    const next = phase === "Work" ? "Break" : "Work";
    setPhase(next);
    setRemaining((next === "Work" ? work : rest) * 60);
  }

  return (
    <div className="space-y-6 text-center text-[#F0FDF4]">
      <div>
        <h2 className="text-xl font-bold">Pomodoro Timer</h2>
        <p className="mt-2 text-sm text-[#94A3A0]">
          Alternate focused work with short breaks.
        </p>
      </div>

      <div className="rounded-2xl border border-[#304038] bg-[#1B2420] px-5 py-8 sm:px-8">
        <p className="mb-4 text-sm font-semibold text-[#86EFAC]">{phase} session</p>
        <div role="timer" className="font-mono text-5xl font-bold tracking-tight tabular-nums sm:text-6xl">
          {String(Math.floor(remaining / 60)).padStart(2, "0")}:
          {String(remaining % 60).padStart(2, "0")}
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" className={primaryButton} onClick={() => setRunning((value) => !value)}>
            {running ? "Pause" : "Start"}
          </button>
          <button type="button" className={secondaryButton} onClick={reset}>Reset</button>
          <button type="button" className={secondaryButton} onClick={skip}>Skip</button>
        </div>
      </div>

      <div className="mx-auto grid max-w-sm grid-cols-2 gap-3 text-left">
        {[
          ["Work (minutes)", work, setWork],
          ["Break (minutes)", rest, setRest],
        ].map(([label, value, setter]) => (
          <label key={label} className="text-sm font-medium text-[#D5EBDD]">
            {label}
            <input
              type="number"
              min="1"
              max="180"
              className={inputClass}
              value={value}
              onChange={(event) => {
                const next = Math.max(1, Math.min(180, Number(event.target.value) || 1));
                setter(next);
                if (!running && ((label.startsWith("Work") && phase === "Work") ||
                  (label.startsWith("Break") && phase === "Break"))) {
                  setRemaining(next * 60);
                }
              }}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
