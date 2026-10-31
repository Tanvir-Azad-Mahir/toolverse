import { useEffect, useState } from "react";

import Landing from "./Landing";
import SiteLayout from "./SiteLayout";
import ToolPage from "./ToolPage";
import { descriptions } from "./toolData";

const HOME_SECTIONS = [
  "tools",
  "features",
  "how-it-works",
  "about",
  "contact",
];

const RECENTS_KEY = "toolverse:recents:v1";
const MAX_RECENTS = 6;

function getHash() {
  try {
    return decodeURIComponent(window.location.hash.slice(1));
  } catch {
    return window.location.hash.slice(1);
  }
}

function getActiveTool() {
  const id = getHash();
  return Object.hasOwn(descriptions, id) ? id : "";
}

function recordRecentTool(id) {
  if (!id) return;

  try {
    const value = window.localStorage.getItem(RECENTS_KEY);
    const parsed = value ? JSON.parse(value) : [];
    const saved = Array.isArray(parsed) ? parsed : [];

    // Keep the same schema as Landing.jsx: an ordered array of tool IDs.
    const updated = [
      id,
      ...saved.filter((savedId) => typeof savedId === "string" && savedId !== id),
    ].slice(0, MAX_RECENTS);

    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(updated));
  } catch {
    // Browsers with disabled/unavailable storage should still navigate normally.
  }
}

export default function App() {
  const [route, setRoute] = useState(() => ({
    hash: getHash(),
    active: getActiveTool(),
  }));

  useEffect(() => {
    function syncRoute() {
      setRoute({
        hash: getHash(),
        active: getActiveTool(),
      });
    }

    window.addEventListener("hashchange", syncRoute);

    return () => {
      window.removeEventListener("hashchange", syncRoute);
    };
  }, []);

  const { hash, active } = route;

  // Record visits regardless of navigation source: directory, related cards,
  // command palette, bookmarked URLs, or browser history.
  useEffect(() => {
    recordRecentTool(active);
  }, [active]);

  useEffect(() => {
    document.title = active
      ? `${descriptions[active].title} — ToolVerse`
      : "ToolVerse — Free Online Tools";

    const description = active
      ? descriptions[active].description
      : "Free image, text, developer, and everyday online tools. No sign-up required.";

    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", description);
  }, [active]);

  useEffect(() => {
    if (active) {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
      return;
    }

    if (HOME_SECTIONS.includes(hash)) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [hash, active]);

  function navigate(hash = "") {
    if (getHash() === hash) {
      if (HOME_SECTIONS.includes(hash)) {
        document.getElementById(hash)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
      return;
    }

    window.location.hash = hash;

    setRoute({
      hash,
      active: Object.hasOwn(descriptions, hash) ? hash : "",
    });
  }

  return (
    <SiteLayout>
      {active ? (
        <ToolPage id={active} onBack={() => navigate("tools")} />
      ) : (
        <Landing onOpenTool={navigate} />
      )}
    </SiteLayout>
  );
}
