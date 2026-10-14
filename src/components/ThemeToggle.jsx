import { useEffect, useState } from "react";

const MODES = ["system", "light", "dark"];
const ICON = { system: "◐", light: "☀", dark: "☾" };

export default function ThemeToggle() {
  const [mode, setMode] = useState(() => localStorage.getItem("fsd-theme") || "system");

  useEffect(() => {
    // "system" means stamp nothing and let prefers-color-scheme decide.
    if (mode === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("fsd-theme", mode);
  }, [mode]);

  const next = () => setMode(MODES[(MODES.indexOf(mode) + 1) % MODES.length]);

  return (
    <button className="theme-btn" onClick={next}>
      {ICON[mode]}&nbsp;&nbsp;Theme: {mode}
    </button>
  );
}
