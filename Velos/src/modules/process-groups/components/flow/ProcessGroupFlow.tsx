/**
 * React Flow wrapper that renders a process group's DAG.
 *
 * Builds nodes/edges from the JSON, runs a left-to-right dagre auto-layout, and
 * fills all available space (the parent chain must provide a real height — this
 * container is height:100%). Includes Background, Controls and fitView.
 */
import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  type Edge,
  type Node,
  type NodeMouseHandler,
  type EdgeMouseHandler,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { ProcessGroup } from '../../store/types';
import ProcessNode from './ProcessNode';
import { layoutDagre } from '../../../shared/flow/layout';

const nodeTypes = { processNode: ProcessNode };

interface ProcessGroupFlowProps {
  group: ProcessGroup;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onSelectEdge: (edgeId: string) => void;
}

const edgeId = (from: string, to: string) => `${from}->${to}`;

export default function ProcessGroupFlow({
  group,
  selectedNodeId,
  selectedEdgeId,
  onSelectNode,
  onSelectEdge,
}: ProcessGroupFlowProps) {
  const { nodes, edges } = useMemo(() => {
    const rawNodes: Node[] = group.nodes.map((n) => ({
      id: n.node_id,
      type: 'processNode',
      position: { x: 0, y: 0 }, // replaced by dagre layout below
      data: { node: n, selected: n.node_id === selectedNodeId },
    }));

    const rawEdges: Edge[] = group.edges.map((e) => {
      const id = edgeId(e.from, e.to);
      return {
        id,
        source: e.from,
        target: e.to,
        label: e.condition,
        animated: true,
        selected: id === selectedEdgeId,
        markerEnd: { type: MarkerType.ArrowClosed },
        labelBgPadding: [6, 3] as [number, number],
        labelBgBorderRadius: 4,
        style: { stroke: id === selectedEdgeId ? '#2563eb' : '#94a3b8', strokeWidth: 2 },
      };
    });

    return layoutDagre(rawNodes, rawEdges);
    // Re-layout only when the group changes; selection is folded in cheaply.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group, selectedNodeId, selectedEdgeId]);

  const handleNodeClick: NodeMouseHandler = (_event, node) => {
    onSelectNode(node.id);
  };

  const handleEdgeClick: EdgeMouseHandler = (_event, edge) => {
    onSelectEdge(edge.id);
  };

  return (
    <div className="pg-flow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
      >
        <Background gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
