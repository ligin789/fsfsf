/**
 * Shared left-to-right DAG auto-layout, used by both the process-groups and
 * processes modules. The source documents carry no x/y, so we run dagre and
 * hand React Flow tidy positions.
 *
 * Per-node sizes can be supplied via `node.width` / `node.height` (e.g. a small
 * gateway diamond vs. a wide task card); otherwise the defaults are used.
 */
import dagre from '@dagrejs/dagre';
import type { Edge, Node } from '@xyflow/react';
import { Position } from '@xyflow/react';

export interface LayoutOptions {
  defaultWidth?: number;
  defaultHeight?: number;
  rankdir?: 'LR' | 'TB' | 'RL' | 'BT';
  nodesep?: number;
  ranksep?: number;
  /**
   * Per-node size for layout, when nodes shouldn't carry width/height
   * themselves (setting those on React Flow nodes suppresses its own
   * measurement, which edges depend on).
   */
  getNodeSize?: (node: Node) => { width: number; height: number };
}

export function layoutDagre(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {},
): { nodes: Node[]; edges: Edge[] } {
  const {
    defaultWidth = 240,
    defaultHeight = 96,
    rankdir = 'LR',
    nodesep = 48,
    ranksep = 96,
  } = options;

  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir, nodesep, ranksep, marginx: 24, marginy: 24 });

  const sizeOf = (node: Node) =>
    options.getNodeSize
      ? options.getNodeSize(node)
      : { width: node.width ?? defaultWidth, height: node.height ?? defaultHeight };

  nodes.forEach((node) => {
    graph.setNode(node.id, sizeOf(node));
  });
  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  const positioned = nodes.map((node) => {
    const { x, y } = graph.node(node.id);
    const { width, height } = sizeOf(node);
    return {
      ...node,
      // dagre returns the node centre; React Flow expects the top-left corner.
      position: { x: x - width / 2, y: y - height / 2 },
      sourcePosition: rankdir === 'LR' ? Position.Right : Position.Bottom,
      targetPosition: rankdir === 'LR' ? Position.Left : Position.Top,
    };
  });

  return { nodes: positioned, edges };
}
