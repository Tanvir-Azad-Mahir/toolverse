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
        <h2 className="flex items-center gap-2 text-lg font-bold text-[#F0FDF4]">
          <KeyRound size={21} className="text-[#10b981]" />
          Secure Password Generator
        </h2>
        <p className="mt-2 text-sm text-[#94a3b8]">
          Generate random passwords directly in your browser.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#0D111A] p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <label htmlFor="password-length" className="text-sm font-medium text-[#cbd5e1]">
            Password length
          </label>
          <span className="rounded-lg border border-[#10b981]/20 bg-[#10b981]/10 px-3 py-1 text-sm font-bold text-[#10b981]">
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
          className="w-full accent-[#10b981]"
        />

        <div className="flex justify-between text-xs text-[#94a3b8]">
          <span>8 characters</span>
          <span>64 characters</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {Object.keys(groups).map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#07090E] p-4 transition hover:border-[#10b981]/30"
            >
              <input
                type="checkbox"
                checked={selected[key]}
                onChange={() => toggle(key)}
                className="h-4 w-4 accent-[#10b981]"
              />
              <span className="text-sm capitalize text-[#cbd5e1]">
                {key}
              </span>
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={!activeCount}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#10b981] px-5 py-3.5 text-sm font-bold text-[#07090E] transition hover:bg-[#A7F3C4] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RefreshCw size={17} />
          Generate password
        </button>
      </div>

      {password && (
        <div className="space-y-4 rounded-2xl border border-[#10b981]/20 bg-[#0D111A] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8]">
            Generated password
          </p>

          <div className="rounded-xl border border-[rgba(255,255,255,0.1)] bg-[#07090E] p-4">
            <p className="break-all font-mono text-base leading-7 text-[#D1FAE5]">
              {password}
            </p>
          </div>

          <button
            type="button"
            onClick={copyPassword}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#10b981]/25 bg-[#10b981]/10 px-5 py-3 text-sm font-semibold text-[#10b981] transition hover:bg-[#10b981]/15"
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

      <p className="flex items-start gap-2 text-xs leading-6 text-[#94a3b8]">
        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#10b981]" />
        Uses cryptographically secure browser randomness.
        Passwords are not uploaded or saved by this tool.
      </p>
    </div>
  );
}
