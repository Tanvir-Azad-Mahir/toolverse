import { useEffect, useState } from "react";
import "./App.css";
import Landing from "./Landing";
import SiteLayout from "./SiteLayout";
import ToolPage from "./ToolPage";
import { descriptions } from "./toolData";

function getActiveTool() {
  const id = window.location.hash.slice(1);
  return Object.hasOwn(descriptions, id) ? id : "";
}

export default function App() {
  const [active, setActive] = useState(getActiveTool);

  useEffect(() => {
    const syncRoute = () => setActive(getActiveTool());
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    document.title = active
      ? `${descriptions[active].title} — ToolVerse`
      : "ToolVerse — Free Online Tools";
    const description = active
      ? descriptions[active].description
      : "Free image, text, developer, and everyday online tools. No sign-up required.";
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [active]);

  useEffect(() => {
    if (active) return;
    const anchor = window.location.hash.slice(1);
    if (anchor === "tools" || anchor === "about") {
      requestAnimationFrame(() => document.getElementById(anchor)?.scrollIntoView());
    }
  }, [active]);

  function navigate(hash = "") {
    window.location.hash = hash;
    setActive(getActiveTool());
    if (!hash || Object.hasOwn(descriptions, hash)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <SiteLayout>
      {active
        ? <ToolPage id={active} onBack={() => navigate("tools")} />
        : <Landing onOpenTool={navigate} />}
    </SiteLayout>
  );
}
