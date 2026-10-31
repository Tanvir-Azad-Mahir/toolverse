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

  useEffect(() => {
    const closeMenu = () => setMobileMenu(false);
    window.addEventListener("hashchange", closeMenu);
    return () => window.removeEventListener("hashchange", closeMenu);
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#101210] font-sans text-[#F0FDF4] selection:bg-[#86EFAC]/25">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_-25%,rgba(70,110,80,.12),transparent_55%)]"
      />
      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 border-b border-[#86EFAC]/10 bg-[#101210]/90 shadow-[0_8px_30px_rgba(0,0,0,.16)] backdrop-blur-xl">
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#86EFAC]/25 to-transparent" />
          <div className="mx-auto flex h-[64px] max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-8 lg:px-10">
            <a href="#" onClick={() => setMobileMenu(false)} className="group inline-flex min-w-0 shrink-0 items-center gap-2 sm:gap-3" aria-label="ToolVerse homepage">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#86EFAC]/20 bg-[#1B2420] transition-colors group-hover:border-[#86EFAC]/45">
                <img src="/log2.png" className="h-8 w-8 object-contain" alt="" />
              </span>
              <span className="truncate text-base font-extrabold tracking-[-.055em] text-[#F0FDF4] sm:text-lg">toolverse<span className="text-[#86EFAC]">.</span></span>
            </a>
            <nav aria-label="Main navigation" className="hidden items-center gap-6 text-xs font-semibold text-[#94A3A0] lg:flex">
              {navLinks.map(({ label, anchor }) => (
                <a key={anchor} href={`#${anchor}`} onClick={() => setMobileMenu(false)} className="transition-colors hover:text-[#86EFAC] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#86EFAC]">{label}</a>
              ))}
            </nav>
            <a href="#tools" onClick={() => setMobileMenu(false)} className="hidden items-center gap-2 rounded-xl border border-[#86EFAC]/25 bg-[#86EFAC]/10 px-4 py-2.5 text-xs font-bold text-[#D9FBE3] transition-colors hover:border-[#86EFAC]/50 hover:bg-[#86EFAC]/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86EFAC] lg:inline-flex">
              Browse tools <ArrowRight size={16} />
            </a>
            <button type="button" onClick={() => setMobileMenu((value) => !value)} aria-label={mobileMenu ? "Close menu" : "Open menu"} aria-expanded={mobileMenu} aria-controls="mobile-site-menu" className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-[#F0FDF4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#86EFAC] lg:hidden">
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          {mobileMenu && (
            <nav id="mobile-site-menu" aria-label="Mobile navigation" className="flex max-h-[calc(100dvh-64px)] flex-col gap-1 overflow-y-auto border-t border-white/10 bg-[#171D19] px-4 py-3 lg:hidden">
              {navLinks.map(({ label, anchor }) => (
                <a key={anchor} href={`#${anchor}`} onClick={() => setMobileMenu(false)} className="flex min-h-11 items-center rounded-lg px-3 py-3 text-sm text-[#D4DED7] hover:bg-[#86EFAC]/10 hover:text-[#86EFAC] focus-visible:outline-2 focus-visible:outline-[#86EFAC]">{label}</a>
              ))}
            </nav>
          )}
        </header>

        {children}

        <footer className="relative mt-auto overflow-hidden border-t border-[#86EFAC]/15 bg-[#131815]">
          <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-28 h-80 w-80 rounded-full bg-[#86EFAC]/[0.035] blur-[95px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#86EFAC]/25 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 lg:px-10">
            <div className="grid gap-10 md:grid-cols-[1.25fr_.8fr_1fr] lg:gap-14">
              <div>
                <a href="#" onClick={() => setMobileMenu(false)} className="inline-flex items-center gap-3 text-lg font-extrabold tracking-tight text-[#F0FDF4]">
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-[#86EFAC]/20 bg-[#1B2420]"><img src="/log2.png" alt="" className="h-8 w-8 object-contain" /></span>
                  toolverse<span className="-ml-3 text-[#86EFAC]">.</span>
                </a>
                <p className="mt-5 max-w-xs text-sm leading-7 text-[#94A3A0]">Small tools. Big convenience. A growing collection of free browser-based utilities for your everyday digital tasks.</p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#86EFAC]/15 bg-[#86EFAC]/[.06] px-3 py-1.5 text-[11px] font-medium text-[#A7F3BF]"><ShieldCheck size={14} /> Free to use. No signup required.</div>
              </div>
              <div>
                <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#F0FDF4]"><Sparkles size={15} className="text-[#86EFAC]" /> Explore</h3>
                <div className="flex flex-col items-start gap-3">
                  {navLinks.map(({ label, anchor }) => (
                    <a key={anchor} href={`#${anchor}`} onClick={() => setMobileMenu(false)} className="group inline-flex items-center gap-1 text-sm text-[#94A3A0] transition-colors hover:text-[#86EFAC]">{label} <ChevronRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" /></a>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-5 text-xs font-bold uppercase tracking-[.2em] text-[#F0FDF4]">Suggestions welcome</h3>
                <p className="max-w-sm text-sm leading-7 text-[#94A3A0]">Have an idea, found a bug, or want to suggest an improvement? Feel free to contact me.</p>
                <a href="mailto:galvoid.tech@gmail.com?subject=ToolVerse%20Feedback" className="mt-5 inline-flex max-w-full items-center gap-2 break-all rounded-xl border border-[#86EFAC]/20 bg-[#86EFAC]/[.07] px-3 py-3 text-xs font-semibold text-[#C6F6D5] transition-colors hover:border-[#86EFAC]/45 hover:bg-[#86EFAC]/[.12]"><Mail size={16} className="shrink-0" /> galvoid.tech@gmail.com <ArrowUpRight size={14} className="shrink-0" /></a>
                <a href="https://github.com/Tanvir-Azad-Mahir" target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-2 text-xs font-medium text-[#94A3A0] transition-colors hover:text-[#86EFAC]"><GitBranch size={16} /> View developer profile <ArrowUpRight size={14} /></a>
              </div>
            </div>
            <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-xs text-[#94A3A0] sm:flex-row sm:items-center sm:justify-between">
              <span>© {new Date().getFullYear()} ToolVerse. All rights reserved.</span>
              <span className="inline-flex flex-wrap items-center gap-1.5">Developed with <Heart size={13} className="fill-[#86EFAC]/25 text-[#86EFAC]" /> by <a href="https://github.com/Tanvir-Azad-Mahir" target="_blank" rel="noopener noreferrer" className="font-bold text-[#86EFAC] underline-offset-4 transition-colors hover:text-white hover:underline">Tanvir Azad Mahir</a><ArrowUpRight size={13} /></span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
