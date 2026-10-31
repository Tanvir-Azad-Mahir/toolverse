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
          <KeyRound size={21} className="text-[#86EFAC]" />
          Secure Password Generator
        </h2>
        <p className="mt-2 text-sm text-[#94A3A0]">
          Generate random passwords directly in your browser.
        </p>
      </div>

      <div className="space-y-6 rounded-2xl border border-[#304038] bg-[#1B2420] p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <label htmlFor="password-length" className="text-sm font-medium text-[#D1E4D8]">
            Password length
          </label>
          <span className="rounded-lg border border-[#86EFAC]/20 bg-[#86EFAC]/10 px-3 py-1 text-sm font-bold text-[#86EFAC]">
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
          className="w-full accent-[#86EFAC]"
        />

        <div className="flex justify-between text-xs text-[#94A3A0]">
          <span>8 characters</span>
          <span>64 characters</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {Object.keys(groups).map((key) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#304038] bg-[#101210] p-4 transition hover:border-[#86EFAC]/30"
            >
              <input
                type="checkbox"
                checked={selected[key]}
                onChange={() => toggle(key)}
                className="h-4 w-4 accent-[#86EFAC]"
              />
              <span className="text-sm capitalize text-[#D1E4D8]">
                {key}
              </span>
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={!activeCount}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#86EFAC] px-5 py-3.5 text-sm font-bold text-[#101210] transition hover:bg-[#A7F3C4] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RefreshCw size={17} />
          Generate password
        </button>
      </div>

      {password && (
        <div className="space-y-4 rounded-2xl border border-[#86EFAC]/20 bg-[#1B2420] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#94A3A0]">
            Generated password
          </p>

          <div className="rounded-xl border border-[#304038] bg-[#101210] p-4">
            <p className="break-all font-mono text-base leading-7 text-[#D1FAE5]">
              {password}
            </p>
          </div>

          <button
            type="button"
            onClick={copyPassword}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#86EFAC]/25 bg-[#86EFAC]/10 px-5 py-3 text-sm font-semibold text-[#86EFAC] transition hover:bg-[#86EFAC]/15"
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

      <p className="flex items-start gap-2 text-xs leading-6 text-[#94A3A0]">
        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#86EFAC]" />
        Uses cryptographically secure browser randomness.
        Passwords are not uploaded or saved by this tool.
      </p>
    </div>
  );
}
