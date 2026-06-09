import React, { useRef, useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { DecisionGraph, JdmConfigProvider } from "@gorules/jdm-editor";
import "@gorules/jdm-editor/dist/style.css";
import { theme as antdTheme } from "antd";
import { HiOutlineArrowsExpand, HiX } from "react-icons/hi";
import { useTheme } from "../../../../contexts/ThemeContext";
import type { RootState } from "../../../../store/store";
import { saveRuleJson, updateDraftJson } from "../../store/ruleActions";
import type { DecisionGraphRef } from "@gorules/jdm-editor";
import RunRuleModal from "../rule/RunRuleModal";

interface EditorPanelProps {
  isFullscreen?: boolean;
  onEnterFullscreen?: () => void;
  onExitFullscreen?: () => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  isFullscreen = false,
  onEnterFullscreen,
  onExitFullscreen,
}) => {
  const dispatch = useDispatch();
  const { theme: appTheme } = useTheme();
  const selectedRule = useSelector(
    (state: RootState) => state.rule.selectedRule
  );
  const draftJson = useSelector((state: RootState) => state.rule.draftJson);
  const isDirty = useSelector((state: RootState) => state.rule.isDirty);
  const graphRef = useRef<DecisionGraphRef>(null);
  const [showRunModal, setShowRunModal] = useState(false);
  const skipNextChange = useRef(false);

  const graphValue = draftJson
    ? {
        nodes: ((draftJson as any).nodes ?? []) as any,
        edges: ((draftJson as any).edges ?? []) as any,
      }
    : { nodes: [], edges: [] };

  // Skip the first onChange fired by the editor after loading a new rule
  useEffect(() => {
    skipNextChange.current = true;
  }, [selectedRule?.id]);

  // Warn on browser refresh / tab close when dirty
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleChange = useCallback(
    (val: { nodes: any[]; edges: any[] }) => {
      if (skipNextChange.current) {
        skipNextChange.current = false;
        return;
      }
      (dispatch as any)(updateDraftJson(val));
    },
    [dispatch]
  );

  const handleSave = () => {
    if (!selectedRule) return;
    (dispatch as any)(saveRuleJson());
  };

  if (!selectedRule) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 text-muted">
        <h5>Select a rule from the sidebar to open the editor</h5>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100">
      <div className="editor-topbar">
        <strong className="me-auto">
          {selectedRule.ruleName}
          {isDirty && <span className="text-warning ms-1">*</span>}
        </strong>
        <Button
          variant="success"
          size="sm"
          onClick={handleSave}
          disabled={!isDirty}
        >
          Save
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowRunModal(true)}
        >
          Run
        </Button>
        {isFullscreen ? (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onExitFullscreen}
            title="Exit full screen"
            className="gorule-icon-btn"
          >
            <HiX size={16} />
          </Button>
        ) : (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onEnterFullscreen}
            title="Open in full screen"
            className="gorule-icon-btn"
          >
            <HiOutlineArrowsExpand size={16} />
          </Button>
        )}
      </div>
      <div className="flex-grow-1" style={{ position: "relative" }}>
        <JdmConfigProvider
          theme={
            appTheme === "dark"
              ? ({ algorithm: antdTheme.darkAlgorithm } as any)
              : undefined
          }
        >
          <DecisionGraph
            ref={graphRef}
            value={graphValue as any}
            onChange={handleChange}
          />
        </JdmConfigProvider>
      </div>
      <RunRuleModal
        show={showRunModal}
        onClose={() => setShowRunModal(false)}
      />
    </div>
  );
};

export default EditorPanel;
