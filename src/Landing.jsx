import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ArrowRight,
  Layers3,
  Search,
  LockKeyhole,
  Zap,
  ShieldCheck,
  MousePointerClick,
  Download,
  Globe2,
  Mail,
  GitBranch,
  HeartHandshake,
  ArrowUpRight,
  X,
  Command,
} from "lucide-react";



import { tools, categories } from "./toolData";

// Tool metadata is static: prepare searchable text only once.
const searchableTools = tools.map((tool) => ({
  tool,
  keywords: `${tool.name} ${tool.description} ${tool.category}`.toLocaleLowerCase(),
}));

const popularToolNames = [
  "Image Compressor",
  "QR Code Generator",
  "JSON Formatter",
  "Word Counter",
];

const popularTools = popularToolNames
  .map((name) => tools.find((tool) => tool.name === name))
  .filter(Boolean);

const navigateToTool = (id) => {
  window.location.hash = id;
};


export default function Landing({ onOpenTool = navigateToTool }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All tools");
  const searchRef = useRef(null);
  const query = search.trim().toLocaleLowerCase();

  // Keyboard shortcut: press / (or Ctrl/Cmd+K) to jump to search.
  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target;
      const typing = target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if ((event.key === "/" && !typing) || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === searchRef.current) {
        setSearch("");
        searchRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const showResults = () => {
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("tools")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  const filtered = useMemo(
    () => searchableTools
      .filter(({ tool, keywords }) =>
        (category === "All tools" || tool.category === category) &&
        (!query || keywords.includes(query))
      )
      .map(({ tool }) => tool),
    [category, query]
  );

  return (
    <main className="relative flex-1 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute left-[-180px] top-10 h-[460px] w-[460px] rounded-full bg-cyan-500/[.08] blur-[125px]" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[-170px] top-[700px] h-[440px] w-[440px] rounded-full bg-indigo-500/[.09] blur-[130px]" />
      {/* ================= SIMPLE CENTERED HERO ================= */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pb-20 pt-24 text-center sm:px-8 sm:pb-28 sm:pt-32 lg:px-10 lg:pt-36">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-xs font-medium tracking-wide text-cyan-200">
            Your everyday digital toolbox
          </p>

          <h1 className="text-[clamp(2.5rem,6vw,5.25rem)] font-extrabold leading-[1.1] tracking-[-.055em] text-white">
            Everything you need.
            <span className="block text-cyan-300">Nothing you don't.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            Powerful little tools for your everyday workflow. Edit images,
            transform text, format code, and get things done — all in one place.
          </p>

          {/* Prominent search: shares state with the category filters below. */}
          <div role="search" className="mx-auto mt-9 w-full max-w-2xl">
            <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-white/15 bg-[#111b29] px-3 py-2 transition-colors duration-150 focus-within:border-cyan-300/60 sm:gap-3 sm:px-5 sm:py-2.5">
              <Search size={21} className="shrink-0 text-slate-400" aria-hidden="true" />
              <input
                ref={searchRef}
                type="text"
                inputMode="search"
                autoComplete="off"
                spellCheck={false}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => { if (event.key === "Enter") showResults(); }}
                placeholder="Try image compressor, QR code, JSON..."
                aria-label="Search all ToolVerse tools"
                aria-controls="tool-results"
                className="block min-w-0 w-0 flex-1 appearance-none rounded-none border-0 bg-transparent p-0 py-2 text-sm text-white shadow-none ring-0 outline-none placeholder:text-slate-500 focus:border-0 focus:shadow-none focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 sm:text-base"
                style={{ outline: "none", boxShadow: "none", WebkitAppearance: "none" }}
              />
              {search ? (
                <button type="button" onClick={() => {setSearch(""); searchRef.current?.focus();}} aria-label="Clear search" className="shrink-0 rounded-md p-1.5 text-slate-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-200"><X size={18} /></button>
              ) : (
                <kbd className="hidden items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-slate-500 sm:inline-flex"><Command size={12} /> K</kbd>
              )}
              <button type="button" onClick={showResults} className="shrink-0 rounded-xl bg-cyan-400 px-3 py-2.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-200 sm:px-4 sm:text-sm">Search</button>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="mr-1">Popular:</span>
              {popularTools.map((tool) => (
                <button key={tool.id} type="button" onClick={() => onOpenTool(tool.id)} className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-slate-300 hover:border-cyan-300/40 hover:text-cyan-200">
                  {tool.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#tools"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-cyan-300"
            >
              Explore all tools
              <ArrowRight size={18} />
            </a>
            <span className="text-sm text-slate-500">{tools.length} tools. Free to use.</span>
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-slate-400 sm:text-sm">
            <span className="inline-flex items-center gap-2"><Check size={16} className="text-cyan-300" /> No signup needed</span>
            <span className="inline-flex items-center gap-2"><Check size={16} className="text-cyan-300" /> Browser-based</span>
            <span className="inline-flex items-center gap-2"><Check size={16} className="text-cyan-300" /> Easy to use</span>
          </div>
        </div>
      </section>

      {/* ================= TOOL DIRECTORY ================= */}
      <section
        id="tools"
        className="scroll-mt-24 border-t border-white/[.06] bg-[#0c121e]/50 py-14 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-xs font-bold tracking-[.22em] text-cyan-300">
                THE TOOLKIT
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                Tools for every{" "}
                <span className="text-cyan-300">
                  little task.
                </span>
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
                Find what you need and get back to what matters.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Layers3 size={16} />
              {tools.length} tools available
            </div>
          </div>

          {/* Active search summary */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-white">{filtered.length}</span> of {tools.length} tools
              {query && <> matching <span className="font-medium text-cyan-200">“{search.trim()}”</span></>}
            </p>
            {(search || category !== "All tools") && (
              <button type="button" onClick={() => { setSearch(""); setCategory("All tools"); }} className="inline-flex items-center gap-1.5 text-xs text-cyan-300 hover:text-cyan-200">
                <X size={14}/> Reset filters
              </button>
            )}
          </div>

          {/* Category filters */}
          <div
            className="mb-9 flex flex-wrap gap-2"
            role="group"
            aria-label="Filter tools by category"
          >
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                  category === item
                    ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-200"
                    : "border-white/10 bg-white/[.03] text-slate-400 hover:border-white/25 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Tool cards */}
          <div id="tool-results" className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {filtered.map((tool) => {
              const Icon = tool.icon;

              return (
                <button
                  type="button"
                  key={tool.id}
                  onClick={() => onOpenTool(tool.id)}
                  className="group relative flex min-h-[200px] flex-col items-start overflow-hidden rounded-[22px] border border-white/[.09] bg-gradient-to-br from-[#162132] to-[#101722] p-6 text-left transition-colors duration-150 hover:border-cyan-300/45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:min-h-[226px]"
                >
                  {/* Tool icon */}
                  <span className="mb-6 grid h-12 w-12 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 ">
                    <Icon size={23} />
                  </span>

                  <span className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-cyan-300/85">
                    {tool.category}
                  </span>

                  <strong className="mb-2 text-base font-semibold tracking-tight text-white">
                    {tool.name}
                  </strong>

                  <span className="max-w-[90%] text-sm leading-6 text-slate-400">
                    {tool.description}
                  </span>

                  <span className="absolute right-6 top-7 text-slate-500 transition-colors group-hover:text-cyan-300">
                    <ArrowRight size={18} />
                  </span>
                </button>
              );
            })}
          </div>

          {/* Empty search result */}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-white/10 p-8 text-center">
              <Search
                size={25}
                className="mx-auto mb-3 text-slate-500"
              />

              <p className="text-sm text-slate-400">
                No tools match your search.
                Try another keyword or category.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All tools");
                }}
                className="mt-4 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================= BENEFITS ================= */}
      <section id="features" className="relative scroll-mt-24 border-t border-white/[.06] px-5 py-14 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.22em] text-cyan-300">BUILT TO MAKE THINGS EASIER</p>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">Less switching tabs. <span className="text-cyan-300">More getting done.</span></h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">A growing collection of everyday tools, together in one lightweight workspace.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: Zap, title: "Fast by design", text: "Open a tool and get started without an account or an elaborate setup." },
              { icon: ShieldCheck, title: "Privacy-conscious", text: "Tools are designed to process data in your browser wherever possible." },
              { icon: Globe2, title: "One place for more", text: "Images, writing, calculations, developer helpers and utilities together." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="relative overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-br from-[#14263a] to-[#0b1220] p-6 transition-colors hover:border-cyan-400/40">
                <span className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-cyan-400/[.07] blur-3xl" />
                <span className="mb-6 grid h-11 w-11 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"><Icon size={21} /></span>
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="scroll-mt-24 border-y border-white/[.06] bg-[#0b1421]/75 px-5 py-14 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[11px] font-bold tracking-[.22em] text-cyan-300">THREE SIMPLE STEPS</p>
              <h2 className="text-2xl font-bold text-white sm:text-4xl">Your next task, <span className="text-sky-300">simplified.</span></h2>
            </div>
            <a href="#tools" className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition hover:text-white">Start exploring <ArrowRight size={16} /></a>
          </div>
          <div className="relative mt-10 grid gap-4 md:grid-cols-3">
            {[
              { number: "01", icon: Search, title: "Find a tool", text: "Search by keyword or browse a category to find what you need." },
              { number: "02", icon: MousePointerClick, title: "Make it yours", text: "Add your text, numbers or files and adjust the settings." },
              { number: "03", icon: Download, title: "Get your result", text: "Copy, use or download the output and get on with your day." },
            ].map(({ number, icon: Icon, title, text }) => (
              <div key={number} className="rounded-[22px] border border-white/10 bg-[#101b2b] p-6">
                <div className="mb-8 flex items-start justify-between"><span className="text-3xl font-black tracking-tight text-cyan-400/25">{number}</span><Icon size={22} className="text-cyan-300" /></div>
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="scroll-mt-24 px-5 py-14 sm:px-8 sm:py-24"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[28px] border border-white/10 bg-gradient-to-br from-[#172438] via-[#111b2b] to-[#0b1422] p-8 sm:p-12 md:flex-row md:items-center">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
            <LockKeyhole size={29} />
          </div>

          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold tracking-[.2em] text-cyan-300">
              BUILT FOR EVERYDAY WORK
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Simple by design.{" "}
              <span className="text-cyan-300">
                Useful by default.
              </span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              ToolVerse makes everyday digital tasks faster,
              with straightforward browser-based tools and no
              unnecessary signups. Image processing happens on
              your device where supported.
            </p>
          </div>

          <div className="md:ml-auto">
            <Zap
              className="hidden text-cyan-300/30 md:block"
              size={70}
              strokeWidth={1}
            />
          </div>
        </div>
      </section>

      {/* ================= CONTACT & FEEDBACK ================= */}
      <section id="contact" className="scroll-mt-24 px-5 pb-24 pt-4 sm:px-8 sm:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-cyan-300/20 bg-gradient-to-br from-[#12334b] via-[#101f34] to-[#11162b] p-7 shadow-[0_0_65px_rgba(34,211,238,.08)] sm:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-[80px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-1/4 h-60 w-60 rounded-full bg-violet-400/10 blur-[80px]" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-200"><HeartHandshake size={15} /> OPEN TO FEEDBACK</span>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">Have an idea to make <span className="text-cyan-300">ToolVerse better?</span></h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">Feel free to contact me for improvement advice, bug reports, feature suggestions or general feedback. Your ideas can help shape what comes next.</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3">
              <a href="mailto:galvoid.tech@gmail.com?subject=ToolVerse%20Feedback" className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,.2)] transition-colors hover:brightness-110"><Mail size={18} /> Send feedback <ArrowUpRight size={16} /></a>
              <a href="https://github.com/Tanvir-Azad-Mahir" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[.05] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10"><GitBranch size={17} /> Developer's GitHub <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
