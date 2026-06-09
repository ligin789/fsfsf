import React from "react";
import RuleSidebar from "./RuleSidebar";
import EditorPanel from "./EditorPanel";

interface MainLayoutProps {
  onEnterFullscreen?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onEnterFullscreen }) => {
  return (
    <div className="gorule-main d-flex">
      <div className="gorule-sidebar-col">
        <RuleSidebar />
      </div>
      <div className="gorule-editor-col">
        <EditorPanel onEnterFullscreen={onEnterFullscreen} />
      </div>
    </div>
  );
};

export default MainLayout;
