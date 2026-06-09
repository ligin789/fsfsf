/**
 * Editor region for the selected process:
 *   • toolbar (process name + full-screen toggle)
 *   • React Flow DAG on top (fills remaining space)
 *   • type-aware node/edge detail panel docked at the BOTTOM (resizable height)
 *
 * The process basic-information now lives in a modal (opened from the sidebar),
 * not a header bar. In full-screen mode this section becomes a fixed overlay.
 */
import { useEffect, useMemo, useState } from 'react';
import { HiOutlineArrowsExpand, HiX } from 'react-icons/hi';
import { Splitter, useDragResize } from '../../shared';
import type { ProcessDoc } from '../store/types';
import NodeInspector from './NodeInspector';
import ProcessFlow from './flow/ProcessFlow';

interface ProcessDetailProps {
  process: ProcessDoc;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
}

const parseEdgeId = (id: string): { source: string; target: string } | null => {
  const [source, target] = id.split('->');
  return source && target ? { source, target } : null;
};

export default function ProcessDetail({ process, fullscreen, onToggleFullscreen }: ProcessDetailProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Bottom detail panel height; handle sits on top of it, so dragging up grows it.
  const inspector = useDragResize({ axis: 'y', initial: 240, min: 120, max: 560, invert: true });

  // Reset selection when the active process changes.
  useEffect(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [process.process_key]);

  const selectedNode = useMemo(
    () => process.processFlow.nodes.find((n) => n.id === selectedNodeId) ?? null,
    [process.processFlow.nodes, selectedNodeId],
  );

  const selectedEdge = useMemo(() => {
    if (!selectedEdgeId) return null;
    const parsed = parseEdgeId(selectedEdgeId);
    if (!parsed) return null;
    return (
      process.processFlow.edges.find(
        (e) => e.source === parsed.source && e.target === parsed.target,
      ) ?? null
    );
  }, [process.processFlow.edges, selectedEdgeId]);

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);
  };
  const handleSelectEdge = (edgeId: string) => {
    setSelectedEdgeId(edgeId);
    setSelectedNodeId(null);
  };
  const handleClose = () => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  };

  return (
    <section className="proc-detail">
      <div className="proc-detail__toolbar">
        <div className="proc-detail__id">
          <span className="proc-detail__name">{process.name}</span>
          <code className="proc-detail__key">{process.process_key}</code>
          <span className="proc-badge proc-badge--status">{process.status}</span>
          <span className="proc-badge proc-badge--version">v{process.version}</span>
        </div>
        <div className="proc-detail__tools">
          <button
            type="button"
            className="proc-iconbtn"
            onClick={onToggleFullscreen}
            title={fullscreen ? 'Exit full screen (Esc)' : 'Full screen'}
            aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
          >
            {fullscreen ? <HiX size={16} /> : <HiOutlineArrowsExpand size={16} />}
          </button>
        </div>
      </div>

      <div className="proc-flow-wrap">
        <ProcessFlow
          process={process}
          selectedNodeId={selectedNodeId}
          selectedEdgeId={selectedEdgeId}
          onSelectNode={handleSelectNode}
          onSelectEdge={handleSelectEdge}
        />
      </div>

      <Splitter
        orientation="horizontal"
        dragging={inspector.dragging}
        onPointerDown={inspector.onPointerDown}
        variant="proc"
      />

      <NodeInspector
        process={process}
        node={selectedNode}
        edge={selectedEdge}
        height={inspector.size}
        onClose={handleClose}
      />
    </section>
  );
}
