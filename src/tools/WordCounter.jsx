
import { useState } from "react";
import {
  Type,
  FileText,
  AlignLeft,
  Clock3,
  Mic,
  Copy,
  Check,
  Download,
  Trash2,
  Hash,
  ShieldCheck,
} from "lucide-react";

const editorClass =
  "w-full min-h-[260px] resize-y rounded-xl border border-white/10 bg-[#080f1c] px-5 py-4 text-sm leading-7 text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10";

const readingSpeed = 200;
const speakingSpeed = 130;

function formatDuration(minutes) {
  if (minutes === 0) return "0 sec";

  const seconds = Math.max(1, Math.ceil(minutes * 60));

  if (seconds < 60) {
    return `${seconds} sec`;
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return secs === 0
    ? `${mins} min`
    : `${mins} min ${secs} sec`;
}

function getKeywords(text) {
  const stopWords = new Set([
    "the", "and", "for", "are", "but", "not",
    "you", "your", "with", "this", "that",
    "from", "have", "has", "was", "were",
    "will", "can", "into", "about", "their",
    "they", "them", "our", "out", "all",
    "its", "his", "her", "she", "him",
    "who", "what", "when", "where", "how",
    "why", "which", "than", "then", "there",
    "here", "been", "being", "would", "could",
    "should", "some", "more", "very", "just",
    "also", "each", "other", "only", "over",
    "under", "such", "these", "those",
    "a", "an", "as", "at", "by", "do",
    "if", "in", "is", "it", "of", "on",
    "or", "to", "up", "we", "he", "be",
    "i", "me", "my",
  ]);

  const matches =
    text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];

  const counts = {};

  for (const word of matches) {
    if (word.length < 3 || stopWords.has(word)) continue;
    counts[word] = (counts[word] || 0) + 1;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 5);
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const trimmed = text.trim();

  const words = trimmed ? trimmed.split(/\s+/u).length : 0;

  const characters = text.length;

  const charactersNoSpaces = text.replace(/\s/gu, "").length;

  const sentences = trimmed
    ? text
        .split(/[.!?]+/u)
        .filter((part) => part.trim()).length
    : 0;

  const paragraphs = trimmed
    ? text
        .split(/\n\s*\n/u)
        .filter((part) => part.trim()).length
    : 0;

  const lines = text
    ? text.split(/\r\n|\r|\n/u).length
    : 0;

  const readingTime = formatDuration(words / readingSpeed);
  const speakingTime = formatDuration(words / speakingSpeed);

  const keywords = getKeywords(text);

  const statistics = [
    {
      label: "Words",
      value: words,
      icon: Type,
      highlight: true,
    },
    {
      label: "Characters",
      value: characters,
      icon: Hash,
    },
    {
      label: "Without spaces",
      value: charactersNoSpaces,
      icon: AlignLeft,
    },
    {
      label: "Sentences",
      value: sentences,
      icon: FileText,
    },
    {
      label: "Paragraphs",
      value: paragraphs,
      icon: AlignLeft,
    },
    {
      label: "Lines",
      value: lines,
      icon: FileText,
    },
  ];

  function updateText(value) {
    setText(value);
    setCopied(false);
    setError("");
  }

  async function copyText() {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setError("");
    } catch {
      setError(
        "Clipboard access failed. Select your text and copy it manually."
      );
    }
  }

  function downloadText() {
    if (!text) return;

    const blob = new Blob([text], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "toolverse-text.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function clearText() {
    updateText("");
  }

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2.5 text-lg font-bold text-white sm:text-xl">
            <Type size={22} className="text-cyan-300" />
            Word Analysis Workspace
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Analyze words, characters, reading time, and more
            as you type.
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-medium text-cyan-200">
          Live analysis
        </span>
      </div>

      {/* Text editor */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor="word-counter-input"
            className="flex items-center gap-2 text-sm font-semibold text-slate-200"
          >
            <FileText size={17} className="text-cyan-300" />
            Your text
          </label>

          <span className="text-xs text-slate-500">
            {words.toLocaleString()} words
          </span>
        </div>

        <textarea
          id="word-counter-input"
          rows={11}
          value={text}
          onChange={(event) => updateText(event.target.value)}
          placeholder="Start typing or paste your text here..."
          spellCheck
          className={editorClass}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Statistics update automatically.
          </span>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyText}
              disabled={!text}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {copied ? (
                <>
                  <Check size={15} className="text-emerald-300" />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={15} />
                  Copy
                </>
              )}
            </button>

            <button
              type="button"
              onClick={downloadText}
              disabled={!text}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Download size={15} />
              Download
            </button>

            <button
              type="button"
              onClick={clearText}
              disabled={!text}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-red-400/30 hover:text-red-300 disabled:opacity-40"
            >
              <Trash2 size={15} />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white">
          Text statistics
        </h3>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {statistics.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`rounded-2xl border p-4 transition sm:p-5 ${
                  stat.highlight
                    ? "border-cyan-400/25 bg-gradient-to-br from-cyan-400/10 to-blue-400/[0.04]"
                    : "border-white/10 bg-[#0b1422]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-400">
                    {stat.label}
                  </span>

                  <Icon
                    size={17}
                    className={
                      stat.highlight
                        ? "text-cyan-300"
                        : "text-slate-500"
                    }
                  />
                </div>

                <p
                  className={`mt-4 text-2xl font-bold tracking-tight sm:text-3xl ${
                    stat.highlight
                      ? "text-cyan-300"
                      : "text-white"
                  }`}
                >
                  {stat.value.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reading and speaking time */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0c1726] p-5">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cyan-400/10 text-cyan-300">
            <Clock3 size={22} />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">
              Estimated reading time
            </p>
            <p className="mt-1 text-xl font-bold text-white">
              {readingTime}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              At 200 words per minute
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#0c1726] p-5">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-400/10 text-blue-300">
            <Mic size={22} />
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">
              Estimated speaking time
            </p>
            <p className="mt-1 text-xl font-bold text-white">
              {speakingTime}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              At 130 words per minute
            </p>
          </div>
        </div>
      </div>

      {/* Top keywords */}
      {keywords.length > 0 && (
        <div className="space-y-4 rounded-2xl border border-white/10 bg-[#0c1625] p-5 sm:p-6">
          <div>
            <h3 className="text-sm font-bold text-white">
              Most frequent keywords
            </h3>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Common English filler words are excluded.
            </p>
          </div>

          <div className="space-y-3">
            {keywords.map(([word, count]) => (
              <div
                key={word}
                className="flex items-center justify-between gap-4"
              >
                <span className="min-w-0 truncate text-sm text-slate-300">
                  {word}
                </span>

                <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-cyan-300">
                  {count} {count === 1 ? "time" : "times"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p
          role="alert"
          className="rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm text-red-300"
        >
          {error}
        </p>
      )}

      {/* Privacy notice */}
      <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
        <ShieldCheck
          size={18}
          className="mt-0.5 shrink-0 text-cyan-300"
        />

        <p className="text-xs leading-6 text-slate-400">
          Your text is analyzed directly in your browser.
          ToolVerse does not upload your text to a server
          for counting or analysis.
        </p>
      </div>
    </div>
  );
}
