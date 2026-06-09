/**
 * Right region — renders the selected group: header bar, the React Flow DAG
 * (filling all remaining space) and a node/edge inspector drawer.
 */
import { useEffect, useMemo, useState } from 'react';
import type { ProcessGroup } from '../store/types';
import GroupHeaderBar from './GroupHeaderBar';
import NodeInspector from './NodeInspector';
import ProcessGroupFlow from './flow/ProcessGroupFlow';
import { Splitter, useDragResize } from '../../shared';

interface ProcessGroupDetailProps {
  group: ProcessGroup;
}

const parseEdgeId = (id: string): { from: string; to: string } | null => {
  const [from, to] = id.split('->');
  return from && to ? { from, to } : null;
};

export default function ProcessGroupDetail({ group }: ProcessGroupDetailProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  // Drag-resizable header height and inspector width (px). The inspector handle
  // sits on its left edge, so dragging left grows it (invert).
  const header = useDragResize({ axis: 'y', initial: 240, min: 120, max: 560 });
  const inspector = useDragResize({ axis: 'x', initial: 300, min: 220, max: 600, invert: true });

  // Reset selection whenever the active group changes.
  useEffect(() => {
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
  }, [group.process_group_id]);

  const selectedNode = useMemo(
    () => group.nodes.find((n) => n.node_id === selectedNodeId) ?? null,
    [group.nodes, selectedNodeId],
  );

  const selectedEdge = useMemo(() => {
    if (!selectedEdgeId) return null;
    const parsed = parseEdgeId(selectedEdgeId);
    if (!parsed) return null;
    return (
      group.edges.find((e) => e.from === parsed.from && e.to === parsed.to) ?? null
    );
  }, [group.edges, selectedEdgeId]);

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
    <section className="pg-detail">
      <GroupHeaderBar group={group} height={header.size} />
      <Splitter
        orientation="horizontal"
        dragging={header.dragging}
        onPointerDown={header.onPointerDown}
      />
      <div className="pg-detail__body">
        <ProcessGroupFlow
          group={group}
          selectedNodeId={selectedNodeId}
          selectedEdgeId={selectedEdgeId}
          onSelectNode={handleSelectNode}
          onSelectEdge={handleSelectEdge}
        />
        <Splitter
          orientation="vertical"
          dragging={inspector.dragging}
          onPointerDown={inspector.onPointerDown}
        />
        <NodeInspector
          node={selectedNode}
          edge={selectedEdge}
          onClose={handleClose}
          width={inspector.size}
        />
      </div>
    </section>
  );
}
