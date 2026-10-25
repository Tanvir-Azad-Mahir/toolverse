import { ShieldCheck } from "lucide-react";
import { tools, descriptions } from "./toolData";
import ImageCompressor from "./tools/ImageCompressor";
import ImageResizer from "./tools/ImageResizer";
import QRCodeGenerator from "./tools/QRCodeGenerator";
import WordCounter from "./tools/WordCounter";
import JSONFormatter from "./tools/JSONFormatter";
import PercentageCalculator from "./tools/PercentageCalculator";
import TextCaseConverter from "./tools/TextCaseConverter";

export default function ToolPage({ id, onBack }) {
  const info = descriptions[id];
  if (!info) return null;
  const currentTool = tools.find((tool) => tool.id === id);
  const Icon = currentTool.icon;

  return (
    <main className="relative mx-auto w-full max-w-5xl flex-1 px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <div className="pointer-events-none absolute left-1/2 top-16 -z-10 h-80 w-2/3 -translate-x-1/2 rounded-full bg-cyan-500/8 blur-[110px]" />
      <button type="button" onClick={onBack} className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-cyan-300">
        <span aria-hidden="true">←</span> All tools
      </button>
      <div className="mb-8 flex items-start gap-4 sm:gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-[0_0_35px_rgba(34,211,238,.08)]">
          <Icon size={26} />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-bold tracking-[.22em] text-cyan-300">{info.eyebrow}</p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">{info.title}</h1>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">{info.description}</p>
        </div>
      </div>
      <div className="tool-panel rounded-[24px] border border-white/10 bg-[#101722]/90 p-5 shadow-[0_25px_85px_rgba(0,0,0,.30)] sm:p-8">
        {id === "compress" && <ImageCompressor />}
        {id === "resize" && <ImageResizer />}
        {id === "qr" && <QRCodeGenerator />}
        {id === "words" && <WordCounter />}
        {id === "json" && <JSONFormatter />}
        {id === "percent" && <PercentageCalculator />}
        {id === "textcase" && <TextCaseConverter />}
      </div>
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/7 bg-white/[.025] p-4 text-xs leading-6 text-slate-400 sm:text-sm">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-cyan-300" />
        <span>Designed for local processing where supported. Your files are not intentionally uploaded by these tools.</span>
      </div>
    </main>
  );
}

