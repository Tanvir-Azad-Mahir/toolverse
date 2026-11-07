import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock3,
  Command,
  Copy,
  CornerDownLeft,
  Cpu,
  GitBranch,
  HeartHandshake,
  LayoutGrid,
  List,
  LockKeyhole,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  X,
  Zap,
} from "lucide-react";

import { tools, categories, categoryMeta } from "./toolData";
import { triggerAdWithFrequency } from "./utils/monetag";

const searchableTools = tools.map((tool) => ({
  tool,
  keywords: `${tool.name} ${tool.description} ${tool.category} ${tool.tag || ""}`.toLowerCase(),
}));

const popularToolNames = [
  "Image Compressor",
  "QR Code Generator",
  "JSON Formatter",
  "Word Counter",
  "Password Generator",
  "UUID Generator",
];

const popularTools = popularToolNames
  .map((name) => tools.find((tool) => tool.name === name))
  .filter(Boolean);

const FAVORITES_KEY = "toolverse:favorites:v1";
const RECENTS_KEY = "toolverse:recents:v1";
const VIEW_MODE_KEY = "toolverse:view_mode:v1";
const MAX_RECENTS = 6;
const TOOLS_PER_PAGE = 9;
const knownIds = new Set(tools.map((tool) => String(tool.id)));
const toolById = new Map(tools.map((tool) => [String(tool.id), tool]));

function readStoredIds(key) {
  try {
    const saved = JSON.parse(window.localStorage.getItem(key) || "[]");
    if (!Array.isArray(saved)) return [];
    return [...new Set(saved.filter((id) => typeof id === "string" && knownIds.has(id)))];
  } catch {
    return [];
  }
}

function storeIds(key, ids) {
  try {
    window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // Fail-safe
  }
}

const faqs = [
  {
    q: "Are my files, tokens, or images uploaded to any server?",
    a: "Never. All 22 tools in ToolVerse execute 100% client-side inside your browser sandbox using Canvas, WebCrypto, and WebAssembly. Your data never touches a remote server.",
  },
  {
    q: "Is ToolVerse completely free to use?",
    a: "Yes, completely free forever with unlimited usage. There are no paid tiers, no account signups, and no artificial daily limits.",
  },
  {
    q: "Can I use ToolVerse offline?",
    a: "Once the website is loaded in your browser, all calculation, formatting, conversion, and encoding utilities continue working without an active internet connection.",
  },
  {
    q: "How can I suggest a new tool or report an issue?",
    a: "You can submit feedback directly via email to galvoid.tech@gmail.com or open an issue on our public GitHub repository.",
  },
];

export default function Landing({ onOpenTool }) {
  const [favorites, setFavorites] = useState(() => readStoredIds(FAVORITES_KEY));
  const [recents, setRecents] = useState(() => readStoredIds(RECENTS_KEY).slice(0, MAX_RECENTS));
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All tools");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState(() => {
    try {
      return window.localStorage.getItem(VIEW_MODE_KEY) || "grid";
    } catch {
      return "grid";
    }
  });

  // Hero Quick Playground state
  const [heroTab, setHeroTab] = useState("text"); // text | password | qr
  const [heroText, setHeroText] = useState("ToolVerse: 22+ client-side tools for modern developers.");
  const [heroCopied, setHeroCopied] = useState(false);
  const [heroPassword, setHeroPassword] = useState("tV7$mK9#xP2@qL5!");
  const [heroPassLength, setHeroPassLength] = useState(16);
  const [heroQrInput, setHeroQrInput] = useState("https://tooluniverse.pages.dev");
  const [heroQrUrl, setHeroQrUrl] = useState("");

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(null);

  // Command palette state
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [paletteIndex, setPaletteIndex] = useState(0);

  const searchRef = useRef(null);
  const paletteRef = useRef(null);
  const paletteDialogRef = useRef(null);
  const videoARef = useRef(null);
  const videoBRef = useRef(null);
  const [heroMenuOpen, setHeroMenuOpen] = useState(false);

  const query = search.trim().toLowerCase();
  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const recentTools = useMemo(
    () => recents.map((id) => toolById.get(id)).filter(Boolean),
    [recents]
  );

  useEffect(() => storeIds(FAVORITES_KEY, favorites), [favorites]);
  useEffect(() => storeIds(RECENTS_KEY, recents), [recents]);

  function changeViewMode(mode) {
    setViewMode(mode);
    try {
      window.localStorage.setItem(VIEW_MODE_KEY, mode);
    } catch {
      // Ignore storage errors
    }
  }

  function toggleFavorite(id, e) {
    if (e) e.stopPropagation();
    const key = String(id);
    setFavorites((previous) =>
      previous.includes(key) ? previous.filter((item) => item !== key) : [...previous, key]
    );
  }

  function openTool(id) {
    const key = String(id);
    triggerAdWithFrequency(
      () => {
        setRecents((previous) =>
          [key, ...previous.filter((item) => item !== key)].slice(0, MAX_RECENTS)
        );
        onOpenTool(id);
      },
      { actionsPerAd: 3, cooldownSeconds: 30 }
    );
  }

  // Generate hero QR code preview
  useEffect(() => {
    let active = true;
    if (!heroQrInput.trim()) {
      Promise.resolve().then(() => {
        if (active) setHeroQrUrl("");
      });
      return () => {
        active = false;
      };
    }
    QRCode.toDataURL(heroQrInput.trim(), {
      width: 180,
      margin: 2,
      color: { dark: "#090A0F", light: "#ffffff" },
    })
      .then((url) => {
        if (active) setHeroQrUrl(url);
      })
      .catch(() => {
        if (active) setHeroQrUrl("");
      });

    return () => {
      active = false;
    };
  }, [heroQrInput]);

  function generateHeroPassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*-_=+";
    const buf = new Uint32Array(heroPassLength);
    crypto.getRandomValues(buf);
    let pass = "";
    for (let i = 0; i < heroPassLength; i++) {
      pass += chars[buf[i] % chars.length];
    }
    setHeroPassword(pass);
    setHeroCopied(false);
  }

  // Keyboard shortcut listener (Cmd+K, /, ESC, and custom event)
  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      } else if (event.key === "/" && !typing && !paletteOpen) {
        event.preventDefault();
        searchRef.current?.focus();
      } else if (event.key === "Escape") {
        if (paletteOpen) setPaletteOpen(false);
        else if (document.activeElement === searchRef.current) {
          setSearch("");
          searchRef.current?.blur();
        }
      }
    }

    function handleCustomOpen() {
      setPaletteOpen(true);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("toolverse:open-palette", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("toolverse:open-palette", handleCustomOpen);
    };
  }, [paletteOpen]);

  // Command palette focus lock
  useEffect(() => {
    if (!paletteOpen) return;
    const previous = document.activeElement;
    paletteRef.current?.focus();
    return () => previous?.focus?.();
  }, [paletteOpen]);

  // Dual video background seamless crossfade loop
  useEffect(() => {
    const vA = videoARef.current;
    const vB = videoBRef.current;
    if (!vA || !vB) return;

    const FADE = 0.9;
    let cur = vA;
    let nxt = vB;

    function onTime() {
      if (cur.duration && cur.currentTime >= cur.duration - FADE) {
        cur.removeEventListener("timeupdate", onTime);
        nxt.currentTime = 0;
        const p = nxt.play();
        if (p && typeof p.catch === "function") p.catch(() => {});
        nxt.classList.add("is-active");
        cur.classList.remove("is-active");
        const old = cur;
        cur = nxt;
        nxt = old;
        cur.addEventListener("timeupdate", onTime);
      }
    }

    const p = cur.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
    cur.addEventListener("timeupdate", onTime);

    return () => {
      vA.removeEventListener("timeupdate", onTime);
      vB.removeEventListener("timeupdate", onTime);
    };
  }, []);

  // Mobile drawer menu outside click & Escape listener
  useEffect(() => {
    if (!heroMenuOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") setHeroMenuOpen(false);
    }
    function handleClickOutside(e) {
      if (!e.target.closest("#menu") && !e.target.closest("#burger")) {
        setHeroMenuOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClickOutside);
    };
  }, [heroMenuOpen]);

  const paletteResults = useMemo(() => {
    const q = paletteQuery.trim().toLowerCase();
    if (q) {
      return searchableTools
        .filter(({ keywords }) => keywords.includes(q))
        .map(({ tool }) => tool);
    }
    const priority = [...favorites, ...recents];
    const seen = new Set();
    return [...priority.map((id) => toolById.get(id)), ...tools].filter((tool) => {
      if (!tool || seen.has(String(tool.id))) return false;
      seen.add(String(tool.id));
      return true;
    });
  }, [paletteQuery, favorites, recents]);

  function handlePaletteKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setPaletteIndex((idx) => (paletteResults.length ? Math.min(idx + 1, paletteResults.length - 1) : 0));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setPaletteIndex((idx) => Math.max(idx - 1, 0));
    } else if (event.key === "Enter" && paletteResults[paletteIndex]) {
      event.preventDefault();
      setPaletteOpen(false);
      openTool(paletteResults[paletteIndex].id);
    }
  }

  const filtered = useMemo(
    () =>
      searchableTools
        .filter(
          ({ tool, keywords }) =>
            (category === "All tools" || tool.category === category) &&
            (!query || keywords.includes(query)) &&
            (!favoritesOnly || favoriteSet.has(String(tool.id)))
        )
        .map(({ tool }) => tool),
    [category, query, favoritesOnly, favoriteSet]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / TOOLS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTools = useMemo(
    () => filtered.slice((safePage - 1) * TOOLS_PER_PAGE, safePage * TOOLS_PER_PAGE),
    [filtered, safePage]
  );

  function goToPage(page) {
    const nextPage = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(nextPage);
    document.getElementById("tool-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  const heroWords = heroText.trim() ? heroText.trim().split(/\s+/).length : 0;
  const heroChars = heroText.length;

  return (
    <main className="relative flex-1">
      {/* ================= COMMAND PALETTE (⌘K) ================= */}
      {paletteOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          onKeyDown={handlePaletteKeyDown}
        >
          <div
            className="fixed inset-0 bg-[#06080D]/80 backdrop-blur-md"
            onClick={() => setPaletteOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={paletteDialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search tools"
            className="relative flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0F131E] shadow-2xl shadow-black/80 ring-1 ring-white/10"
          >
            {/* Input bar */}
            <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-4 py-3.5">
              <Search size={18} className="text-emerald-400" />
              <input
                ref={paletteRef}
                type="text"
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="Type a tool name, category, or command..."
                aria-label="Search tools in command palette"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-white placeholder-slate-500 outline-none focus:ring-0"
              />
              <span className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                ESC
              </span>
              <button
                type="button"
                onClick={() => setPaletteOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>

            {/* List */}
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {!paletteQuery.trim() && (
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Quick Access & Directory
                </div>
              )}
              {paletteResults.length ? (
                paletteResults.map((tool, index) => {
                  const Icon = tool.icon;
                  const selected = index === paletteIndex;
                  const meta = categoryMeta[tool.category] || {
                    color: "#10b981",
                    badge: tool.category,
                  };

                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onMouseEnter={() => setPaletteIndex(index)}
                      onClick={() => {
                        setPaletteOpen(false);
                        openTool(tool.id);
                      }}
                      className={`flex w-full items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-left transition-all ${
                        selected
                          ? "bg-emerald-500/10 text-white ring-1 ring-emerald-500/30"
                          : "text-slate-300 hover:bg-white/[0.04]"
                      }`}
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]"
                        style={{ color: meta.color }}
                      >
                        <Icon size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-semibold">{tool.name}</span>
                          <span
                            className="rounded px-1.5 py-0.2 text-[10px] font-bold"
                            style={{
                              backgroundColor: `${meta.color}15`,
                              color: meta.color,
                            }}
                          >
                            {tool.category}
                          </span>
                        </div>
                        <span className="block truncate text-xs text-slate-400">
                          {tool.description}
                        </span>
                      </div>
                      {favoriteSet.has(String(tool.id)) && (
                        <Star size={14} className="text-amber-400" fill="currentColor" />
                      )}
                      {selected && (
                        <span className="flex items-center gap-1 font-mono text-xs text-emerald-400">
                          Enter <CornerDownLeft size={13} />
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-12 text-center text-sm text-slate-400">
                  No tools found for "{paletteQuery}". Try another keyword.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/10 bg-[#090C14] px-4 py-2.5 text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <ArrowUp size={11} /> <ArrowDown size={11} /> Navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <CornerDownLeft size={11} /> Open tool
                </span>
              </div>
              <span>{paletteResults.length} tools available</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= HERO SECTION ================= */}
      <section className="hero">
        <div
          className="bg"
          role="img"
          aria-label="Stylised globe of Earth rendered as a purple dot matrix against a starfield, slowly rotating"
        >
          <video
            ref={videoARef}
            className="bg-video is-active"
            id="bgVideoA"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4"
            poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp"
            autoPlay
            muted
            playsInline
            loop
            preload="auto"
          />
          <video
            ref={videoBRef}
            className="bg-video"
            id="bgVideoB"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4"
            poster="https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp"
            muted
            playsInline
            preload="auto"
          />
        </div>

        <header className="nav">
          <a href="#" className="logo">
            <img src="/log2.png" alt="ToolVerse logo" />
            <span>ToolVerse</span>
          </a>
          <nav className="nav-links" aria-label="Primary">
            <a href="#tools">Products</a>
            <a href="#features">Pricing</a>
            <a href="#developers">Developers</a>
            <a href="#how-it-works">Resources</a>
            <a href="#contact">Contact Sales</a>
          </nav>
          <div className="nav-actions">
            <button
              type="button"
              className="btn btn-login"
              onClick={() => setPaletteOpen(true)}
            >
              Login
            </button>
            <a href="#tools" className="btn btn-nav-start">
              <span>Get Started</span>
              <svg className="arw" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                <path
                  d="M0.8 5h10M7.1 1.4 10.9 5l-3.8 3.6"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
          <button
            className="burger"
            id="burger"
            type="button"
            aria-label="Open menu"
            aria-expanded={heroMenuOpen}
            aria-controls="menu"
            onClick={() => setHeroMenuOpen((open) => !open)}
          >
            <span />
          </button>
        </header>

        <nav
          className={`menu ${heroMenuOpen ? "open is-open" : ""}`}
          id="menu"
          aria-label="Mobile"
        >
          <a href="#tools" onClick={() => setHeroMenuOpen(false)}>
            Products
          </a>
          <a href="#features" onClick={() => setHeroMenuOpen(false)}>
            Pricing
          </a>
          <a href="#developers" onClick={() => setHeroMenuOpen(false)}>
            Developers
          </a>
          <a href="#how-it-works" onClick={() => setHeroMenuOpen(false)}>
            Resources
          </a>
          <a href="#contact" onClick={() => setHeroMenuOpen(false)}>
            Contact Sales
          </a>
          <div className="divider" />
          <button
            type="button"
            className="btn btn-login"
            style={{ width: "100%", marginBottom: "8px" }}
            onClick={() => {
              setHeroMenuOpen(false);
              setPaletteOpen(true);
            }}
          >
            Login (⌘K)
          </button>
          <a
            href="#tools"
            className="m-start"
            onClick={() => setHeroMenuOpen(false)}
          >
            <span>Get Started</span>
            <svg className="arw" viewBox="0 0 12 10" fill="none" aria-hidden="true">
              <path
                d="M0.8 5h10M7.1 1.4 10.9 5l-3.8 3.6"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </nav>

        <div className="hero-inner">
          <h1>
            <span className="ln">
              <span className="ln-i">Cross-border</span>
            </span>
            <span className="ln">
              <span className="ln-i">finance</span>
            </span>
          </h1>
          <p className="sub">
            Accept payments, manage and custody your assets with ease,
            <br />
            enjoy seamless on/off-ramping between cryptocurrencies and fiat,
            <br />
            and explore integrated eCommerce solutions.
          </p>
          <div className="ctas">
            <a href="#tools" className="btn btn-lg btn-primary">
              <span>Get Started</span>
              <svg className="arw" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                <path
                  d="M0.8 5h10M7.1 1.4 10.9 5l-3.8 3.6"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a href="#contact" className="btn btn-lg btn-ghost">
              <span>Contact Sales</span>
              <svg className="arw" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                <path
                  d="M0.8 5h10M7.1 1.4 10.9 5l-3.8 3.6"
                  stroke="currentColor"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ================= TOOL DIRECTORY & WORKSPACE ================= */}
      <section
        id="tools"
        className="scroll-mt-20 border-t border-white/[0.08] bg-[#0A0D15]/80 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
          {/* Prominent Search Bar & Quick Jump */}
          <div role="search" className="relative z-10 mx-auto mb-12 max-w-2xl">
            <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-[#101522]/90 p-2 shadow-2xl shadow-black/60 ring-1 ring-white/5 backdrop-blur-xl transition-all focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20 sm:p-2.5">
              <Search size={20} className="ml-3 shrink-0 text-slate-400" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search all 22 tools (e.g. compress, qr, json, jwt)..."
                aria-label="Search all tools"
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-white placeholder-slate-500 outline-none focus:ring-0 sm:text-base"
              />
              {search ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    searchRef.current?.focus();
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPaletteOpen(true)}
                  className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/[0.05] px-2 py-1 text-xs text-slate-400 hover:border-emerald-500/30 hover:text-white sm:flex"
                >
                  <Command size={12} /> K
                </button>
              )}
              <a
                href="#tool-results"
                className="shrink-0 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-[#022c22] shadow-sm transition-all hover:bg-emerald-400 hover:shadow-emerald-500/30 sm:px-5 sm:text-sm"
              >
                Find
              </a>
            </div>

            {/* Popular quick tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-slate-500">Quick Jump:</span>
              {popularTools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => openTool(tool.id)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-medium text-slate-300 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300"
                >
                  {tool.name}
                </button>
              ))}
            </div>
          </div>

          {/* ================= INTERACTIVE HERO PLAYGROUND ================= */}
          <div className="mx-auto mb-16 max-w-3xl rounded-2xl border border-white/10 bg-[#0E131E]/90 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Interactive Instant Sandbox</span>
              </div>

              {/* Sandbox Tabs */}
              <div className="flex rounded-lg border border-white/10 bg-white/[0.02] p-1">
                <button
                  type="button"
                  onClick={() => setHeroTab("text")}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                    heroTab === "text"
                      ? "bg-emerald-500/20 text-emerald-300 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Live Text Stats
                </button>
                <button
                  type="button"
                  onClick={() => setHeroTab("password")}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                    heroTab === "password"
                      ? "bg-emerald-500/20 text-emerald-300 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Instant Password
                </button>
                <button
                  type="button"
                  onClick={() => setHeroTab("qr")}
                  className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                    heroTab === "qr"
                      ? "bg-emerald-500/20 text-emerald-300 shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Live QR Preview
                </button>
              </div>
            </div>

            {/* Tab 1: Live Text & Case */}
            {heroTab === "text" && (
              <div className="mt-4 text-left">
                <textarea
                  value={heroText}
                  onChange={(e) => setHeroText(e.target.value)}
                  placeholder="Type or paste any text to see real-time character & word analysis..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#090D15] p-3 text-sm text-slate-200 outline-none transition focus:border-emerald-500/50"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                    <span>
                      Words: <strong className="text-white">{heroWords}</strong>
                    </span>
                    <span>
                      Characters: <strong className="text-white">{heroChars}</strong>
                    </span>
                    <span>
                      Reading time:{" "}
                      <strong className="text-white">
                        {Math.max(1, Math.ceil(heroWords / 200))} min
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHeroText(heroText.toUpperCase())}
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300 hover:bg-white/[0.08]"
                    >
                      UPPER
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroText(heroText.toLowerCase())}
                      className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-300 hover:bg-white/[0.08]"
                    >
                      lower
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(heroText);
                        setHeroCopied(true);
                        setTimeout(() => setHeroCopied(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20"
                    >
                      {heroCopied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{heroCopied ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Instant Password */}
            {heroTab === "password" && (
              <div className="mt-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-xl border border-white/10 bg-[#090D15] px-4 py-3 font-mono text-sm tracking-wider text-emerald-400">
                    {heroPassword}
                  </div>
                  <button
                    type="button"
                    onClick={generateHeroPassword}
                    className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 text-xs font-semibold text-white hover:bg-white/[0.09]"
                  >
                    <RefreshCw size={14} /> Regenerate
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(heroPassword);
                      setHeroCopied(true);
                      setTimeout(() => setHeroCopied(false), 2000);
                    }}
                    className="flex h-11 items-center gap-2 rounded-xl bg-emerald-500 px-4 text-xs font-bold text-[#022c22] hover:bg-emerald-400"
                  >
                    {heroCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{heroCopied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>Length: {heroPassLength} chars</span>
                  <input
                    type="range"
                    min="8"
                    max="32"
                    value={heroPassLength}
                    onChange={(e) => {
                      setHeroPassLength(Number(e.target.value));
                      generateHeroPassword();
                    }}
                    className="w-48 accent-emerald-500"
                  />
                  <span className="font-semibold text-emerald-400">Entropy: High</span>
                </div>
              </div>
            )}

            {/* Tab 3: Live QR Preview */}
            {heroTab === "qr" && (
              <div className="mt-4 flex flex-col items-center gap-4 text-left sm:flex-row">
                <div className="flex-1 w-full">
                  <label className="mb-1 block text-xs font-medium text-slate-400">
                    Target URL or Text:
                  </label>
                  <input
                    type="text"
                    value={heroQrInput}
                    onChange={(e) => setHeroQrInput(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#090D15] p-3 text-sm text-slate-200 outline-none focus:border-emerald-500/50"
                  />
                  <p className="mt-2 text-xs text-slate-400">
                    Renders client-side in &lt;10ms. Open the full QR tool for custom colors & SVG.
                  </p>
                  <button
                    type="button"
                    onClick={() => openTool("qr")}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline"
                  >
                    Open advanced QR generator <ArrowRight size={13} />
                  </button>
                </div>
                {heroQrUrl && (
                  <div className="rounded-xl border border-white/10 bg-white p-2 shadow-lg">
                    <img src={heroQrUrl} alt="Live QR" className="h-28 w-28" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Metrics trust bar */}
          <div className="mx-auto mb-16 grid w-full max-w-4xl grid-cols-2 gap-4 border-y border-white/[0.08] py-8 text-center sm:grid-cols-4">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white sm:text-3xl">22+</span>
              <span className="text-xs font-medium text-slate-400">Free Client Tools</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-emerald-400 sm:text-3xl">0 ms</span>
              <span className="text-xs font-medium text-slate-400">Server Latency</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-teal-400 sm:text-3xl">100%</span>
              <span className="text-xs font-medium text-slate-400">In-Browser Memory</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-white sm:text-3xl">Zero</span>
              <span className="text-xs font-medium text-slate-400">Account Walls</span>
            </div>
          </div>

          {/* Header */}
          <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                THE SUITE
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Explore All Utilities
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-400">
                Fast, dependable tools engineered for daily workflows. Click any card to launch.
              </p>
            </div>

            {/* View Mode & Count */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-400">
                Showing <strong className="text-white">{filtered.length}</strong> of {tools.length}{" "}
                tools
              </span>
              <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
                <button
                  type="button"
                  onClick={() => changeViewMode("grid")}
                  aria-label="Grid view"
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => changeViewMode("list")}
                  aria-label="List view"
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Recently Used Tray */}
          {recentTools.length > 0 && (
            <div className="mb-8 rounded-2xl border border-white/[0.08] bg-[#101522]/80 p-4 backdrop-blur-md">
              <div className="mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Clock3 size={14} className="text-emerald-400" /> Recently Used
                </span>
                <button
                  type="button"
                  onClick={() => setRecents([])}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear history
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentTools.map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => openTool(tool.id)}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-slate-200 transition-all hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300"
                  >
                    <span>{tool.name}</span>
                    <ArrowUpRight size={13} className="text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter Bar: Categories & Favorites */}
          <div className="mb-8 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setFavoritesOnly(false);
                  setCurrentPage(1);
                }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  !favoritesOnly
                    ? "bg-emerald-500 text-[#022c22] shadow-sm shadow-emerald-500/25"
                    : "border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                }`}
              >
                All Tools
              </button>
              <button
                type="button"
                onClick={() => {
                  setFavoritesOnly((prev) => !prev);
                  setCurrentPage(1);
                }}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  favoritesOnly
                    ? "bg-amber-400 text-[#1f1604] shadow-sm shadow-amber-400/25"
                    : "border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                }`}
              >
                <Star size={13} fill={favoritesOnly ? "currentColor" : "none"} />
                <span>Favorites</span>
                {favorites.length > 0 && (
                  <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>

            {/* Category pills */}
            <div
              role="group"
              aria-label="Filter tools by category"
              className="flex flex-wrap gap-2"
            >
              {categories.map((cat) => {
                const isSelected = category === cat && !favoritesOnly;
                const count =
                  cat === "All tools"
                    ? tools.length
                    : tools.filter((t) => t.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setCategory(cat);
                      setFavoritesOnly(false);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? "border-emerald-500/50 bg-emerald-500/15 text-emerald-300"
                        : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="text-[10px] opacity-60">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE FILTER STATUS */}
          {(query || category !== "All tools" || favoritesOnly) && (
            <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] px-4 py-2.5 text-xs text-slate-300">
              <div>
                Filtered by{" "}
                {favoritesOnly && <span className="font-semibold text-amber-300">Favorites</span>}
                {category !== "All tools" && (
                  <span className="font-semibold text-emerald-300"> Category: {category}</span>
                )}
                {query && (
                  <span>
                    {" "}
                    matching <strong className="text-white">"{search.trim()}"</strong>
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All tools");
                  setFavoritesOnly(false);
                }}
                className="flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <X size={13} /> Reset
              </button>
            </div>
          )}

          {/* ================= GRID VIEW ================= */}
          {viewMode === "grid" && (
            <div
              id="tool-results"
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {paginatedTools.map((tool) => {
                const Icon = tool.icon;
                const isFav = favoriteSet.has(String(tool.id));
                const meta = categoryMeta[tool.category] || {
                  color: "#10b981",
                  badge: tool.category,
                };

                return (
                  <div
                    key={tool.id}
                    onClick={() => openTool(tool.id)}
                    className="group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111622]/80 p-6 shadow-lg shadow-black/20 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-[#141B2B] hover:shadow-2xl hover:shadow-emerald-500/10"
                  >
                    {/* Top Row: Category + Star */}
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                          style={{
                            backgroundColor: `${meta.color}15`,
                            color: meta.color,
                            border: `1px solid ${meta.color}30`,
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: meta.color }}
                          />
                          {tool.category}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(tool.id, e)}
                          title={isFav ? "Remove favorite" : "Add to favorites"}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                            isFav
                              ? "text-amber-400"
                              : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"
                          }`}
                        >
                          <Star size={16} fill={isFav ? "currentColor" : "none"} />
                        </button>
                      </div>

                      {/* Icon & Title */}
                      <div className="mt-5 flex items-center gap-3.5">
                        <span
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] shadow-inner transition-transform group-hover:scale-105"
                          style={{ color: meta.color }}
                        >
                          <Icon size={24} />
                        </span>
                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-emerald-300">
                            {tool.name}
                          </h3>
                          {tool.tag && (
                            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                              {tool.tag}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mt-3.5 text-xs leading-relaxed text-slate-400">
                        {tool.description}
                      </p>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4 text-xs font-semibold text-slate-400 transition-colors group-hover:text-emerald-400">
                      <span>Launch tool</span>
                      <ArrowRight
                        size={15}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= LIST VIEW ================= */}
          {viewMode === "list" && (
            <div id="tool-results" className="flex flex-col gap-2">
              {paginatedTools.map((tool) => {
                const Icon = tool.icon;
                const isFav = favoriteSet.has(String(tool.id));
                const meta = categoryMeta[tool.category] || {
                  color: "#10b981",
                  badge: tool.category,
                };

                return (
                  <div
                    key={tool.id}
                    onClick={() => openTool(tool.id)}
                    className="group flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#111622]/70 px-5 py-3.5 shadow-sm transition-all hover:border-emerald-500/40 hover:bg-[#141B2B]"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]"
                        style={{ color: meta.color }}
                      >
                        <Icon size={20} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5">
                          <h3 className="truncate text-sm font-bold text-white group-hover:text-emerald-300">
                            {tool.name}
                          </h3>
                          <span
                            className="rounded px-2 py-0.5 text-[10px] font-semibold"
                            style={{
                              backgroundColor: `${meta.color}15`,
                              color: meta.color,
                            }}
                          >
                            {tool.category}
                          </span>
                        </div>
                        <p className="truncate text-xs text-slate-400">{tool.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(tool.id, e)}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                          isFav ? "text-amber-400" : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        <Star size={16} fill={isFav ? "currentColor" : "none"} />
                      </button>
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-slate-400 group-hover:bg-emerald-500 group-hover:text-[#022c22]">
                        <ArrowRight size={15} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty search */}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-[#101522]/50 p-12 text-center">
              <Search size={32} className="mx-auto mb-3 text-slate-500" />
              <h3 className="text-base font-bold text-white">No matching tools found</h3>
              <p className="mt-1 text-sm text-slate-400">
                {favoritesOnly
                  ? "You have not starred any tools yet. Click the star icon on any card to save it."
                  : `No tools match "${search.trim()}". Try another query or category.`}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All tools");
                  setFavoritesOnly(false);
                }}
                className="mt-5 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-[#022c22] hover:bg-emerald-400"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {filtered.length > 0 && totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <span className="text-xs text-slate-500">
                Page {safePage} of {totalPages} • Showing {(safePage - 1) * TOOLS_PER_PAGE + 1}–
                {Math.min(safePage * TOOLS_PER_PAGE, filtered.length)} of {filtered.length} tools
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => goToPage(safePage - 1)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goToPage(p)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                      safePage === p
                        ? "bg-emerald-500 text-[#022c22]"
                        : "border border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => goToPage(safePage + 1)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition-colors hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= ARCHITECTURE & WHY TOOLVERSE ================= */}
      <section
        id="features"
        className="scroll-mt-20 border-t border-white/[0.08] px-4 py-16 sm:px-8 sm:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              ENGINEERED FOR PRIVACY & SPEED
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Why ToolVerse is built differently.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Unlike traditional utility sites that send your sensitive images, code, and tokens to
              remote servers, ToolVerse processes everything in local browser memory.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-2xl border border-white/[0.08] bg-[#111622]/80 p-6 shadow-lg shadow-black/20 backdrop-blur-xl transition-all hover:border-emerald-500/40 hover:bg-[#141B2B]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <ShieldCheck size={22} />
              </span>
              <h3 className="mt-5 text-base font-bold text-white">100% Client-Side Privacy</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Images, PDFs, and tokens remain strictly inside your browser sandbox. Zero files are
                ever transmitted or stored on cloud backends.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/[0.08] bg-[#111622]/80 p-6 shadow-lg shadow-black/20 backdrop-blur-xl transition-all hover:border-teal-500/40 hover:bg-[#141B2B]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/10 text-teal-300">
                <Zap size={22} />
              </span>
              <h3 className="mt-5 text-base font-bold text-white">Zero-Latency Execution</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Powered by modern Canvas, WebCrypto, and Web Workers. Calculations and asset
                compression execute at native local processor speed.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/[0.08] bg-[#111622]/80 p-6 shadow-lg shadow-black/20 backdrop-blur-xl transition-all hover:border-cyan-500/40 hover:bg-[#141B2B]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                <Command size={22} />
              </span>
              <h3 className="mt-5 text-base font-bold text-white">Command-K Launcher</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Built for keyboard power users. Hit ⌘K or Ctrl+K from any screen to navigate between
                any tool in milliseconds without touching a mouse.
              </p>
            </div>

            <div className="group rounded-2xl border border-white/[0.08] bg-[#111622]/80 p-6 shadow-lg shadow-black/20 backdrop-blur-xl transition-all hover:border-violet-500/40 hover:bg-[#141B2B]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-300">
                <LockKeyhole size={22} />
              </span>
              <h3 className="mt-5 text-base font-bold text-white">Zero Signup Walls</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                No credit cards, accounts, or rate-limit paywalls. Every utility is ready immediately
                on page load.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section
        id="how-it-works"
        className="scroll-mt-20 border-t border-white/[0.08] bg-[#0A0D15]/60 px-4 py-16 sm:px-8 sm:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                STREAMLINED WORKFLOW
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">
                Three simple steps. Zero setup.
              </h2>
            </div>
            <a
              href="#tools"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300"
            >
              Start using tools <ArrowRight size={14} />
            </a>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.08] bg-[#111622]/80 p-6 backdrop-blur-xl">
              <span className="font-mono text-3xl font-black text-emerald-400/30">01</span>
              <h3 className="mt-4 text-base font-bold text-white">Select Your Tool</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Browse our categorized directory or press ⌘K to instantly launch any of the 22
                utilities.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#111622]/80 p-6 backdrop-blur-xl">
              <span className="font-mono text-3xl font-black text-teal-400/30">02</span>
              <h3 className="mt-4 text-base font-bold text-white">Drop, Paste & Adjust</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Paste code, drag and drop images, or adjust precision sliders with instantaneous
                real-time previews.
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#111622]/80 p-6 backdrop-blur-xl">
              <span className="font-mono text-3xl font-black text-cyan-400/30">03</span>
              <h3 className="mt-4 text-base font-bold text-white">Copy or Export</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Download your compressed images, QR codes, or PDF documents, or copy clean output
                with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT / MISSION ================= */}
      <section id="about" className="scroll-mt-20 px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-[#131926] via-[#0E131E] to-[#0A0D15] p-8 sm:p-12 md:flex-row md:items-center">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Cpu size={32} />
          </div>

          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              CLIENT-FIRST PHILOSOPHY
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Crafted for utility. Respectful by design.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">
              ToolVerse was created to eliminate the friction of searching for one-off online tools
              plagued by aggressive paywalls and forced logins. By leveraging modern client-side Web
              APIs, we provide instant utility while respecting user privacy.
            </p>
          </div>

          <div className="md:ml-auto">
            <a
              href="https://github.com/Tanvir-Azad-Mahir/toolverse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-xs font-bold text-white transition hover:bg-white/[0.1]"
            >
              <GitBranch size={16} /> Open Source on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ================= FREQUENTLY ASKED QUESTIONS ================= */}
      <section className="border-t border-white/[0.08] bg-[#0A0D15]/50 px-4 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">FAQ</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Everything you need to know about ToolVerse’s architecture and usage.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            {faqs.map(({ q, a }, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={q}
                  className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111622]/80 backdrop-blur-md"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-white transition hover:text-emerald-300"
                  >
                    <span>{q}</span>
                    <ChevronDown
                      size={18}
                      className={`shrink-0 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180 text-emerald-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="border-t border-white/[0.05] px-5 pb-5 pt-3 text-xs leading-relaxed text-slate-400">
                      {a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FEEDBACK & CONTACT ================= */}
      <section id="contact" className="scroll-mt-20 px-4 pb-24 pt-10 sm:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-[#102018] via-[#0E141F] to-[#0A0D15] p-8 shadow-2xl sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[80px]"
          />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                <HeartHandshake size={14} /> Open to Feedback & Contributions
              </span>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-4xl">
                Have an idea to make ToolVerse better?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Found a bug, have a feature suggestion, or want a new tool added? Your feedback
                shapes future updates.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col">
              <a
                href="mailto:galvoid.tech@gmail.com?subject=ToolVerse%20Suggestion%20or%20Feedback"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-xs font-bold text-[#022c22] shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/35"
              >
                <Mail size={16} /> Send Direct Feedback
              </a>
              <a
                href="https://github.com/Tanvir-Azad-Mahir/toolverse"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/[0.1]"
              >
                <GitBranch size={16} /> GitHub Issues & PRs
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
