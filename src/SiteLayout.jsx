import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  ChevronRight,
  Heart,
  Mail,
  Menu,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

function GithubIcon({ className = "", size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const navLinks = [
  { label: "Tools", anchor: "tools" },
  { label: "Architecture", anchor: "features" },
  { label: "How It Works", anchor: "how-it-works" },
  { label: "About", anchor: "about" },
  { label: "Feedback", anchor: "feedback" },
];

const popularShortcuts = [
  { name: "Image Compressor", id: "compress" },
  { name: "QR Code Generator", id: "qr" },
  { name: "JSON Formatter", id: "json" },
  { name: "Password Generator", id: "password" },
  { name: "Word Counter", id: "words" },
  { name: "UUID Generator", id: "uuid" },
];

export default function SiteLayout({ children, active = "" }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const closeMenu = () => setMobileMenu(false);
    window.addEventListener("hashchange", closeMenu);
    return () => window.removeEventListener("hashchange", closeMenu);
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (active) {
        setScrolledPastHero(true);
        return;
      }
      setScrolledPastHero(window.scrollY > 320);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [active]);

  function triggerPalette() {
    window.dispatchEvent(new CustomEvent("toolverse:open-palette"));
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-[#090A0F] font-sans text-slate-100 selection:bg-emerald-500/25 selection:text-white">
      {/* Ambient background glows - subtle and premium */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent_70%)]"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* ================= HEADER ================= */}
        <header
          className={`border-b border-white/[0.08] bg-[#090A0F]/90 shadow-lg shadow-black/30 backdrop-blur-xl transition-all duration-300 ${
            active
              ? "sticky top-0 z-50 translate-y-0 opacity-100 pointer-events-auto"
              : `fixed top-0 left-0 right-0 z-50 ${
                  scrolledPastHero
                    ? "translate-y-0 opacity-100 pointer-events-auto"
                    : "-translate-y-full opacity-0 pointer-events-none"
                }`
          }`}
        >
          <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-8 lg:px-10">
            {/* Logo */}
            <a
              href="#"
              onClick={() => setMobileMenu(false)}
              className="group inline-flex min-w-0 shrink-0 items-center gap-3"
              aria-label="ToolVerse homepage"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#121622] p-1.5 shadow-md shadow-emerald-500/10 ring-1 ring-white/10 transition-transform duration-200 group-hover:scale-105">
                <img src="/log2.png" alt="ToolVerse logo" className="h-full w-full object-contain" />
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-[#090A0F]">
                  <span className="h-1.5 w-1.5 animate-ping rounded-full bg-emerald-100" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="flex items-center gap-2 text-lg font-black tracking-tight text-white">
                  ToolVerse
                  <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    v2.0
                  </span>
                </span>
                <span className="-mt-1 text-[10px] font-medium tracking-wider uppercase text-slate-500">
                  Client-side utility suite
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 text-xs font-semibold text-slate-300 backdrop-blur-md md:flex"
            >
              {navLinks.map(({ label, anchor }) => (
                <a
                  key={anchor}
                  href={`#${anchor}`}
                  onClick={() => setMobileMenu(false)}
                  className="rounded-full px-3.5 py-1.5 transition-colors hover:bg-white/[0.08] hover:text-white"
                >
                  {label}
                </a>
              ))}
            </nav>

            {/* Header Right Actions */}
            <div className="hidden items-center gap-2.5 sm:flex">
              {/* Quick Search trigger */}
              <button
                type="button"
                onClick={triggerPalette}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-slate-400 transition-all hover:border-emerald-500/40 hover:bg-white/[0.07] hover:text-white"
                title="Search tools (⌘K)"
              >
                <Search size={14} className="text-emerald-400" />
                <span>Search tools</span>
                <kbd className="rounded border border-white/10 bg-white/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
                  ⌘K
                </kbd>
              </button>

              {/* GitHub Link */}
              <a
                href="https://github.com/Tanvir-Azad-Mahir/toolverse"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 transition-colors hover:border-white/20 hover:text-white"
                aria-label="View source on GitHub"
              >
                <GithubIcon size={16} />
              </a>

              {/* Explore CTA */}
              <a
                href="#tools"
                onClick={() => setMobileMenu(false)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-[#022c22] shadow-sm shadow-emerald-500/30 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/40"
              >
                Browse Tools <ArrowRight size={14} />
              </a>
            </div>

            {/* Mobile menu trigger */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={triggerPalette}
                aria-label="Open search"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-300"
              >
                <Search size={18} />
              </button>
              <button
                type="button"
                onClick={() => setMobileMenu((value) => !value)}
                aria-label={mobileMenu ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenu}
                aria-controls="mobile-site-menu"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white"
              >
                {mobileMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          {mobileMenu && (
            <div
              id="mobile-site-menu"
              className="border-t border-white/10 bg-[#0c1018] px-4 py-4 sm:hidden"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map(({ label, anchor }) => (
                  <a
                    key={anchor}
                    href={`#${anchor}`}
                    onClick={() => setMobileMenu(false)}
                    className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-200 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                  >
                    {label}
                  </a>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenu(false);
                    triggerPalette();
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] py-2.5 text-xs font-semibold text-slate-200"
                >
                  <Search size={15} /> Search tools (⌘K)
                </button>
                <a
                  href="https://github.com/Tanvir-Azad-Mahir/toolverse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] py-2.5 text-xs font-semibold text-slate-400"
                >
                  <GithubIcon size={15} /> Star on GitHub
                </a>
              </div>
            </div>
          )}
        </header>

        {/* Content */}
        {children}

        {/* ================= FOOTER ================= */}
        <footer className="relative mt-auto border-t border-white/[0.08] bg-[#07090E]">
          <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 sm:px-8 lg:px-10">
            <div className="grid gap-10 md:grid-cols-4 lg:gap-12">
              {/* Col 1: Brand & Promise */}
              <div className="md:col-span-1">
                <a
                  href="#"
                  className="inline-flex items-center gap-2.5 text-lg font-black tracking-tight text-white"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#121622] p-1.5 shadow-md">
                    <img src="/log2.png" alt="ToolVerse logo" className="h-full w-full object-contain" />
                  </div>
                  <span>ToolVerse</span>
                </a>
                <p className="mt-4 text-xs leading-relaxed text-slate-400">
                  High-speed, browser-based multi-tools for developers, designers, and creators.
                  100% private with zero server transmission.
                </p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5 text-[11px] font-medium text-emerald-300">
                  <ShieldCheck size={14} /> Zero Server Storage
                </div>
              </div>

              {/* Col 2: Popular Tools */}
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
                  Popular Tools
                </h3>
                <div className="flex flex-col gap-2.5">
                  {popularShortcuts.map(({ name, id }) => (
                    <a
                      key={id}
                      href={`#${id}`}
                      className="text-xs text-slate-400 transition-colors hover:text-emerald-400"
                    >
                      {name}
                    </a>
                  ))}
                </div>
              </div>

              {/* Col 3: Navigation */}
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
                  Navigation
                </h3>
                <div className="flex flex-col gap-2.5">
                  {navLinks.map(({ label, anchor }) => (
                    <a
                      key={anchor}
                      href={`#${anchor}`}
                      className="group inline-flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-emerald-400"
                    >
                      <span>{label}</span>
                      <ChevronRight
                        size={12}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </a>
                  ))}
                </div>
              </div>

              {/* Col 4: Contact & Open Source */}
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-white">
                  Connect & Contribute
                </h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  Have a suggestion or tool idea? ToolVerse is continually updated with new utilities.
                </p>
                <div className="mt-4 flex flex-col gap-2.5">
                  <a
                    href="#feedback"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs font-medium text-slate-200 transition-colors hover:border-emerald-500/30 hover:bg-emerald-500/[0.06] hover:text-white"
                  >
                    <Mail size={14} className="text-emerald-400" />
                    <span>galvoid.tech@gmail.com</span>
                  </a>
                  <a
                    href="https://github.com/Tanvir-Azad-Mahir/toolverse"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs font-medium text-slate-200 transition-colors hover:border-white/20 hover:text-white"
                  >
                    <GithubIcon size={14} className="text-slate-400" />
                    <span>GitHub Repository</span>
                    <ArrowUpRight size={12} className="ml-auto text-slate-500" />
                  </a>
                </div>
              </div>
            </div>

            {/* Sub-footer */}
            <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 text-xs text-slate-500 sm:flex-row">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  All 22 Tools Operational
                </span>
                <span>© {new Date().getFullYear()} ToolVerse.</span>
              </div>

              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  Crafted with{" "}
                  <Heart size={12} className="fill-emerald-400/30 text-emerald-400" /> by{" "}
                  <a
                    href="https://github.com/Tanvir-Azad-Mahir"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-slate-300 transition-colors hover:text-emerald-400"
                  >
                    Tanvir Azad Mahir
                  </a>
                </span>
                <button
                  type="button"
                  onClick={scrollToTop}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400 transition-colors hover:border-white/20 hover:text-white"
                  title="Back to top"
                  aria-label="Back to top"
                >
                  <ArrowUp size={14} />
                </button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
