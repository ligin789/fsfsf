/**
 * Editable, type-aware detail panel for the selected flow node or edge.
 * Docked at the BOTTOM of the editor (full width, drag-resizable height); fields
 * are laid out in horizontal columns. Every edit dispatches an UPDATE_* action;
 * nested blocks are JSON-edited so unsurfaced keys survive.
 * // TODO: replace with api.saveProcess() (see actions).
 */
import { useAppDispatch } from '../../../store/hooks';
import { JsonField, SelectField, TextField } from '../../shared';
import {
  updateProcessNode,
  updateTask,
  updateEdge,
  updateProcessMeta,
} from '../store/actions';
import type {
  ExecutionStep,
  ProcessDoc,
  ProcessFlowEdge,
  ProcessFlowNode,
  ProcessPoint,
} from '../store/types';
import StepEditor from './StepEditor';

interface NodeInspectorProps {
  process: ProcessDoc;
  node: ProcessFlowNode | null;
  edge: ProcessFlowEdge | null;
  height: number;
  onClose: () => void;
}

export default function NodeInspector({ process, node, edge, height, onClose }: NodeInspectorProps) {
  const dispatch = useAppDispatch();
  const key = process.process_key;
  const sizeStyle = { height, flexBasis: height };

  const patchNode = (patch: Partial<ProcessFlowNode>) =>
    dispatch(updateProcessNode(key, node!.id, patch));
  const patchConfig = (configPatch: Record<string, unknown>) =>
    dispatch(updateProcessNode(key, node!.id, { config: configPatch }));
  const patchTask = (taskKey: string, patch: Record<string, unknown>) =>
    dispatch(updateTask(key, taskKey, patch));

  // Patch one entry/exit point inside its array, preserving siblings.
  const patchPoint = (kind: 'entry' | 'exit', pointKey: string, patch: Partial<ProcessPoint>) => {
    const listKey = kind === 'entry' ? 'entry_points' : 'exit_points';
    const idKey = kind === 'entry' ? 'entry_point_key' : 'exit_point_key';
    const list = (process[listKey] as ProcessPoint[] | undefined) ?? [];
    const next = list.map((p) => (p[idKey] === pointKey ? { ...p, ...patch } : p));
    dispatch(updateProcessMeta(key, { [listKey]: next }));
  };

  if (!node && !edge) {
    return (
      <aside className="proc-inspector proc-inspector--empty" style={sizeStyle}>
        <p className="proc-inspector__hint">Select a node or edge in the canvas above to edit its detail.</p>
      </aside>
    );
  }

  return (
    <aside className="proc-inspector" style={sizeStyle}>
      <div className="proc-inspector__header">
        <span className="proc-inspector__kind">{node ? `${node.type} node` : 'Edge'}</span>
        <button type="button" className="proc-inspector__close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      <div className="proc-inspector__body">
        {node && (node.type === 'ENTRY' || node.type === 'EXIT') &&
          renderPoint(node, node.type === 'ENTRY' ? 'entry' : 'exit')}
        {node && node.type === 'TASK' && renderTask(node)}
        {node && node.type === 'GATEWAY' && renderGateway(node)}
        {edge && (
          <div className="proc-inspector__col">
            <TextField
              label="condition"
              value={edge.condition ?? ''}
              onCommit={(v) => dispatch(updateEdge(key, edge.source, edge.target, { condition: v }))}
            />
          </div>
        )}
      </div>
    </aside>
  );

  // ----- renderers (closures over dispatch/process) -----

  function renderPoint(n: ProcessFlowNode, kind: 'entry' | 'exit') {
    const idKey = kind === 'entry' ? 'entry_point_key' : 'exit_point_key';
    const list = (process[kind === 'entry' ? 'entry_points' : 'exit_points'] as
      | ProcessPoint[]
      | undefined) ?? [];
    const currentKey = (n.config?.[idKey] as string | undefined) ?? '';
    const point = list.find((p) => p[idKey] === currentKey);

    return (
      <>
        <div className="proc-inspector__col">
          <TextField label="name" value={n.name ?? ''} onCommit={(v) => patchNode({ name: v })} />
          <SelectField
            label={idKey}
            value={currentKey}
            options={[
              ...(currentKey ? [] : [{ value: '', label: '— select —' }]),
              ...list.map((p) => ({ value: (p[idKey] as string) ?? '' })),
            ]}
            onChange={(v) => patchConfig({ [idKey]: v })}
          />
          {point && (
            <TextField
              label="event_schema"
              value={(point.event_schema as string) ?? ''}
              onCommit={(v) => patchPoint(kind, currentKey, { event_schema: v })}
            />
          )}
        </div>
        {point ? (
          <>
            <div className="proc-inspector__col">
              <JsonField
                label="endpoint_config"
                value={point.endpoint_config}
                rows={8}
                onCommit={(v) => patchPoint(kind, currentKey, { endpoint_config: v as Record<string, unknown> })}
              />
            </div>
            <div className="proc-inspector__col">
              <JsonField
                label="mapped_process_context"
                value={point.mapped_process_context}
                rows={8}
                onCommit={(v) => patchPoint(kind, currentKey, { mapped_process_context: v })}
              />
            </div>
            <div className="proc-inspector__col">
              <JsonField
                label="audit"
                value={point.audit}
                rows={8}
                onCommit={(v) => patchPoint(kind, currentKey, { audit: v as Record<string, unknown> })}
              />
            </div>
          </>
        ) : (
          <p className="proc-inspector__empty">No matching {kind}_point for “{currentKey}”.</p>
        )}
      </>
    );
  }

  function renderTask(n: ProcessFlowNode) {
    const taskKey = n.task_key ?? '';
    const task = process.tasks.find((t) => t.task_key === taskKey);
    return (
      <>
        <div className="proc-inspector__col">
          <SelectField
            label="task_key"
            value={taskKey}
            options={[
              ...(taskKey ? [] : [{ value: '', label: '— select —' }]),
              ...process.tasks.map((t) => ({ value: t.task_key })),
            ]}
            onChange={(v) => patchNode({ task_key: v })}
          />
          {task && (
            <>
              <TextField label="name" value={task.name ?? ''} onCommit={(v) => patchTask(taskKey, { name: v })} />
              <TextField
                label="department"
                value={task.department ?? ''}
                onCommit={(v) => patchTask(taskKey, { department: v })}
              />
              <TextField label="role" value={task.role ?? ''} onCommit={(v) => patchTask(taskKey, { role: v })} />
            </>
          )}
        </div>

        {task ? (
          <>
            <div className="proc-inspector__col">
              <TextField
                label="description"
                value={task.description ?? ''}
                multiline
                onCommit={(v) => patchTask(taskKey, { description: v })}
              />
              <JsonField
                label="inputs"
                value={task.inputs ?? []}
                rows={4}
                onCommit={(v) => patchTask(taskKey, { inputs: v as string[] })}
              />
              <JsonField
                label="outputs"
                value={task.outputs ?? []}
                rows={4}
                onCommit={(v) => patchTask(taskKey, { outputs: v as string[] })}
              />
            </div>
            <div className="proc-inspector__steps">
              <div className="proc-inspector__section">execution_steps</div>
              <StepEditor
                steps={task.task_steps?.execution_steps ?? []}
                onCommitSteps={(steps: ExecutionStep[]) =>
                  patchTask(taskKey, {
                    task_steps: { ...task.task_steps, execution_steps: steps },
                  })
                }
              />
            </div>
          </>
        ) : (
          <p className="proc-inspector__empty">No task bound to “{taskKey}”.</p>
        )}
      </>
    );
  }

  function renderGateway(n: ProcessFlowNode) {
    const cfg = n.config ?? {};
    return (
      <>
        <div className="proc-inspector__col">
          <TextField label="name" value={n.name ?? ''} onCommit={(v) => patchNode({ name: v })} />
          <SelectField
            label="gateway_type"
            value={(cfg.gateway_type as string) ?? ''}
            options={[{ value: 'PARALLEL' }, { value: 'EXCLUSIVE' }, { value: 'INCLUSIVE' }]}
            onChange={(v) => patchConfig({ gateway_type: v })}
          />
          <SelectField
            label="action"
            value={(cfg.action as string) ?? ''}
            options={[{ value: '', label: '— none —' }, { value: 'FORK' }, { value: 'JOIN' }]}
            onChange={(v) => patchConfig({ action: v || undefined })}
          />
        </div>
        <div className="proc-inspector__col">
          <JsonField
            label="tasks (branches)"
            value={(cfg.tasks as string[] | undefined) ?? []}
            rows={8}
            onCommit={(v) => patchConfig({ tasks: v as string[] })}
          />
        </div>
      </>
    );
  }
}
