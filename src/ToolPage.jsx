
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { tools, descriptions } from "./toolData";

import ImageCompressor from "./tools/ImageCompressor";
import ImageResizer from "./tools/ImageResizer";
import QRCodeGenerator from "./tools/QRCodeGenerator";
import WordCounter from "./tools/WordCounter";
import JSONFormatter from "./tools/JSONFormatter";
import PercentageCalculator from "./tools/PercentageCalculator";
import TextCaseConverter from "./tools/TextCaseConverter";

// Central registry of available tool components.
// Add future tools here.
const toolComponents = {
  compress: ImageCompressor,
  resize: ImageResizer,
  qr: QRCodeGenerator,
  words: WordCounter,
  json: JSONFormatter,
  percent: PercentageCalculator,
  textcase: TextCaseConverter,
};

export default function ToolPage({ id, onBack }) {
  const info = descriptions[id];

  const currentTool = tools.find(
    (tool) => tool.id === id
  );

  const ToolComponent = toolComponents[id];

  // Avoid rendering invalid or unregistered tools.
  if (!info || !currentTool || !ToolComponent) {
    return null;
  }

  const Icon = currentTool.icon;

  return (
    <main className="relative mx-auto w-full max-w-5xl flex-1 px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 -z-10 h-80 w-2/3 -translate-x-1/2 rounded-full bg-cyan-500/8 blur-[110px]"
      />

      {/* Back navigation */}
      <button
        type="button"
        onClick={onBack}
        className="mb-10 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-400 transition-colors hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
      >
        <ArrowLeft size={17} />
        All tools
      </button>

      {/* Tool heading */}
      <div className="mb-9 flex items-start gap-4 sm:gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_35px_rgba(34,211,238,0.08)] sm:h-16 sm:w-16">
          <Icon size={27} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
            {info.eyebrow}
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {info.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            {info.description}
          </p>
        </div>
      </div>

      {/* Tool component */}
      <section
        aria-label={info.title}
        className="tool-panel relative overflow-hidden rounded-[24px] border border-white/10 bg-[#101722]/90 p-5 shadow-[0_25px_85px_rgba(0,0,0,0.30)] sm:p-8"
      >
        <ToolComponent />
      </section>

      {/* Privacy information */}
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 text-xs leading-6 text-slate-400 sm:text-sm">
        <ShieldCheck
          size={19}
          className="mt-0.5 shrink-0 text-cyan-300"
        />

        <p>
          Designed for local processing where supported.
          Your files are not intentionally uploaded by
          these tools.
        </p>
      </div>
    </main>
  );
}
