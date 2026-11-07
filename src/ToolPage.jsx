import { Component, lazy, Suspense, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  LoaderCircle,
  Layers3,
  AlertTriangle,
  RotateCcw,
  Check,
  Share2,
  ChevronRight,
} from "lucide-react";
import { tools, descriptions, categoryMeta } from "./toolData";

const toolComponents = {
  compress: lazy(() => import("./tools/ImageCompressor")),
  resize: lazy(() => import("./tools/ImageResizer")),
  qr: lazy(() => import("./tools/QRCodeGenerator")),
  words: lazy(() => import("./tools/WordCounter")),
  json: lazy(() => import("./tools/JSONFormatter")),
  percent: lazy(() => import("./tools/PercentageCalculator")),
  textcase: lazy(() => import("./tools/TextCaseConverter")),
  password: lazy(() => import("./tools/PasswordGenerator")),
  uuid: lazy(() => import("./tools/UUIDGenerator")),
  base64: lazy(() => import("./tools/Base64Converter")),
  date: lazy(() => import("./tools/DateCalculator")),
  imagetopdf: lazy(() => import("./tools/ImageToPDF")),
  jsoncsv: lazy(() => import("./tools/JSONToCSV")),
  jwt: lazy(() => import("./tools/JWTDecoder")),
  regex: lazy(() => import("./tools/RegexTester")),
  gradient: lazy(() => import("./tools/CSSGradientGenerator")),
  markdown: lazy(() => import("./tools/MarkdownPreviewer")),
  dedupe: lazy(() => import("./tools/DuplicateLineRemover")),
  urlcodec: lazy(() => import("./tools/URLEncoderDecoder")),
  contrast: lazy(() => import("./tools/ColorContrastChecker")),
  pomodoro: lazy(() => import("./tools/PomodoroTimer")),
  imageconvert: lazy(() => import("./tools/ImageFormatConverter")),
};

// Curated connections keep recommendations useful across categories.
const relatedById = {
  compress: ["resize", "imageconvert", "imagetopdf"],
  resize: ["compress", "imageconvert", "imagetopdf"],
  imageconvert: ["compress", "resize", "imagetopdf"],
  imagetopdf: ["imageconvert", "resize", "compress"],
  qr: ["urlcodec", "base64", "uuid"],
  words: ["textcase", "dedupe", "markdown"],
  textcase: ["words", "dedupe", "markdown"],
  markdown: ["words", "textcase", "dedupe"],
  dedupe: ["textcase", "words", "markdown"],
  json: ["jsoncsv", "jwt", "base64"],
  jsoncsv: ["json", "markdown", "dedupe"],
  jwt: ["base64", "json", "urlcodec"],
  regex: ["dedupe", "textcase", "json"],
  urlcodec: ["base64", "qr", "jwt"],
  base64: ["urlcodec", "jwt", "json"],
  uuid: ["password", "qr", "base64"],
  password: ["uuid", "base64", "qr"],
  percent: ["date", "contrast", "gradient"],
  date: ["percent", "pomodoro", "words"],
  gradient: ["contrast", "imageconvert", "regex"],
  contrast: ["gradient", "imageconvert", "percent"],
  pomodoro: ["date", "words", "percent"],
};

const toolsById = new Map(tools.map((tool) => [tool.id, tool]));

function getRelatedTools(id) {
  const tool = toolsById.get(id);
  if (!tool) return [];
  const picked = new Set([id]);
  const suggested = [];

  function addTool(candidateId) {
    const candidate = toolsById.get(candidateId);
    if (candidate && !picked.has(candidateId) && suggested.length < 3) {
      picked.add(candidateId);
      suggested.push(candidate);
    }
  }

  (relatedById[id] || []).forEach(addTool);
  tools
    .filter((candidate) => candidate.category === tool.category)
    .forEach((candidate) => addTool(candidate.id));
  tools.forEach((candidate) => addTool(candidate.id));
  return suggested;
}

// Error boundary catches errors thrown during tool rendering and lazy loading.
class ToolErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("ToolVerse tool failed:", error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          className="flex min-h-[260px] flex-col items-center justify-center px-4 py-12 text-center"
        >
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <AlertTriangle size={28} />
          </span>
          <h2 className="text-xl font-bold text-white">This tool encountered an issue</h2>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            Something went wrong while rendering this utility. You can reload this tool or return to
            the main directory.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-[#022c22] transition-colors hover:bg-emerald-400"
            >
              <RotateCcw size={15} /> Reload page
            </button>
            <button
              type="button"
              onClick={this.props.onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/[0.08]"
            >
              <ArrowLeft size={15} /> Back to all tools
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ToolPage({ id, onBack }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const info = descriptions[id];
  const currentTool = tools.find((tool) => tool.id === id);
  const ToolComponent = Object.hasOwn(toolComponents, id) ? toolComponents[id] : null;

  if (!info || !currentTool || !ToolComponent) return null;

  const Icon = currentTool.icon;
  const relatedTools = getRelatedTools(id);
  const meta = categoryMeta[currentTool.category] || {
    color: "#10b981",
    badge: currentTool.category,
  };

  function copyToolLink() {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  return (
    <main className="relative mx-auto w-full min-w-0 max-w-5xl flex-1 px-4 pb-20 pt-8 sm:px-8 sm:pb-28 sm:pt-12">
      {/* Ambient glow highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-10 -z-10 h-72 w-3/4 -translate-x-1/2 rounded-full bg-emerald-500/[0.06] blur-[120px]"
      />

      {/* Top Breadcrumb & Action Bar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} /> Tools
          </button>
          <ChevronRight size={12} className="text-slate-600" />
          <span
            className="font-semibold"
            style={{ color: meta.color }}
          >
            {currentTool.category}
          </span>
          <ChevronRight size={12} className="text-slate-600" />
          <span className="font-semibold text-white">{currentTool.name}</span>
        </div>

        {/* Share & Status actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={copyToolLink}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/[0.06] hover:text-white"
          >
            {copiedLink ? <Check size={13} className="text-emerald-400" /> : <Share2 size={13} />}
            <span>{copiedLink ? "Link Copied!" : "Share Tool"}</span>
          </button>
          <span className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-300 sm:inline-flex">
            <ShieldCheck size={13} /> Client-Side Execution
          </span>
        </div>
      </div>

      {/* Tool Header */}
      <div className="mb-8 flex min-w-0 items-start gap-4 sm:mb-10 sm:gap-6">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.04] shadow-lg sm:h-16 sm:w-16"
          style={{ color: meta.color }}
        >
          <Icon size={30} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${meta.color}15`,
                color: meta.color,
                border: `1px solid ${meta.color}30`,
              }}
            >
              {info.eyebrow || currentTool.category}
            </span>
            <span className="text-xs text-slate-500">• 100% Private</span>
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-4xl">
            {info.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
            {info.description}
          </p>
        </div>
      </div>

      {/* Tool Interactive Card Container */}
      <section
        aria-label={info.title}
        className="tool-panel relative min-w-0 overflow-x-auto rounded-3xl border border-white/[0.08] bg-[#0E131E]/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8"
      >
        <ToolErrorBoundary key={id} onBack={onBack}>
          <Suspense
            fallback={
              <div
                role="status"
                className="flex min-h-[280px] flex-col items-center justify-center gap-3.5"
              >
                <LoaderCircle size={32} className="animate-spin text-emerald-400" />
                <p className="text-sm font-medium text-slate-400">Loading utility...</p>
              </div>
            }
          >
            <ToolComponent />
          </Suspense>
        </ToolErrorBoundary>
      </section>

      {/* Security & Client-side guarantee note */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-xs text-slate-400">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-emerald-400" />
        <p className="leading-relaxed">
          <strong>Privacy Guarantee:</strong> This tool operates entirely inside your local browser
          sandbox using client-side memory. Your inputs, tokens, and files are never sent to or
          stored on our servers.
        </p>
      </div>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section aria-labelledby="related-tools-title" className="mt-14 sm:mt-16">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-emerald-400">
                <Layers3 size={18} />
              </span>
              <div>
                <h2
                  id="related-tools-title"
                  className="text-lg font-bold tracking-tight text-white"
                >
                  Suggested Utilities
                </h2>
                <p className="text-xs text-slate-400">Complementary tools for this workflow.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
            >
              View all 22 tools →
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((tool) => {
              const RelatedIcon = tool.icon;
              const relatedMeta = categoryMeta[tool.category] || { color: "#10b981" };

              return (
                <a
                  key={tool.id}
                  href={`#${tool.id}`}
                  className="group flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#111622]/80 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-[#141B2B] hover:shadow-lg hover:shadow-emerald-500/10"
                  aria-label={`Open ${tool.name}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]"
                        style={{ color: relatedMeta.color }}
                      >
                        <RelatedIcon size={20} />
                      </span>
                      <ArrowUpRight
                        size={16}
                        className="text-slate-500 transition-colors group-hover:text-emerald-400"
                      />
                    </div>
                    <h3 className="mt-3.5 text-sm font-bold text-white group-hover:text-emerald-300">
                      {tool.name}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 group-hover:text-emerald-400">
                    <span>Open tool</span>
                    <ArrowRight
                      size={12}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
