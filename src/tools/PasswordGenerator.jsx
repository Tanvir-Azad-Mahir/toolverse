
import { useState } from "react";
import {
  KeyRound,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";

const groups = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}?",
};

function randomInt(max) {
  const limit = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  let value;

  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);

  return value % max;
}

function pick(chars) {
  return chars[randomInt(chars.length)];
}

function createPassword(length, selected) {
  const active = Object.entries(selected)
    .filter(([, enabled]) => enabled)
    .map(([key]) => groups[key]);

  if (!active.length) return "";

  const pool = active.join("");
  const password = active.map(pick);

  while (password.length < length) {
    password.push(pick(pool));
  }

  for (let i = password.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [password[i], password[j]] =
      [password[j], password[i]];
  }

  return password.join("");
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [selected, setSelected] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const activeCount =
    Object.values(selected).filter(Boolean).length;

  function generate() {
    if (!activeCount) {
      setError("Select at least one character type.");
      return;
    }

    try {
      setPassword(createPassword(length, selected));
      setCopied(false);
      setError("");
    } catch {
      setError("Secure password generation is unavailable.");
    }
  }

  function toggle(key) {
    setSelected((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
    setPassword("");
    setCopied(false);
    setError("");
  }

  async function copyPassword() {
    if (!password) return;

    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setError("");
    } catch {
      setError("Could not copy the password.");
    }
  }

  return (
    <div className="space-y-7">
      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          <KeyRound size={21} className="text-cyan-300" />
          Secure Password Generator
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Generate random passwords directly in your browser.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-white/10 bg-[#0c1625] p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <label htmlFor="password-length" className="text-sm font-medium text-slate-300">
            Password length
          </label>
          <span className="rounded-lg bg-cyan-400/10 px-3 py-1 text-sm font-bold text-cyan-300">
            {length}
          </span>
        </div>

        <input
          id="password-length"
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(event) => {
            setLength(Number(event.target.value));
            setPassword("");
            setCopied(false);
          }}
          className="w-full accent-cyan-400"
        />

        <div className="flex justify-between text-xs text-slate-500">
          <span>8 characters</span>
          <span>64 characters</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {Object.keys(groups).map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#0b1422] p-4"
            >
              <input
                type="checkbox"
                checked={selected[key]}
                onChange={() => toggle(key)}
                className="h-4 w-4 accent-cyan-400"
              />
              <span className="text-sm capitalize text-slate-200">
                {key}
              </span>
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={!activeCount}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 text-sm font-bold text-slate-950 transition hover:brightness-110 disabled:opacity-40"
        >
          <RefreshCw size={17} />
          Generate password
        </button>
      </div>

      {password && (
        <div className="space-y-4 rounded-2xl border border-cyan-400/20 bg-[#0c1726] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Generated password
          </p>

          <div className="rounded-xl border border-white/10 bg-[#080f1c] p-4">
            <p className="break-all font-mono text-base leading-7 text-cyan-200">
              {password}
            </p>
          </div>

          <button
            type="button"
            onClick={copyPassword}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
          >
            {copied ? <Check size={17} /> : <Copy size={17} />}
            {copied ? "Copied" : "Copy password"}
          </button>
        </div>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      <p className="flex items-start gap-2 text-xs leading-6 text-slate-500">
        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-cyan-300" />
        Uses cryptographically secure browser randomness.
        Passwords are not uploaded or saved by this tool.
      </p>
    </div>
  );
}
