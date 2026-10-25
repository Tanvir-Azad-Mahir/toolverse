import { useState } from "react";
import { Image, Braces, Calculator, Sparkles, Check, ArrowRight, WandSparkles, Layers3, Search, LockKeyhole, Zap } from "lucide-react";
import { tools, categories } from "./toolData";

export default function Landing({ onOpenTool }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All tools");
  const filtered = tools.filter((tool) =>
    (category === "All tools" || tool.category === category) &&
    `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
          <main className="flex-1">
            <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:grid-cols-[1.1fr_.9fr] lg:gap-12 lg:px-10 lg:pb-32 lg:pt-32">
              <div className="relative z-10 max-w-2xl">
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[.07] px-4 py-2 text-xs font-medium text-cyan-200">
                  <Sparkles size={14} /> Your everyday digital toolbox
                </div>
                <h1 className="max-w-2xl text-[clamp(3.1rem,6.6vw,6rem)] font-extrabold leading-[1.04] tracking-[-.065em] text-white">
                  Everything you need.<span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">Nothing you don't.</span>
                </h1>
                <p className="mt-7 max-w-lg text-base leading-8 text-slate-400 sm:text-lg">
                  Powerful little tools for your everyday workflow. Edit images, transform text, format code, and get things done — all in one place.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <a href="#tools" className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-[0_10px_35px_rgba(34,211,238,.20)] transition hover:-translate-y-0.5 hover:brightness-110">
                    Explore all tools <ArrowRight size={18} />
                  </a>
                  <span className="text-sm text-slate-500">{tools.length} tools. Free to use.</span>
                </div>
                <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-400 sm:text-sm">
                  <span className="inline-flex items-center gap-2"><Check size={16} className="text-cyan-300" /> No signup needed</span>
                  <span className="inline-flex items-center gap-2"><Check size={16} className="text-cyan-300" /> Browser-based</span>
                  <span className="inline-flex items-center gap-2"><Check size={16} className="text-cyan-300" /> Easy to use</span>
                </div>
              </div>

              <div className="relative mx-auto grid w-full max-w-[490px] place-items-center py-10 lg:py-0" aria-hidden="true">
                <div className="absolute h-[400px] w-[400px] max-w-full rounded-full bg-cyan-500/[.09] blur-[80px]" />
                <div className="absolute h-[320px] w-[320px] rounded-full border border-cyan-300/15 [transform:rotateX(65deg)_rotate(-25deg)]" />
                <div className="absolute h-[240px] w-[370px] max-w-full rounded-full border border-blue-400/20 [transform:rotate(-35deg)]" />
                <div className="relative flex h-56 w-56 items-center justify-center rounded-[44px] border border-white/15 bg-gradient-to-br from-[#17253b] via-[#0b1424] to-[#111c30] shadow-[0_30px_100px_rgba(0,0,0,.55),inset_0_1px_0_rgba(255,255,255,.12)] sm:h-64 sm:w-64">
                  <div className="absolute inset-4 rounded-[32px] border border-cyan-400/10" />
                  <img src="/log2.png" alt="" className="relative h-32 w-32 object-contain drop-shadow-[0_0_28px_rgba(34,211,238,.3)] sm:h-40 sm:w-40" />
                </div>
                <div className="absolute -left-2 top-5 flex items-center gap-2 rounded-xl border border-white/15 bg-[#151e2e]/95 px-4 py-3 text-xs font-semibold text-slate-200 shadow-xl sm:-left-8"><Image size={18} className="text-cyan-300" /> Image tools</div>
                <div className="absolute -right-3 top-1/2 flex items-center gap-2 rounded-xl border border-white/15 bg-[#151e2e]/95 px-4 py-3 text-xs font-semibold text-slate-200 shadow-xl sm:-right-8"><Braces size={18} className="text-sky-300" /> Developer tools</div>
                <div className="absolute bottom-3 left-2 flex items-center gap-2 rounded-xl border border-white/15 bg-[#151e2e]/95 px-4 py-3 text-xs font-semibold text-slate-200 shadow-xl sm:left-0"><WandSparkles size={18} className="text-cyan-300" /> Quick utilities</div>
              </div>
            </section>

            <section id="tools" className="scroll-mt-24 border-t border-white/[.06] bg-[#0c121e]/50 py-20 sm:py-24">
              <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
                <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
                  <div>
                    <p className="mb-4 text-xs font-bold tracking-[.22em] text-cyan-300">THE TOOLKIT</p>
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">Tools for every <span className="text-cyan-300">little task.</span></h2>
                    <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">Find what you need and get back to what matters.</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500"><Layers3 size={16} /> {tools.length} tools available</div>
                </div>
                <div className="mb-5 flex w-full max-w-xl items-center gap-3 rounded-xl border border-white/10 bg-[#111a29] px-4 py-3.5 text-slate-400 transition-colors focus-within:border-cyan-400/50">
                  <Search size={19} aria-hidden="true" />
                  <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for a tool..." aria-label="Search tools" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500" />
                  <kbd className="hidden rounded-md border border-white/10 px-2 py-1 text-[10px] text-slate-500 sm:inline">SEARCH</kbd>
                </div>
                <div className="mb-9 flex flex-wrap gap-2" aria-label="Filter tools by category">
                  {categories.map((item) => (
                    <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${category === item ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-200" : "border-white/10 bg-white/[.03] text-slate-400 hover:border-white/25 hover:text-white"}`}>
                      {item}
                    </button>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button type="button" key={tool.id} onClick={() => onOpenTool(tool.id)} className="group relative flex min-h-[226px] flex-col items-start overflow-hidden rounded-[22px] border border-white/[.09] bg-gradient-to-br from-[#162132] to-[#101722] p-6 text-left shadow-[0_12px_25px_rgba(0,0,0,.12)] transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_20px_45px_rgba(0,0,0,.28)]">
                        <span className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-cyan-400/[.045] blur-3xl transition group-hover:bg-cyan-400/[.1]" />
                        <span className="mb-6 grid h-12 w-12 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"><Icon size={23} /></span>
                        <span className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-cyan-300/85">{tool.category}</span>
                        <strong className="mb-2 text-lg font-semibold tracking-tight text-white">{tool.name}</strong>
                        <span className="max-w-[90%] text-sm leading-6 text-slate-400">{tool.description}</span>
                        <span className="absolute right-6 top-7 text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-300"><ArrowRight size={18} /></span>
                      </button>
                    );
                  })}
                </div>
                {filtered.length === 0 && <p className="rounded-xl border border-white/10 p-8 text-center text-sm text-slate-400">No tools match your search. Try another keyword or category.</p>}
              </div>
            </section>

            <section id="about" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
              <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[28px] border border-white/10 bg-gradient-to-br from-[#172438] via-[#111b2b] to-[#0b1422] p-8 sm:p-12 md:flex-row md:items-center">
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300"><LockKeyhole size={29} /></div>
                <div className="max-w-2xl">
                  <p className="mb-3 text-xs font-bold tracking-[.2em] text-cyan-300">BUILT FOR EVERYDAY WORK</p>
                  <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Simple by design. <span className="text-cyan-300">Useful by default.</span></h2>
                  <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">ToolVerse makes everyday digital tasks faster, with straightforward browser-based tools and no unnecessary signups. Image processing happens on your device where supported.</p>
                </div>
                <div className="md:ml-auto"><Zap className="hidden text-cyan-300/30 md:block" size={70} strokeWidth={1} /></div>
              </div>
            </section>
          </main>
  );
}
