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
  Star,
  Clock3,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import { tools, categories } from "./toolData";
import { triggerAdWithFrequency } from "./utils/monetag";

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

const FAVORITES_KEY = "toolverse:favorites:v1";
const RECENTS_KEY = "toolverse:recents:v1";
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
    // Browsers with restricted storage can still use this feature until refresh.
  }
}

export default function Landing({ onOpenTool = navigateToTool }) {
  const [favorites, setFavorites] = useState(() => readStoredIds(FAVORITES_KEY));
  const [recents, setRecents] = useState(() => readStoredIds(RECENTS_KEY).slice(0, MAX_RECENTS));
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All tools");
  const [currentPage, setCurrentPage] = useState(1);
  const searchRef = useRef(null);
  const paletteRef = useRef(null);
  const paletteDialogRef = useRef(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [paletteIndex, setPaletteIndex] = useState(0);
  const query = search.trim().toLocaleLowerCase();
  const favoriteSet = useMemo(() => new Set(favorites), [favorites]);
  const recentTools = useMemo(() => recents.map((id) => toolById.get(id)).filter(Boolean), [recents]);

  useEffect(() => storeIds(FAVORITES_KEY, favorites), [favorites]);
  useEffect(() => storeIds(RECENTS_KEY, recents), [recents]);

  function toggleFavorite(id) {
    const key = String(id);
    setFavorites((previous) => previous.includes(key)
      ? previous.filter((item) => item !== key)
      : [...previous, key]);
  }

  function openTool(id) {
    const key = String(id);
    
    // Rate-limited ad trigger before opening any tool
    triggerAdWithFrequency(() => {
      setRecents((previous) => [key, ...previous.filter((item) => item !== key)].slice(0, MAX_RECENTS));
      onOpenTool(id);
    }, { actionsPerAd: 3, cooldownSeconds: 30 });
  }

  // Keep the existing "/" shortcut for the inline search.
  // Ctrl/Cmd+K now opens the command palette, even while typing.
  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target;
      const typing = target instanceof HTMLElement &&
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
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paletteOpen]);

  const paletteResults = useMemo(() => {
    const q = paletteQuery.trim().toLocaleLowerCase();
    if (q) return searchableTools.filter(({ keywords }) => keywords.includes(q)).map(({ tool }) => tool);
    const priority = [...favorites, ...recents];
    const seen = new Set();
    return [...priority.map((id) => toolById.get(id)), ...tools].filter((tool) => {
      if (!tool || seen.has(String(tool.id))) return false;
      seen.add(String(tool.id));
      return true;
    });
  }, [paletteQuery, favorites, recents]);

  useEffect(() => { setPaletteIndex(0); }, [paletteQuery, paletteOpen]);

  useEffect(() => {
    if (!paletteOpen) return;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    paletteRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [paletteOpen]);

  function openFromPalette(id) {
    setPaletteOpen(false);
    openTool(id);
  }

  function handlePaletteKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setPaletteIndex((index) => paletteResults.length ? Math.min(index + 1, paletteResults.length - 1) : 0);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setPaletteIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && paletteResults[paletteIndex]) {
      event.preventDefault();
      openFromPalette(paletteResults[paletteIndex].id);
    } else if (event.key === "Tab") {
      // Keep keyboard focus within the modal while it is open.
      const tabbable = paletteDialogRef.current?.querySelectorAll('input,button:not([disabled])');
      if (!tabbable?.length) return;
      const first = tabbable[0];
      const last = tabbable[tabbable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }

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
        (!query || keywords.includes(query)) &&
        (!favoritesOnly || favoriteSet.has(String(tool.id)))
      )
      .map(({ tool }) => tool),
    [category, query, favoritesOnly, favoriteSet]
  );

  // Pagination uses the already filtered list, so all directory filters work.
  const totalPages = Math.max(1, Math.ceil(filtered.length / TOOLS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTools = useMemo(
    () => filtered.slice((safePage - 1) * TOOLS_PER_PAGE, safePage * TOOLS_PER_PAGE),
    [filtered, safePage]
  );

  // New searches and filter choices always begin on page one.
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, favoritesOnly]);

  function goToPage(page) {
    const nextPage = Math.max(1, Math.min(totalPages, page));
    setCurrentPage(nextPage);
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("tool-results")?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    });
  }

  return (
    <main className="relative flex-1 overflow-hidden">
      {/* Fast tool navigation: Ctrl/Cmd+K. */}
      {paletteOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-[max(12px,env(safe-area-inset-top))] sm:px-4 sm:pt-[min(15vh,130px)]" onKeyDown={handlePaletteKeyDown}>
          <div className="absolute inset-0 bg-[#101210]/80 backdrop-blur-sm" onClick={() => setPaletteOpen(false)} aria-hidden="true" />
          <div ref={paletteDialogRef} role="dialog" aria-modal="true" aria-label="Search and open tools" className="relative flex max-h-[calc(100dvh-32px)] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#1B2420] shadow-2xl shadow-black/60 sm:max-h-[min(75dvh,640px)]">
            <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-3 py-3 focus-within:border-emerald-300/50 sm:gap-3 sm:px-4">
              <Search size={19} className="shrink-0 text-[#86EFAC]" aria-hidden="true" />
              <input
                ref={paletteRef}
                type="text"
                value={paletteQuery}
                onChange={(event) => setPaletteQuery(event.target.value)}
                placeholder="Search tools or categories..."
                aria-label="Search tools in command palette"
                aria-controls="palette-results"
                aria-activedescendant={paletteResults[paletteIndex] ? `palette-tool-${paletteResults[paletteIndex].id}` : undefined}
                role="combobox"
                aria-expanded="true"
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-white outline-none ring-0 shadow-none placeholder:text-slate-500 focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none"
                style={{ outline: "none", boxShadow: "none" }}
              />
              <button type="button" onClick={() => setPaletteOpen(false)} aria-label="Close command palette" className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"><X size={17}/></button>
            </div>
            <div id="palette-results" role="listbox" aria-label="Matching tools" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
              {!paletteQuery.trim() && <p className="px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-widest text-slate-500">Favorites, recent & all tools</p>}
              {paletteResults.length ? paletteResults.map((tool, index) => {
                const Icon = tool.icon;
                const selected = index === paletteIndex;
                return (
                  <button
                    key={tool.id}
                    type="button"
                    id={`palette-tool-${tool.id}`}
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setPaletteIndex(index)}
                    onClick={() => openFromPalette(tool.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${selected ? "bg-emerald-400/10 text-white" : "text-slate-300 hover:bg-white/5"}`}
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[.04] text-[#86EFAC]"><Icon size={18}/></span>
                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{tool.name}</span><span className="block truncate text-xs text-slate-500">{tool.category}</span></span>
                    {favoriteSet.has(String(tool.id)) && <Star size={15} className="shrink-0 text-[#86EFAC]" fill="currentColor" aria-label="Favorite" />}
                    {selected && <CornerDownLeft size={16} className="shrink-0 text-slate-500" aria-hidden="true" />}
                  </button>
                );
              }) : <p className="px-4 py-10 text-center text-sm text-slate-400">No matching tools. Try another keyword.</p>}
            </div>
            <div className="hidden shrink-0 flex-wrap items-center gap-4 border-t border-white/10 px-4 py-3 text-[11px] text-slate-500 sm:flex">
              <span className="inline-flex items-center gap-1"><ArrowUp size={13}/><ArrowDown size={13}/> Navigate</span>
              <span className="inline-flex items-center gap-1"><CornerDownLeft size={13}/> Open</span>
              <span>Esc close</span>
              <span className="ml-auto">{paletteResults.length} tools</span>
            </div>
          </div>
        </div>
      )}
      <div aria-hidden="true" className="pointer-events-none absolute left-[-180px] top-10 h-[460px] w-[460px] rounded-full bg-emerald-500/[.035] blur-[125px]" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[-170px] top-[700px] h-[440px] w-[440px] rounded-full bg-green-500/[.035] blur-[130px]" />
      {/* ================= SIMPLE CENTERED HERO ================= */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pb-20 pt-24 text-center sm:px-8 sm:pb-28 sm:pt-32 lg:px-10 lg:pt-36">
        <div className="max-w-3xl">
          <p className="mb-6 inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[.04] px-4 py-2 text-xs font-medium tracking-wide text-[#B4F5CA]">
            Your everyday digital toolbox
          </p>

          <h1 className="text-[clamp(2.5rem,6vw,5.25rem)] font-extrabold leading-[1.1] tracking-[-.055em] text-white">
            Everything you need.
            <span className="block text-[#86EFAC]">Nothing you don't.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
            Powerful little tools for your everyday workflow. Edit images,
            transform text, format code, and get things done — all in one place.
          </p>

          {/* Prominent search: shares state with the category filters below. */}
          <div role="search" className="mx-auto mt-9 w-full max-w-2xl">
            <div className="flex min-w-0 items-center gap-2 rounded-2xl border border-white/15 bg-[#1B2420] px-2.5 py-2 transition-colors duration-150 focus-within:border-[#86EFAC]/60 sm:gap-3 sm:px-5 sm:py-2.5">
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
                placeholder="Search tools..."
                aria-label="Search all ToolVerse tools"
                aria-controls="tool-results"
                className="block min-w-0 w-0 flex-1 appearance-none rounded-none border-0 bg-transparent p-0 py-2 text-sm text-white shadow-none ring-0 outline-none placeholder:text-slate-500 focus:border-0 focus:shadow-none focus:ring-0 focus:outline-none focus-visible:outline-none focus-visible:ring-0 sm:text-base"
                style={{ outline: "none", boxShadow: "none", WebkitAppearance: "none" }}
              />
              {search ? (
                <button type="button" onClick={() => {setSearch(""); searchRef.current?.focus();}} aria-label="Clear search" className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-slate-400 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-200"><X size={18} /></button>
              ) : (
                <button type="button" onClick={() => setPaletteOpen(true)} title="Open command palette" aria-label="Open command palette" className="hidden items-center gap-1 rounded-md border border-white/10 px-2 py-1 text-xs text-slate-500 hover:border-emerald-300/40 hover:text-[#B4F5CA] sm:inline-flex"><Command size={12} /> K</button>
              )}
              <button type="button" onClick={showResults} className="shrink-0 rounded-xl bg-[#86EFAC] px-3 py-3 text-xs font-semibold text-[#101210] transition-colors hover:bg-[#A7F3C2] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200 sm:px-4 sm:text-sm">Search</button>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="mr-1">Popular:</span>
              {popularTools.map((tool) => (
                <button key={tool.id} type="button" onClick={() => openTool(tool.id)} className="rounded-full border border-white/10 bg-white/[.04] px-3 py-1.5 text-slate-300 hover:border-emerald-300/40 hover:text-[#B4F5CA]">
                  {tool.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#tools"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#86EFAC] px-6 py-3.5 text-sm font-semibold text-[#101210] hover:bg-[#A7F3C2]"
            >
              Explore all tools
              <ArrowRight size={18} />
            </a>
            <span className="text-sm text-slate-500">{tools.length} tools. Free to use.</span>
          </div>

          <div className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-3 text-xs text-slate-400 sm:text-sm">
            <span className="inline-flex items-center gap-2"><Check size={16} className="text-[#86EFAC]" /> No signup needed</span>
            <span className="inline-flex items-center gap-2"><Check size={16} className="text-[#86EFAC]" /> Browser-based</span>
            <span className="inline-flex items-center gap-2"><Check size={16} className="text-[#86EFAC]" /> Easy to use</span>
          </div>
        </div>
      </section>

      {/* ================= TOOL DIRECTORY ================= */}
      <section
        id="tools"
        className="scroll-mt-24 border-t border-white/[.06] bg-[#101711]/50 py-14 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-xs font-bold tracking-[.22em] text-[#86EFAC]">
                THE TOOLKIT
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                Tools for every{" "}
                <span className="text-[#86EFAC]">
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

          {/* Saved tools: personal preferences stay in this browser. */}
          {recentTools.length > 0 && (
            <div className="mb-8 rounded-2xl border border-white/10 bg-white/[.025] p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-white"><Clock3 size={16} className="text-[#86EFAC]" /> Recently used</h3>
                <button type="button" onClick={() => setRecents([])} className="min-h-11 px-2 text-xs text-slate-400 hover:text-white">Clear history</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentTools.map((tool) => (
                  <button key={tool.id} type="button" onClick={() => openTool(tool.id)} className="min-h-11 rounded-lg border border-white/10 bg-[#1B2420] px-3 py-2.5 text-xs text-slate-200 transition-colors hover:border-emerald-300/40 hover:text-[#B4F5CA]">
                    {tool.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 flex flex-wrap items-center gap-2">
            <button type="button" aria-pressed={!favoritesOnly} onClick={() => setFavoritesOnly(false)} className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${!favoritesOnly ? "border-emerald-300/50 bg-emerald-400/10 text-[#B4F5CA]" : "border-white/10 text-slate-400 hover:text-white"}`}>All tools</button>
            <button type="button" aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly(true)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${favoritesOnly ? "border-emerald-300/50 bg-emerald-400/10 text-[#B4F5CA]" : "border-white/10 text-slate-400 hover:text-white"}`}><Star size={14} fill={favoritesOnly ? "currentColor" : "none"} /> Favorites <span className="text-xs opacity-60">{favorites.length}</span></button>
          </div>

          {/* Active search summary */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-white">{filtered.length}</span> of {tools.length} tools
              {query && <> matching <span className="font-medium text-[#B4F5CA]">“{search.trim()}”</span></>}
            </p>
            {(search || category !== "All tools" || favoritesOnly) && (
              <button type="button" onClick={() => { setSearch(""); setCategory("All tools"); setFavoritesOnly(false); }} className="inline-flex items-center gap-1.5 text-xs text-[#86EFAC] hover:text-[#B4F5CA]">
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
                    ? "border-emerald-300/50 bg-emerald-400/10 text-[#B4F5CA]"
                    : "border-white/10 bg-white/[.03] text-slate-400 hover:border-white/25 hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Tool cards */}
          <div id="tool-results" className="scroll-mt-24 grid gap-3 sm:scroll-mt-28 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {paginatedTools.map((tool) => {
              const Icon = tool.icon;

              return (
                <div key={tool.id} className="group relative min-h-[175px] overflow-hidden rounded-[22px] border border-white/[.09] bg-gradient-to-br from-[#1D2721] to-[#151D18] transition-colors duration-150 hover:border-emerald-300/45 sm:min-h-[226px]">
                  <button
                    type="button"
                    onClick={() => openTool(tool.id)}
                    className="flex h-full min-h-[175px] w-full flex-col items-start p-5 pr-16 text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-emerald-400 sm:min-h-[226px] sm:p-6"
                  >
                  {/* Tool icon */}
                  <span className="mb-6 grid h-12 w-12 place-items-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-[#86EFAC] ">
                    <Icon size={23} />
                  </span>

                  <span className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#86EFAC]/85">
                    {tool.category}
                  </span>

                  <strong className="mb-2 text-base font-semibold tracking-tight text-white">
                    {tool.name}
                  </strong>

                  <span className="max-w-[90%] text-sm leading-6 text-slate-400">
                    {tool.description}
                  </span>

                  <span className="absolute right-6 bottom-6 text-slate-500 transition-colors group-hover:text-[#86EFAC]" aria-hidden="true">
                    <ArrowRight size={18} />
                  </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`${favoriteSet.has(String(tool.id)) ? "Remove" : "Add"} ${tool.name} ${favoriteSet.has(String(tool.id)) ? "from" : "to"} favorites`}
                    aria-pressed={favoriteSet.has(String(tool.id))}
                    onClick={() => toggleFavorite(tool.id)}
                    className={`absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-emerald-300 ${favoriteSet.has(String(tool.id)) ? "border-emerald-300/40 bg-emerald-400/10 text-[#86EFAC]" : "border-white/10 bg-[#223027] text-slate-400 hover:text-[#86EFAC]"}`}
                  >
                    <Star size={17} fill={favoriteSet.has(String(tool.id)) ? "currentColor" : "none"} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Compact, accessible pagination for the main tool directory. */}
          {filtered.length > 0 && totalPages > 1 && (
            <nav aria-label="Tool directory pages" className="mt-9 flex flex-col items-center gap-3">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={safePage === 1}
                  onClick={() => goToPage(safePage - 1)}
                  className="min-h-11 rounded-lg border border-white/10 px-3 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:text-sm"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => goToPage(page)}
                    aria-label={`Go to tool page ${page}`}
                    aria-current={safePage === page ? "page" : undefined}
                    className={`grid h-11 w-11 place-items-center rounded-lg border text-sm font-semibold transition-colors ${
                      safePage === page
                        ? "border-emerald-300/50 bg-emerald-400/10 text-[#B4F5CA]"
                        : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={safePage === totalPages}
                  onClick={() => goToPage(safePage + 1)}
                  className="min-h-11 rounded-lg border border-white/10 px-3 py-2.5 text-xs font-medium text-slate-300 transition-colors hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 sm:text-sm"
                >
                  Next
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Showing {(safePage - 1) * TOOLS_PER_PAGE + 1}–{Math.min(safePage * TOOLS_PER_PAGE, filtered.length)} of {filtered.length} matching tools
              </p>
            </nav>
          )}

          {/* Empty search result */}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-white/10 p-8 text-center">
              <Search
                size={25}
                className="mx-auto mb-3 text-slate-500"
              />

              <p className="text-sm text-slate-400">
                {favoritesOnly && favorites.length === 0
                  ? "No favorites yet. Star a tool to save it here."
                  : "No tools match these filters. Try another keyword or category."}
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All tools");
                  setFavoritesOnly(false);
                }}
                className="mt-4 text-sm font-semibold text-[#86EFAC] hover:text-[#B4F5CA]"
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
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[.22em] text-[#86EFAC]">BUILT TO MAKE THINGS EASIER</p>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">Less switching tabs. <span className="text-[#86EFAC]">More getting done.</span></h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">A growing collection of everyday tools, together in one lightweight workspace.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              { icon: Zap, title: "Fast by design", text: "Open a tool and get started without an account or an elaborate setup." },
              { icon: ShieldCheck, title: "Privacy-conscious", text: "Tools are designed to process data in your browser wherever possible." },
              { icon: Globe2, title: "One place for more", text: "Images, writing, calculations, developer helpers and utilities together." },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="relative overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-br from-[#1E2922] to-[#111B15] p-6 transition-colors hover:border-emerald-400/40">
                <span className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-400/[.07] blur-3xl" />
                <span className="mb-6 grid h-11 w-11 place-items-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-[#86EFAC]"><Icon size={21} /></span>
                <h3 className="text-base font-semibold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="scroll-mt-24 border-y border-white/[.06] bg-[#162019]/75 px-5 py-14 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-[11px] font-bold tracking-[.22em] text-[#86EFAC]">THREE SIMPLE STEPS</p>
              <h2 className="text-2xl font-bold text-white sm:text-4xl">Your next task, <span className="text-[#86EFAC]">simplified.</span></h2>
            </div>
            <a href="#tools" className="inline-flex items-center gap-2 text-sm font-semibold text-[#86EFAC] transition hover:text-white">Start exploring <ArrowRight size={16} /></a>
          </div>
          <div className="relative mt-10 grid gap-4 md:grid-cols-3">
            {[
              { number: "01", icon: Search, title: "Find a tool", text: "Search by keyword or browse a category to find what you need." },
              { number: "02", icon: MousePointerClick, title: "Make it yours", text: "Add your text, numbers or files and adjust the settings." },
              { number: "03", icon: Download, title: "Get your result", text: "Copy, use or download the output and get on with your day." },
            ].map(({ number, icon: Icon, title, text }) => (
              <div key={number} className="rounded-[22px] border border-white/10 bg-[#1B2520] p-6">
                <div className="mb-8 flex items-start justify-between"><span className="text-3xl font-black tracking-tight text-emerald-400/25">{number}</span><Icon size={22} className="text-[#86EFAC]" /></div>
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
        <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[28px] border border-white/10 bg-gradient-to-br from-[#24352A] via-[#1C2820] to-[#17211A] p-8 sm:p-12 md:flex-row md:items-center">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-emerald-300/20 bg-emerald-300/10 text-[#86EFAC]">
            <LockKeyhole size={29} />
          </div>

          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold tracking-[.2em] text-[#86EFAC]">
              BUILT FOR EVERYDAY WORK
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Simple by design.{" "}
              <span className="text-[#86EFAC]">
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
              className="hidden text-[#86EFAC]/30 md:block"
              size={70}
              strokeWidth={1}
            />
          </div>
        </div>
      </section>

      {/* ================= CONTACT & FEEDBACK ================= */}
      <section id="contact" className="scroll-mt-24 px-5 pb-24 pt-4 sm:px-8 sm:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-emerald-300/20 bg-gradient-to-br from-[#264633] via-[#18291F] to-[#171F1B] p-7 shadow-[0_0_65px_rgba(134,239,172,.045)] sm:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-[80px]" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-1/4 h-60 w-60 rounded-full bg-violet-400/10 blur-[80px]" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-[#B4F5CA]"><HeartHandshake size={15} /> OPEN TO FEEDBACK</span>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">Have an idea to make <span className="text-[#86EFAC]">ToolVerse better?</span></h2>
              <p className="mt-4 text-sm leading-7 text-slate-300">Feel free to contact me for improvement advice, bug reports, feature suggestions or general feedback. Your ideas can help shape what comes next.</p>
            </div>
            <div className="flex shrink-0 flex-col gap-3">
              <a href="mailto:galvoid.tech@gmail.com?subject=ToolVerse%20Feedback" className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 px-5 py-3.5 text-sm font-bold text-[#101210] shadow-[0_0_28px_rgba(134,239,172,.12)] transition-colors hover:brightness-110"><Mail size={18} /> Send feedback <ArrowUpRight size={16} /></a>
              <a href="https://github.com/Tanvir-Azad-Mahir" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[.05] px-5 py-3 text-sm font-semibold text-white transition hover:border-emerald-300/40 hover:bg-white/10"><GitBranch size={17} /> Developer's GitHub <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}