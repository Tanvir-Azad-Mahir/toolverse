
import { useState } from "react";
import {
  Sparkles,
  Check,
  ArrowRight,
  Layers3,
  Search,
  LockKeyhole,
  Zap,
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
    <div className="tv-galaxy relative mx-auto h-[390px] w-full max-w-[540px] select-none sm:h-[490px] lg:h-[550px]">
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
          .tv-galaxy-core {
            width: 92px;
            height: 92px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tv-orbit-one,
          .tv-orbit-two,
          .tv-orbit-three,
          .tv-floating-tool,
          .tv-galaxy-core,
          .tv-hero-reveal,
          .tv-hero-reveal-delay {
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
            className="tv-floating-tool absolute z-20"
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
    <main className="flex-1">
      {/* ================= HERO ================= */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.1fr_.9fr] lg:gap-10 lg:px-10 lg:pb-28 lg:pt-28">
        {/* Hero content */}
        <div className="tv-hero-reveal relative z-10 max-w-2xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[.07] px-4 py-2 text-xs font-medium text-cyan-200">
            <Sparkles size={14} />
            Your everyday digital toolbox
          </div>

          <h1 className="max-w-2xl text-[clamp(2.3rem,4.5vw,4.5rem)] font-extrabold leading-[1.12] tracking-[-.045em] text-white">
            Everything you need.
            <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              Nothing you don't.
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-8 text-slate-400 sm:text-lg">
            Powerful little tools for your everyday workflow.
            Edit images, transform text, format code, and get things
            done — all in one place.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
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

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-slate-400 sm:text-sm">
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
        className="scroll-mt-24 border-t border-white/[.06] bg-[#0c121e]/50 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mb-4 text-xs font-bold tracking-[.22em] text-cyan-300">
                THE TOOLKIT
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((tool) => {
              const Icon = tool.icon;

              return (
                <button
                  type="button"
                  key={tool.id}
                  onClick={() => onOpenTool(tool.id)}
                  className="group relative flex min-h-[226px] flex-col items-start overflow-hidden rounded-[22px] border border-white/[.09] bg-gradient-to-br from-[#162132] to-[#101722] p-6 text-left shadow-[0_12px_25px_rgba(0,0,0,.12)] transition duration-300 hover:-translate-y-1.5 hover:border-cyan-300/40 hover:shadow-[0_20px_45px_rgba(0,0,0,.28)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
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

                  <strong className="mb-2 text-lg font-semibold tracking-tight text-white">
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

      {/* ================= ABOUT ================= */}
      <section
        id="about"
        className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-8 rounded-[28px] border border-white/10 bg-gradient-to-br from-[#172438] via-[#111b2b] to-[#0b1422] p-8 sm:p-12 md:flex-row md:items-center">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
            <LockKeyhole size={29} />
          </div>

          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold tracking-[.2em] text-cyan-300">
              BUILT FOR EVERYDAY WORK
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
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
    </main>
  );
}
