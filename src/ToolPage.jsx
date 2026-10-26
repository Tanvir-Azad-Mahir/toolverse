
import { lazy, Suspense } from "react";
import { ArrowLeft, ShieldCheck, LoaderCircle } from "lucide-react";
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
};

export default function ToolPage({ id, onBack }) {
  const info = descriptions[id];
  const currentTool = tools.find((tool) => tool.id === id);
  const ToolComponent = Object.hasOwn(toolComponents, id)
    ? toolComponents[id]
    : null;

  if (!info || !currentTool || !ToolComponent) {
    return null;
  }

  const Icon = currentTool.icon;

  return (
    <main className="relative mx-auto w-full max-w-5xl flex-1 px-5 pb-24 pt-12 sm:px-8 sm:pt-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 -z-10 h-80 w-2/3 -translate-x-1/2 rounded-full bg-cyan-500/8 blur-[110px]"
      />

      <button
        type="button"
        onClick={onBack}
        className="mb-10 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-400 transition-colors hover:text-cyan-300"
      >
        <ArrowLeft size={17} />
        All tools
      </button>

      <div className="mb-9 flex items-start gap-4 sm:gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 sm:h-16 sm:w-16">
          <Icon size={27} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-300">
            {info.eyebrow}
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
            {info.title}
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            {info.description}
          </p>
        </div>
      </div>

      <section
        aria-label={info.title}
        className="tool-panel relative overflow-hidden rounded-[24px] border border-white/10 bg-[#101722]/90 p-5 shadow-[0_25px_85px_rgba(0,0,0,0.30)] sm:p-8"
      >
        <Suspense
          fallback={
            <div
              role="status"
              className="flex min-h-[240px] flex-col items-center justify-center gap-3"
            >
              <LoaderCircle
                size={30}
                className="animate-spin text-cyan-300"
              />
              <p className="text-sm text-slate-400">
                Loading tool...
              </p>
            </div>
          }
        >
          <ToolComponent />
        </Suspense>
      </section>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4 text-xs leading-6 text-slate-400 sm:text-sm">
        <ShieldCheck
          size={19}
          className="mt-0.5 shrink-0 text-cyan-300"
        />
        <p>
          Designed for local processing where supported.
          Your files are not intentionally uploaded by these tools.
        </p>
      </div>
    </main>
  );
}
