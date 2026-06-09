/**
 * Custom React Flow nodes for a Process DAG:
 *   ENTRY   (green)  → config.entry_point_key
 *   TASK    (violet) → task_key + resolved task name / type
 *   GATEWAY (amber)  → gateway_type + action (FORK/JOIN) or EXCLUSIVE, ◆ glyph
 *   EXIT    (red)    → config.exit_point_key
 *
 * Resolved task data is injected into node `data` by ProcessFlow, so nodes need
 * no store access.
 */
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface BaseData extends Record<string, unknown> {
  selected: boolean;
}
export interface EntryNodeData extends BaseData {
  name?: string;
  entryPointKey?: string;
}
export interface TaskNodeData extends BaseData {
  taskKey?: string;
  taskName?: string;
  taskType?: string;
}
export interface GatewayNodeData extends BaseData {
  name?: string;
  gatewayType?: string;
  action?: string;
  branches: string[];
}
export interface ExitNodeData extends BaseData {
  name?: string;
  exitPointKey?: string;
}

function Handles() {
  return (
    <>
      <Handle type="target" position={Position.Left} className="proc-node__handle" />
      <Handle type="source" position={Position.Right} className="proc-node__handle" />
    </>
  );
}

export function EntryNode({ data }: NodeProps) {
  const d = data as EntryNodeData;
  return (
    <div className={`proc-node proc-node--entry ${d.selected ? 'proc-node--selected' : ''}`}>
      <Handles />
      <div className="proc-node__kind">● ENTRY</div>
      <div className="proc-node__title">{d.name ?? 'Entry'}</div>
      {d.entryPointKey && <div className="proc-node__key">{d.entryPointKey}</div>}
    </div>
  );
}

export function TaskNode({ data }: NodeProps) {
  const d = data as TaskNodeData;
  return (
    <div className={`proc-node proc-node--task ${d.selected ? 'proc-node--selected' : ''}`}>
      <Handles />
      <div className="proc-node__kind">▦ TASK</div>
      <div className="proc-node__title">{d.taskName ?? d.taskKey ?? 'Task'}</div>
      {d.taskKey && <div className="proc-node__key">{d.taskKey}</div>}
      {d.taskType && <span className="proc-node__pill">{d.taskType}</span>}
    </div>
  );
}

export function GatewayNode({ data }: NodeProps) {
  const d = data as GatewayNodeData;
  const label = d.action ? `${d.gatewayType} · ${d.action}` : d.gatewayType ?? 'GATEWAY';
  return (
    <div className={`proc-node proc-node--gateway ${d.selected ? 'proc-node--selected' : ''}`}>
      <Handles />
      <div className="proc-node__kind">◆ GATEWAY</div>
      <div className="proc-node__title">{d.name ?? 'Gateway'}</div>
      <div className="proc-node__key">{label}</div>
      {d.branches.length > 0 && (
        <div className="proc-node__branches">{d.branches.length} branches</div>
      )}
    </div>
  );
}

export function ExitNode({ data }: NodeProps) {
  const d = data as ExitNodeData;
  return (
    <div className={`proc-node proc-node--exit ${d.selected ? 'proc-node--selected' : ''}`}>
      <Handles />
      <div className="proc-node__kind">■ EXIT</div>
      <div className="proc-node__title">{d.name ?? 'Exit'}</div>
      {d.exitPointKey && <div className="proc-node__key">{d.exitPointKey}</div>}
    </div>
  );
}

export const processNodeTypes = {
  ENTRY: EntryNode,
  TASK: TaskNode,
  GATEWAY: GatewayNode,
  EXIT: ExitNode,
};
