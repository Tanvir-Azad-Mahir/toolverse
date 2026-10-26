import { useState } from "react";
import {
  Sparkles,
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
} from "lucide-react";



import { tools, categories } from "./toolData";

// Positions for the floating tools around the galaxy
const galaxyPositions = [
  {
    top: "6%",
    left: "5%",
    delay: "0s",
  },
  {
    top: "8%",
    right: "2%",
    delay: "-1s",
  },
  {
    top: "36%",
    left: "0%",
    delay: "-2s",
  },
  {
    top: "42%",
    right: "0%",
    delay: "-3s",
  },
  {
    bottom: "22%",
    left: "5%",
    delay: "-1.5s",
  },
  {
    bottom: "20%",
    right: "3%",
    delay: "-2.5s",
  },
  {
    bottom: "2%",
    left: "34%",
    delay: "-0.5s",
  },
];

// Generate a deterministic star field
const stars = Array.from({ length: 65 }, (_, index) => ({
  x: (index * 73 + 17) % 100,
  y: (index * 47 + 23) % 100,
  size: index % 6 === 0 ? 3 : 1.5,
  delay: `${-(index % 8) * 0.4}s`,
  duration: `${2 + (index % 5) * 0.65}s`,
}));

function ToolGalaxy({ onOpenTool }) {
  return (
    <div className="tv-galaxy relative mx-auto h-[585px] w-full max-w-[540px] min-w-0 select-none sm:h-[490px] lg:h-[550px]">
      {/* Animations */}
      <style>{`
        @keyframes tvOrbitOne {
          from {
            transform: translate(-50%, -50%) rotate(-25deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(335deg);
          }
        }

        @keyframes tvOrbitTwo {
          from {
            transform: translate(-50%, -50%) rotate(45deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(405deg);
          }
        }

        @keyframes tvOrbitThree {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes tvFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes tvTwinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(0.7);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        @keyframes tvCorePulse {
          0%, 100% {
            box-shadow:
              0 0 30px rgba(34, 211, 238, 0.45),
              0 0 85px rgba(14, 165, 233, 0.25);
          }
          50% {
            box-shadow:
              0 0 50px rgba(34, 211, 238, 0.7),
              0 0 115px rgba(14, 165, 233, 0.4);
          }
        }

        @keyframes tvNeonSweep {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes tvBorderGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(34,211,238,.08); }
          50% { box-shadow: 0 0 34px rgba(34,211,238,.19); }
        }
        .tv-neon-border { animation: tvBorderGlow 5s ease-in-out infinite; }
        .tv-shimmer { background-size: 200% 200%; animation: tvNeonSweep 7s ease-in-out infinite; }
        @keyframes tvHeroReveal {
          from {
            opacity: 0;
            transform: translateY(22px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tv-orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 1px solid rgba(71, 197, 255, 0.25);
          border-radius: 50%;
          pointer-events: none;
        }

        .tv-orbit-one {
          width: 72%;
          height: 39%;
          animation: tvOrbitOne 17s linear infinite;
        }

        .tv-orbit-two {
          width: 83%;
          height: 53%;
          border-color: rgba(96, 165, 250, 0.23);
          animation: tvOrbitTwo 25s linear infinite;
        }

        .tv-orbit-three {
          width: 58%;
          height: 58%;
          border-style: dashed;
          border-color: rgba(103, 232, 249, 0.18);
          animation: tvOrbitThree 34s linear infinite;
        }

        .tv-floating-tool {
          animation: tvFloat 5s ease-in-out infinite;
        }

        .tv-galaxy-core {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 118px;
          height: 118px;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: radial-gradient(
            circle at 35% 30%,
            #e1ffff 0%,
            #67e8f9 12%,
            #0891b2 35%,
            #164b84 62%,
            #06152b 85%
          );
          box-shadow:
            0 0 30px rgba(34, 211, 238, 0.45),
            0 0 85px rgba(14, 165, 233, 0.25),
            inset -12px -12px 32px rgba(0, 0, 0, 0.4);
          animation: tvCorePulse 4s ease-in-out infinite;
        }

        .tv-hero-reveal {
          animation: tvHeroReveal 0.8s ease-out both;
        }

        .tv-hero-reveal-delay {
          animation: tvHeroReveal 0.9s ease-out 0.2s both;
        }

        @media (max-width: 639px) {
          /* Reserve the top of the mobile galaxy for the orbit.
             The 7 clickable shortcuts get their own grid below it. */
          .tv-galaxy-core {
            width: 92px;
            height: 92px;
            top: 150px;
          }
          .tv-galaxy .tv-orbit {
            top: 150px;
          }
          .tv-galaxy .tv-orbit-one {
            width: min(82%, 285px);
            height: 112px;
          }
          .tv-galaxy .tv-orbit-two {
            width: min(90%, 315px);
            height: 185px;
          }
          .tv-galaxy .tv-orbit-three {
            width: 150px;
            height: 150px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tv-orbit-one,
          .tv-orbit-two,
          .tv-orbit-three,
          .tv-floating-tool,
          .tv-galaxy-core,
          .tv-hero-reveal,
          .tv-hero-reveal-delay,
          .tv-shimmer,
          .tv-neon-border {
            animation: none !important;
          }

          .tv-orbit-one {
            transform: translate(-50%, -50%) rotate(-25deg);
          }

          .tv-orbit-two {
            transform: translate(-50%, -50%) rotate(45deg);
          }

          .tv-orbit-three {
            transform: translate(-50%, -50%);
          }
        }
      `}</style>

      {/* Galaxy background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[8%] rounded-full bg-cyan-500/10 blur-[85px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[24%] rounded-full bg-blue-500/20 blur-[55px]"
      />

      {/* Stars */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {stars.map((star, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-cyan-100 shadow-[0_0_9px_rgba(125,211,252,.8)] motion-safe:animate-[tvTwinkle_3s_ease-in-out_infinite]"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
            }}
          />
        ))}
      </div>

      {/* Animated orbital rings */}
      <div
        aria-hidden="true"
        className="tv-orbit tv-orbit-one"
      />

      <div
        aria-hidden="true"
        className="tv-orbit tv-orbit-two"
      />

      <div
        aria-hidden="true"
        className="tv-orbit tv-orbit-three"
      />

      {/* Central galaxy - no logo */}
      <div
        aria-hidden="true"
        className="tv-galaxy-core"
      >
        <div className="absolute inset-4 rounded-full border border-white/20" />
        <div className="absolute inset-8 rounded-full bg-white/10 blur-lg" />
      </div>

      {/* Decorative orbital particles */}
      <div
        aria-hidden="true"
        className="tv-orbit tv-orbit-one"
        style={{
          animationDuration: "10s",
          borderColor: "transparent",
        }}
      >
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 rounded-full bg-cyan-200 shadow-[0_0_20px_rgba(34,211,238,1)]" />
        <span className="absolute bottom-[7%] right-[7%] h-1.5 w-1.5 rounded-full bg-blue-300 shadow-[0_0_15px_rgba(96,165,250,.8)]" />
      </div>

      {/* Floating clickable tool cards */}
      {tools.slice(0, 7).map((tool, index) => {
        const Icon = tool.icon;
        const position = galaxyPositions[index];

        return (
          <div
            key={tool.id}
            className="tv-floating-tool absolute z-20 hidden sm:block"
            style={{
              ...position,
              animationDelay: position.delay,
            }}
          >
            <button
              type="button"
              onClick={() => onOpenTool(tool.id)}
              aria-label={`Open ${tool.name}`}
              className="group flex max-w-[144px] items-center gap-2 rounded-xl border border-cyan-300/20 bg-[#101e31]/95 px-2.5 py-2 text-left shadow-[0_10px_30px_rgba(0,0,0,.3)] backdrop-blur-xl transition duration-300 hover:scale-105 hover:border-cyan-300/70 hover:bg-[#192d45] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 sm:max-w-[175px] sm:gap-3 sm:px-3 sm:py-2.5"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300 sm:h-9 sm:w-9">
                <Icon size={18} />
              </span>

              <span className="text-[10px] font-semibold leading-4 text-slate-200 group-hover:text-white sm:text-xs">
                {tool.name}
              </span>
            </button>
          </div>
        );
      })}

      {/* Mobile-only shortcuts: separate grid prevents orbital chips from overlapping. */}
      <div className="absolute inset-x-0 top-[305px] z-20 grid grid-cols-2 gap-2.5 px-1 sm:hidden">
        {tools.slice(0, 7).map((tool, index) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => onOpenTool(tool.id)}
              className={`flex min-h-[54px] min-w-0 items-center gap-2 rounded-xl border border-cyan-300/20 bg-[#101e31]/95 px-3 py-2 text-left text-slate-200 shadow-[0_8px_25px_rgba(0,0,0,.28)] transition active:scale-[.98] focus-visible:outline-2 focus-visible:outline-cyan-400 ${index === 6 ? "col-span-2" : ""}`}
              aria-label={`Open ${tool.name}`}
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300">
                <Icon size={17} />
              </span>
              <span className="min-w-0 text-[11px] font-semibold leading-4">{tool.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Landing({ onOpenTool }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All tools");

  const filtered = tools.filter((tool) => {
    const matchesCategory =
      category === "All tools" || tool.category === category;

    const matchesSearch =
      `${tool.name} ${tool.description} ${tool.category}`
        .toLowerCase()
        .includes(search.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="relative flex-1 overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute left-[-180px] top-10 h-[460px] w-[460px] rounded-full bg-cyan-500/[.08] blur-[125px]" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[-170px] top-[700px] h-[440px] w-[440px] rounded-full bg-indigo-500/[.09] blur-[130px]" />
      {/* ================= HERO ================= */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-4 px-5 pb-10 pt-12 sm:gap-8 sm:px-8 sm:pb-20 sm:pt-24 lg:grid-cols-[1.1fr_.9fr] lg:gap-10 lg:px-10 lg:pb-28 lg:pt-28">
        {/* Hero content */}
        <div className="tv-hero-reveal relative z-10 max-w-2xl">
          <div className="tv-neon-border mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/[.07] px-4 py-2 text-xs font-medium text-cyan-200">
            <Sparkles size={14} />
            Your everyday digital toolbox
          </div>

          <h1 className="max-w-2xl text-[clamp(2rem,4.5vw,4.5rem)] font-extrabold leading-[1.12] tracking-[-.045em] text-white">
            Everything you need.
            <span className="tv-shimmer block bg-gradient-to-r from-cyan-200 via-sky-400 to-violet-400 bg-clip-text text-transparent">
              Nothing you don't.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400 sm:mt-7 sm:text-base sm:leading-8">
            Powerful little tools for your everyday workflow.
            Edit images, transform text, format code, and get things
            done — all in one place.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
            <a
              href="#tools"
              className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-[0_10px_35px_rgba(34,211,238,.20)] transition duration-300 hover:-translate-y-1 hover:brightness-110"
            >
              Explore all tools
              <ArrowRight size={18} />
            </a>

            <span className="text-sm text-slate-500">
              {tools.length} tools. Free to use.
            </span>
          </div>

          <div className="mt-7 flex flex-wrap gap-x-4 gap-y-3 text-xs font-medium text-slate-400 sm:mt-10 sm:gap-x-6 sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <Check size={16} className="text-cyan-300" />
              No signup needed
            </span>

            <span className="inline-flex items-center gap-2">
              <Check size={16} className="text-cyan-300" />
              Browser-based
            </span>

            <span className="inline-flex items-center gap-2">
              <Check size={16} className="text-cyan-300" />
              Easy to use
            </span>
          </div>
        </div>

        {/* Animated galaxy */}
        <div className="tv-hero-reveal-delay relative min-w-0">
          <ToolGalaxy onOpenTool={onOpenTool} />
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

          {/* Search */}
          <div className="mb-5 flex w-full max-w-xl items-center gap-3 rounded-xl border border-white/10 bg-[#111a29] px-4 py-3.5 text-slate-400 transition-colors focus-within:border-cyan-400/50">
            <Search size={19} aria-hidden="true" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for a tool..."
              aria-label="Search tools"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />

            <kbd className="hidden rounded-md border border-white/10 px-2 py-1 text-[10px] text-slate-500 sm:inline">
              SEARCH
            </kbd>
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
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {filtered.map((tool) => {
              const Icon = tool.icon;

              return (
                <button
                  type="button"
                  key={tool.id}
                  onClick={() => onOpenTool(tool.id)}
                  className="group relative flex min-h-[200px] flex-col sm:min-h-[226px] items-start overflow-hidden rounded-[22px] border border-white/[.09] bg-gradient-to-br from-[#162132] to-[#101722] p-6 text-left shadow-[0_12px_25px_rgba(0,0,0,.12)] transition duration-300 hover:-translate-y-1.5 hover:border-cyan-300/60 hover:shadow-[0_0_30px_rgba(34,211,238,.13),0_20px_45px_rgba(0,0,0,.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                >
                  {/* Hover glow */}
                  <span className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-cyan-400/[.045] blur-3xl transition duration-300 group-hover:scale-150 group-hover:bg-cyan-400/[.12]" />

                  {/* Tool icon */}
                  <span className="mb-6 grid h-12 w-12 place-items-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition duration-300 group-hover:scale-110 group-hover:rotate-3">
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

                  <span className="absolute right-6 top-7 text-slate-500 transition duration-300 group-hover:translate-x-1 group-hover:text-cyan-300">
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
              <div key={title} className="group relative overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-br from-[#14263a] to-[#0b1220] p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_35px_rgba(34,211,238,.09)]">
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
              <a href="mailto:galvoid.tech@gmail.com?subject=ToolVerse%20Feedback" className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-3.5 text-sm font-bold text-slate-950 shadow-[0_0_28px_rgba(34,211,238,.2)] transition hover:-translate-y-0.5 hover:brightness-110"><Mail size={18} /> Send feedback <ArrowUpRight size={16} /></a>
              <a href="https://github.com/Tanvir-Azad-Mahir" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[.05] px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300/40 hover:bg-white/10"><GitBranch size={17} /> Developer's GitHub <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
