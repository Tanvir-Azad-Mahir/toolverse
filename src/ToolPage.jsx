import { Component, lazy, Suspense } from "react";
import { ArrowLeft, ArrowUpRight, ShieldCheck, LoaderCircle, Layers3, AlertTriangle, RotateCcw } from "lucide-react";
import { tools, descriptions } from "./toolData";

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
  tools.filter((candidate) => candidate.category === tool.category).forEach((candidate) => addTool(candidate.id));
  tools.forEach((candidate) => addTool(candidate.id));
  return suggested;
}


// An error boundary catches errors thrown during tool rendering and lazy loading.
// A full reload is used for Retry because React.lazy caches rejected imports.
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
        <div role="alert" className="flex min-h-[240px] flex-col items-center justify-center px-2 py-10 text-center">
          <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl border border-amber-400/20 bg-amber-400/[0.06] text-amber-300">
            <AlertTriangle size={24} />
          </span>
          <h2 className="text-lg font-semibold text-white">This tool couldn't load</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
            Something went wrong while opening this tool. You can retry or return to all tools.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition-colors hover:bg-cyan-400/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <RotateCcw size={16} /> Retry
            </button>
            <button
              type="button"
              onClick={this.props.onBack}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              <ArrowLeft size={16} /> Back to all tools
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function ToolPage({ id, onBack }) {
  const info = descriptions[id];
  const currentTool = tools.find((tool) => tool.id === id);
  const ToolComponent = Object.hasOwn(toolComponents, id) ? toolComponents[id] : null;
  if (!info || !currentTool || !ToolComponent) return null;
  const Icon = currentTool.icon;
  const relatedTools = getRelatedTools(id);
  return (
    <main className="relative mx-auto w-full min-w-0 max-w-5xl flex-1 px-4 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-16">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-16 -z-10 h-80 w-2/3 -translate-x-1/2 rounded-full bg-cyan-500/8 blur-[110px]" />
      <button type="button" onClick={onBack} className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-lg text-sm font-medium text-slate-400 transition-colors hover:text-cyan-300"><ArrowLeft size={17} />All tools</button>
      <div className="mb-7 flex min-w-0 items-start gap-3 sm:mb-9 sm:gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 sm:h-16 sm:w-16"><Icon size={27} /></div>
        <div className="min-w-0 flex-1"><p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">{info.eyebrow}</p><h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">{info.title}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">{info.description}</p></div>
      </div>
      <section aria-label={info.title} className="tool-panel relative min-w-0 overflow-x-auto rounded-[20px] border border-white/10 bg-[#101722]/90 p-4 shadow-[0_25px_85px_rgba(0,0,0,0.30)] sm:p-8">
        <ToolErrorBoundary key={id} onBack={onBack}>
          <Suspense fallback={<div role="status" className="flex min-h-[240px] flex-col items-center justify-center gap-3"><LoaderCircle size={30} className="animate-spin text-cyan-300" /><p className="text-sm text-slate-400">Loading tool...</p></div>}>
            <ToolComponent />
          </Suspense>
        </ToolErrorBoundary>
      </section>
      {relatedTools.length > 0 && (
        <section aria-labelledby="related-tools-title" className="mt-10 sm:mt-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-cyan-300">
              <Layers3 size={19} />
            </div>
            <div>
              <h2 id="related-tools-title" className="text-xl font-bold tracking-tight text-white">Related tools</h2>
              <p className="mt-1 text-sm text-slate-400">Useful tools to try next.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((tool) => {
              const RelatedIcon = tool.icon;
              return (
                <a
                  key={tool.id}
                  href={`#${tool.id}`}
                  className="group flex min-h-[155px] flex-col rounded-2xl border border-white/10 bg-[#101722]/80 p-5 transition-colors hover:border-cyan-300/35 hover:bg-[#142032] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                  aria-label={`Open ${tool.name}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/[0.07] text-cyan-300">
                      <RelatedIcon size={19} />
                    </span>
                    <ArrowUpRight size={17} className="text-slate-500 transition-colors group-hover:text-cyan-300" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-white">{tool.name}</h3>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{tool.description}</p>
                </a>
              );
            })}
          </div>
        </section>
      )}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 text-xs leading-6 text-slate-400 sm:text-sm"><ShieldCheck size={19} className="mt-0.5 shrink-0 text-cyan-300" /><p>Designed for local processing where supported. Your files are not intentionally uploaded by these tools.</p></div>
    </main>
  );
}
