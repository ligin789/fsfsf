import React, { useEffect, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import EditorPanel from "../components/layout/EditorPanel";
import "../styles/goRule.css";

/**
 * Rule Library page — embeds the goRule editor.
 *
 * Two render modes:
 *   • Normal — wrapped in `.gorule-root` inside the dashboard outlet
 *     (header + dashboard sidebar visible, rule list visible).
 *   • Full screen — fixed overlay above the dashboard header / sidebar,
 *     rule list hidden, only the editor canvas + a close icon visible.
 */
const RuleLibraryPage: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Lock background scroll while fullscreen is active
  useEffect(() => {
    if (!isFullscreen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isFullscreen]);

  // Allow ESC to exit fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen]);

  if (isFullscreen) {
    return (
      <div className="gorule-root gorule-fullscreen">
        <EditorPanel
          isFullscreen
          onExitFullscreen={() => setIsFullscreen(false)}
        />
      </div>
    );
  }

  return (
    <div
      className="gorule-root"
      style={{ height: "calc(100vh - 60px)", minHeight: 600 }}
    >
      <MainLayout onEnterFullscreen={() => setIsFullscreen(true)} />
    </div>
  );
};

export default RuleLibraryPage;
