
import { useEffect, useState } from "react";

import Landing from "./Landing";
import SiteLayout from "./SiteLayout";
import ToolPage from "./ToolPage";
import { descriptions } from "./toolData";

function getHash() {
  return decodeURIComponent(window.location.hash.slice(1));
}

function getActiveTool() {
  const id = getHash();
  return Object.hasOwn(descriptions, id) ? id : "";
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

  // Update browser metadata for each tool.
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

  // Scroll after the correct page has rendered.
  useEffect(() => {
    if (active) {
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }

    if (hash === "tools" || hash === "about") {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [hash, active]);

  function navigate(hash = "") {
    if (getHash() === hash) {
      if (hash === "tools" || hash === "about") {
        document.getElementById(hash)?.scrollIntoView({
          behavior: "smooth",
        });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
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
        <ToolPage
          id={active}
          onBack={() => navigate("tools")}
        />
      ) : (
        <Landing onOpenTool={navigate} />
      )}
    </SiteLayout>
  );
}
