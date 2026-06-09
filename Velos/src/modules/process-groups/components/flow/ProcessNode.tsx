/**
 * Custom React Flow node for a process-group step.
 *
 * Labelled with the node's `process_key`, with `imports` (↓) and `exports` (↑)
 * surfaced as small chips so the data contract of each step is visible.
 */
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { PGNode } from '../../store/types';

export interface ProcessNodeData extends Record<string, unknown> {
  node: PGNode;
  selected: boolean;
}

export default function ProcessNode({ data }: NodeProps) {
  const { node, selected } = data as ProcessNodeData;
  const imports = node.imports ?? [];
  const exports = node.exports ?? [];

  return (
    <div className={`pg-node ${selected ? 'pg-node--selected' : ''}`}>
      <Handle type="target" position={Position.Left} className="pg-node__handle" />

      <div className="pg-node__title" title={node.process_key}>
        {node.process_key}
      </div>
      <div className="pg-node__id">{node.node_id}</div>

      {imports.length > 0 && (
        <div className="pg-node__chips">
          <span className="pg-node__chips-label">↓ in</span>
          {imports.map((imp) => (
            <span key={`in-${imp}`} className="pg-chip pg-chip--in">
              {imp}
            </span>
          ))}
        </div>
      )}

      {exports.length > 0 && (
        <div className="pg-node__chips">
          <span className="pg-node__chips-label">↑ out</span>
          {exports.map((exp) => (
            <span key={`out-${exp}`} className="pg-chip pg-chip--out">
              {exp}
            </span>
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="pg-node__handle" />
    </div>
  );
}
