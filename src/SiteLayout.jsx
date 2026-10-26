
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
  Mail,
  Menu,
  X,
  Heart,
  GitBranch,
} from "lucide-react";

export default function SiteLayout({ children }) {
  const [mobileMenu, setMobileMenu] = useState(false);

  function goHome(anchor = "") {
    setMobileMenu(false);

    if (window.location.hash === `#${anchor}`) {
      if (anchor) {
        document.getElementById(anchor)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    window.location.hash = anchor;
  }

  const navigation = [
    { label: "Explore tools", href: "tools" },
    { label: "Features", href: "features" },
    { label: "How it works", href: "how-it-works" },
    { label: "About", href: "about" },
    { label: "Contact", href: "contact" },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-[#080d16] font-sans text-slate-100 selection:bg-cyan-400/40">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_-25%,rgba(22,105,175,.15),transparent_55%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* HEADER */}
        <header className="sticky top-0 z-50 border-b border-white/[.07] bg-[#080d16]/85 backdrop-blur-2xl">
          <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
            <a
              href="#"
              onClick={() => goHome()}
              className="group inline-flex shrink-0 items-center gap-3"
              aria-label="ToolVerse homepage"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 shadow-[0_0_25px_rgba(34,211,238,.08)]">
                <img
                  src="/log2.png"
                  className="h-8 w-8 object-contain"
                  alt=""
                />
              </span>

              <span className="text-lg font-extrabold tracking-[-.06em] text-white">
                toolverse<span className="text-cyan-400">.</span>
              </span>
            </a>

            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-7 text-sm font-medium text-slate-400 md:flex"
            >
              <a
                href="#tools"
                onClick={() => goHome("tools")}
                className="transition hover:text-cyan-300"
              >
                Explore tools
              </a>

              <a
                href="#features"
                onClick={() => goHome("features")}
                className="transition hover:text-cyan-300"
              >
                Features
              </a>

              <a
                href="#about"
                onClick={() => goHome("about")}
                className="transition hover:text-cyan-300"
              >
                About
              </a>
            </nav>

            <a
              href="#tools"
              onClick={() => goHome("tools")}
              className="hidden items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-400/15 md:inline-flex"
            >
              Browse tools
              <ArrowRight size={16} />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenu((value) => !value)}
              aria-label={mobileMenu ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenu}
              className="rounded-xl border border-white/10 p-2.5 text-slate-200 md:hidden"
            >
              {mobileMenu ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {mobileMenu && (
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col gap-1 border-t border-white/10 bg-[#0d1420] px-5 py-4 md:hidden"
            >
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={`#${item.href}`}
                  onClick={() => goHome(item.href)}
                  className="rounded-lg px-3 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-cyan-300"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          )}
        </header>

        {/* PAGE CONTENT */}
        {children}

        {/* FOOTER */}
        <footer className="relative mt-auto overflow-hidden border-t border-white/[.07] bg-[#070e19]">
          {/* Top ambient glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[-180px] h-[380px] w-[700px] -translate-x-1/2 rounded-full bg-cyan-500/[.055] blur-[110px]"
          />

          <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            {/* Footer columns */}
            <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">
              {/* Brand */}
              <div className="max-w-xs">
                <a
                  href="#"
                  onClick={() => goHome()}
                  className="inline-flex items-center gap-3"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                    <img
                      src="/log2.png"
                      alt=""
                      className="h-9 w-9 object-contain"
                    />
                  </span>

                  <span className="text-xl font-extrabold tracking-[-.055em] text-white">
                    toolverse<span className="text-cyan-400">.</span>
                  </span>
                </a>

                <p className="mt-5 text-sm leading-7 text-slate-400">
                  Simple, powerful digital tools for your everyday
                  tasks. Built to make your workflow faster and easier.
                </p>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[.055] px-3 py-1.5 text-[11px] font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Free online tools
                </div>
              </div>

              {/* Quick links */}
              <div>
                <h3 className="mb-5 text-sm font-semibold text-white">
                  Quick Links
                </h3>

                <div className="flex flex-col items-start gap-3.5">
                  {navigation.map((item) => (
                    <a
                      key={item.href}
                      href={`#${item.href}`}
                      onClick={() => goHome(item.href)}
                      className="group inline-flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-cyan-300"
                    >
                      <ChevronRight
                        size={14}
                        className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-cyan-300"
                      />
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="mb-5 text-sm font-semibold text-white">
                  Explore
                </h3>

                <div className="flex flex-col items-start gap-3.5">
                  {[
                    "Image Tools",
                    "Developer Tools",
                    "Writing Tools",
                    "Calculators",
                    "Utilities",
                  ].map((label) => (
                    <a
                      key={label}
                      href="#tools"
                      onClick={() => goHome("tools")}
                      className="text-sm text-slate-400 transition hover:text-cyan-300"
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Developer & contact */}
              <div>
                <h3 className="mb-5 text-sm font-semibold text-white">
                  Connect
                </h3>

                <a
                  href="https://github.com/Tanvir-Azad-Mahir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-sm text-slate-400 transition hover:text-cyan-300"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[.04] text-cyan-300">
                    <GitBranch size={17} />
                  </span>

                  <span className="min-w-0">
                    <span className="block font-semibold text-slate-200 transition group-hover:text-cyan-300">
                      Tanvir Azad Mahir
                    </span>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                      Developer's GitHub
                      <ArrowUpRight size={12} />
                    </span>
                  </span>
                </a>

                <a
                  href="mailto:galvoid.tech@gmail.com"
                  className="group mt-5 flex items-start gap-3 text-sm text-slate-400 transition hover:text-cyan-300"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[.04] text-cyan-300">
                    <Mail size={17} />
                  </span>

                  <span className="min-w-0">
                    <span className="block font-semibold text-slate-200 transition group-hover:text-cyan-300">
                      Email
                    </span>
                    <span className="mt-1 block break-all text-xs text-slate-500">
                      galvoid.tech@gmail.com
                    </span>
                  </span>
                </a>
              </div>
            </div>

            {/* Bottom footer */}
            <div className="flex flex-col gap-4 border-t border-white/[.08] py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <p>
                © {new Date().getFullYear()} ToolVerse. All rights reserved.
              </p>

              <p className="flex flex-wrap items-center gap-1.5">
                Developed with
                <Heart
                  size={13}
                  className="fill-cyan-400/20 text-cyan-300"
                />
                by
                <a
                  href="https://github.com/Tanvir-Azad-Mahir"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  Tanvir Azad Mahir
                </a>
                <ArrowUpRight size={12} className="text-cyan-400" />
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
