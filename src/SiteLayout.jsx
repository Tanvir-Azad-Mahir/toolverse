import { useState } from "react";
import { ArrowRight, ChevronRight, Menu, X } from "lucide-react";

export default function SiteLayout({ children }) {
  const [mobileMenu, setMobileMenu] = useState(false);

  function goHome(anchor = "") {
    setMobileMenu(false);
    window.location.hash = anchor;
    if (!anchor) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-[#080d16] font-sans text-slate-100 selection:bg-cyan-400/40">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_-25%,rgba(22,105,175,.15),transparent_55%)]" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b border-white/[.06] bg-[#080d16]/80 backdrop-blur-2xl">
          <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
            <a href="#" onClick={() => goHome()} className="group inline-flex shrink-0 items-center gap-3" aria-label="ToolVerse homepage">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,.08)]">
                <img src="/log2.png" className="h-8 w-8 object-contain" alt="" />
              </span>
              <span className="text-xl font-extrabold tracking-[-.065em] text-white">toolverse<span className="text-cyan-400">.</span></span>
            </a>
            <nav aria-label="Main navigation" className="hidden items-center gap-8 text-sm font-medium text-slate-400 md:flex">
              <a href="#tools" onClick={() => goHome("tools")} className="transition hover:text-white">Explore tools</a>
              <a href="#about" onClick={() => goHome("about")} className="transition hover:text-white">About</a>
            </nav>
            <a href="#tools" onClick={() => goHome("tools")} className="hidden items-center gap-2 rounded-xl border border-white/15 bg-white/[.06] px-4 py-2.5 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10 md:inline-flex">
              Browse tools <ArrowRight size={16} />
            </a>
            <button type="button" onClick={() => setMobileMenu((v) => !v)} aria-label={mobileMenu ? "Close menu" : "Open menu"} aria-expanded={mobileMenu} className="rounded-xl border border-white/10 p-2.5 text-slate-200 md:hidden">
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {mobileMenu && (
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1 border-t border-white/10 bg-[#0d1420] px-5 py-4 md:hidden">
              <a href="#tools" onClick={() => goHome("tools")} className="rounded-lg px-3 py-3 text-sm text-slate-200 hover:bg-white/5">Explore tools</a>
              <a href="#about" onClick={() => goHome("about")} className="rounded-lg px-3 py-3 text-sm text-slate-200 hover:bg-white/5">About ToolVerse</a>
            </nav>
          )}
        </header>
        {children}
        <footer className="border-t border-white/[.07] bg-[#090f19]">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
            <div>
              <a href="#" onClick={() => goHome()} className="inline-flex items-center gap-2.5 text-lg font-extrabold tracking-[-.06em] text-white"><img src="/log2.png" alt="" className="h-8 w-8 object-contain" />toolverse<span className="-ml-2 text-cyan-400">.</span></a>
              <p className="mt-2 text-xs text-slate-500">Useful tools. Less friction.</p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-400">
              <a href="#tools" onClick={() => goHome("tools")} className="hover:text-cyan-300">All tools <ChevronRight size={12} className="inline" /></a>
              <a href="#about" onClick={() => goHome("about")} className="hover:text-cyan-300">About</a>
            </div>
          </div>
          <div className="border-t border-white/[.06] py-5 text-center text-xs text-slate-600">© {new Date().getFullYear()} ToolVerse. All rights reserved.</div>
        </footer>
      </div>
    </div>
  );
}
