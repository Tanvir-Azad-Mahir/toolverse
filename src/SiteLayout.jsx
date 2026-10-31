import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  GitBranch,
  Heart,
  Mail,
  Menu,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

const navLinks = [
  { label: "Explore tools", anchor: "tools" },
  { label: "Why ToolVerse", anchor: "features" },
  { label: "About", anchor: "about" },
  { label: "Contact", anchor: "contact" },
];

export default function SiteLayout({ children }) {
  const [mobileMenu, setMobileMenu] = useState(false);

  // Collapse the menu when navigation changes outside of it (Back/Forward,
  // Related Tools, command palette, or direct hash navigation).
  useEffect(() => {
    const closeMenu = () => setMobileMenu(false);
    window.addEventListener("hashchange", closeMenu);
    return () => window.removeEventListener("hashchange", closeMenu);
  }, []);


  return (
    <div className="min-h-screen overflow-x-clip bg-[#080d16] font-sans text-slate-100 selection:bg-cyan-400/40">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_-25%,rgba(22,105,175,.18),transparent_55%)]" />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b border-cyan-400/10 bg-[#080d16]/85 shadow-[0_8px_45px_rgba(0,0,0,.16)] backdrop-blur-2xl">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
          <div className="mx-auto flex h-[64px] max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-8 lg:px-10">
            <a href="#" onClick={() => setMobileMenu(false)} className="group inline-flex min-w-0 shrink-0 items-center gap-2 sm:gap-3" aria-label="ToolVerse homepage">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,.12)] transition group-hover:shadow-[0_0_34px_rgba(34,211,238,.35)]">
                <img src="/log2.png" className="h-8 w-8 object-contain" alt="" />
              </span>
              <span className="truncate text-base font-extrabold tracking-[-.055em] text-white sm:text-lg">toolverse<span className="text-cyan-400">.</span></span>
            </a>
            <nav aria-label="Main navigation" className="hidden items-center gap-6 text-xs font-semibold text-slate-400 lg:flex">
              {navLinks.map(({ label, anchor }) => (
                <a key={anchor} href={`#${anchor}`} onClick={() => setMobileMenu(false)} className="transition hover:text-cyan-300">{label}</a>
              ))}
            </nav>
            <a href="#tools" onClick={() => setMobileMenu(false)} className="hidden items-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/10 px-4 py-2.5 text-xs font-bold text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,.07)] transition hover:border-cyan-400/55 hover:bg-cyan-400/15 lg:inline-flex">
              Browse tools <ArrowRight size={16} />
            </a>
            <button type="button" onClick={() => setMobileMenu((value) => !value)} aria-label={mobileMenu ? "Close menu" : "Open menu"} aria-expanded={mobileMenu} aria-controls="mobile-site-menu" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 lg:hidden">
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {mobileMenu && (
            <nav id="mobile-site-menu" aria-label="Mobile navigation" className="flex max-h-[calc(100dvh-64px)] flex-col gap-1 overflow-y-auto border-t border-white/10 bg-[#0d1420] px-4 py-3 lg:hidden">
              {navLinks.map(({ label, anchor }) => (
                <a key={anchor} href={`#${anchor}`} onClick={() => setMobileMenu(false)} className="flex min-h-11 items-center rounded-lg px-3 py-3 text-sm text-slate-200 hover:bg-cyan-400/10 hover:text-cyan-200 focus-visible:outline-2 focus-visible:outline-cyan-300">{label}</a>
              ))}
            </nav>
          )}
        </header>

        {children}

        <footer className="relative mt-auto overflow-hidden border-t border-cyan-400/15 bg-[#080f1b]">
          <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-28 h-80 w-80 rounded-full bg-cyan-500/10 blur-[95px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

          <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 lg:px-10">
            <div className="grid gap-10 md:grid-cols-[1.25fr_.8fr_1fr] lg:gap-14">
              <div>
                <a href="#" onClick={() => setMobileMenu(false)} className="inline-flex items-center gap-3 text-lg font-extrabold tracking-tight text-white">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 shadow-[0_0_24px_rgba(34,211,238,.12)]"><img src="/log2.png" alt="" className="h-8 w-8 object-contain" /></span>
                  toolverse<span className="-ml-3 text-cyan-400">.</span>
                </a>
                <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">Small tools. Big convenience. A growing collection of free browser-based utilities for your everyday digital tasks.</p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[.06] px-3 py-1.5 text-[11px] font-medium text-emerald-300"><ShieldCheck size={14} /> Free to use. No signup required.</div>
              </div>

              <div>
                <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-white"><Sparkles size={15} className="text-cyan-300" /> Explore</h3>
                <div className="flex flex-col items-start gap-3">
                  {navLinks.map(({ label, anchor }) => (
                    <a key={anchor} href={`#${anchor}`} onClick={() => setMobileMenu(false)} className="group inline-flex items-center gap-1 text-sm text-slate-400 transition hover:translate-x-1 hover:text-cyan-300">{label} <ChevronRight size={13} className="opacity-0 transition group-hover:opacity-100" /></a>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-white">Suggestions welcome</h3>
                <p className="max-w-sm text-sm leading-7 text-slate-400">Have an idea, found a bug, or want to suggest an improvement? Feel free to contact me.</p>
                <a href="mailto:galvoid.tech@gmail.com?subject=ToolVerse%20Feedback" className="mt-5 inline-flex max-w-full items-center gap-2 break-all rounded-xl border border-cyan-300/20 bg-cyan-400/[.07] px-3 py-3 text-xs font-semibold text-cyan-200 transition hover:border-cyan-300/50 hover:bg-cyan-400/[.12]"><Mail size={16} className="shrink-0" /> galvoid.tech@gmail.com <ArrowUpRight size={14} className="shrink-0" /></a>
                <a href="https://github.com/Tanvir-Azad-Mahir" target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-cyan-300"><GitBranch size={16} /> View developer profile <ArrowUpRight size={14} /></a>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>© {new Date().getFullYear()} ToolVerse. All rights reserved.</span>
              <span className="inline-flex flex-wrap items-center gap-1.5">Developed with <Heart size={13} className="fill-cyan-400/30 text-cyan-300" /> by <a href="https://github.com/Tanvir-Azad-Mahir" target="_blank" rel="noopener noreferrer" className="font-bold text-cyan-300 underline-offset-4 transition hover:text-white hover:underline">Tanvir Azad Mahir</a><ArrowUpRight size={13} /></span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
