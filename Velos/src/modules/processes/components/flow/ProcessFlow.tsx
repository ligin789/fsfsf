/**
 * React Flow wrapper for a Process DAG. Builds typed nodes/edges from
 * processFlow, resolves each TASK node's name/type from tasks[], runs the
 * shared LR dagre layout, and fills all available space. Includes Background,
 * Controls and fitView; edge `condition` renders as a label.
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
import { layoutDagre } from '../../../shared/flow/layout';
import type { ProcessDoc } from '../../store/types';
import { processNodeTypes } from './nodes';

interface ProcessFlowProps {
  process: ProcessDoc;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onSelectEdge: (edgeId: string) => void;
}

export const edgeKey = (source: string, target: string) => `${source}->${target}`;

const SIZE: Record<string, { width: number; height: number }> = {
  ENTRY: { width: 210, height: 78 },
  TASK: { width: 240, height: 96 },
  GATEWAY: { width: 210, height: 90 },
  EXIT: { width: 210, height: 78 },
};

export default function ProcessFlow({
  process,
  selectedNodeId,
  selectedEdgeId,
  onSelectNode,
  onSelectEdge,
}: ProcessFlowProps) {
  const { nodes, edges } = useMemo(() => {
    const taskByKey = new Map(process.tasks.map((t) => [t.task_key, t]));

    const rawNodes: Node[] = process.processFlow.nodes.map((n) => {
      const selected = n.id === selectedNodeId;
      let data: Record<string, unknown> = { selected };

      if (n.type === 'ENTRY') {
        data = { selected, name: n.name, entryPointKey: n.config?.entry_point_key };
      } else if (n.type === 'EXIT') {
        data = { selected, name: n.name, exitPointKey: n.config?.exit_point_key };
      } else if (n.type === 'GATEWAY') {
        data = {
          selected,
          name: n.name,
          gatewayType: n.config?.gateway_type,
          action: n.config?.action,
          branches: (n.config?.tasks as string[] | undefined) ?? [],
        };
      } else {
        const task = n.task_key ? taskByKey.get(n.task_key) : undefined;
        data = { selected, taskKey: n.task_key, taskName: task?.name, taskType: task?.type };
      }

      // No width/height here — React Flow measures nodes itself (edges need
      // measured endpoints). Layout sizes are provided via getNodeSize below.
      return { id: n.id, type: n.type, position: { x: 0, y: 0 }, data };
    });

    const rawEdges: Edge[] = process.processFlow.edges.map((e) => {
      const id = edgeKey(e.source, e.target);
      const isSelected = id === selectedEdgeId;
      return {
        id,
        source: e.source,
        target: e.target,
        label: e.condition,
        animated: true,
        selected: isSelected,
        markerEnd: { type: MarkerType.ArrowClosed },
        labelBgPadding: [6, 3] as [number, number],
        labelBgBorderRadius: 4,
        style: { stroke: isSelected ? '#2563eb' : '#94a3b8', strokeWidth: 2 },
      };
    });

    return layoutDagre(rawNodes, rawEdges, {
      getNodeSize: (node) => SIZE[node.type as string] ?? SIZE.TASK,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [process, selectedNodeId, selectedEdgeId]);

  const handleNodeClick: NodeMouseHandler = (_e, node) => onSelectNode(node.id);
  const handleEdgeClick: EdgeMouseHandler = (_e, edge) => onSelectEdge(edge.id);

  return (
    <div className="proc-flow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={processNodeTypes}
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
