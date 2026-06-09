/**
 * Domain types for the Processes module.
 *
 * Field names mirror the Process JSON schema exactly. Deeply-nested blocks that
 * the UI only edits as raw JSON (endpoint_config, mappings, process_context, …)
 * are typed loosely as `Record<string, unknown>` / `unknown` so the full
 * document round-trips faithfully — the store keeps the raw object and overrides
 * only edited keys. Index signatures on the editable records preserve any
 * unsurfaced sibling keys.
 */

export type ProcessNodeType = 'ENTRY' | 'TASK' | 'GATEWAY' | 'EXIT';

/** A node in processFlow.nodes. */
export interface ProcessFlowNode {
  id: string;
  type: ProcessNodeType;
  name?: string;
  /** Present on TASK nodes — resolves to a tasks[] entry by task_key. */
  task_key?: string;
  /** ENTRY: { entry_point_key }, EXIT: { exit_point_key }, GATEWAY: { gateway_type, action, tasks } … */
  config?: Record<string, unknown>;
}

/** A directed edge in processFlow.edges. */
export interface ProcessFlowEdge {
  source: string;
  target: string;
  condition?: string;
}

export interface ProcessFlow {
  nodes: ProcessFlowNode[];
  edges: ProcessFlowEdge[];
}

export type ExecutionStepType = 'TOOLKIT' | 'VALIDATION' | 'TRANSFORM';

/** A single execution step inside a task. Fields vary by `type`. */
export interface ExecutionStep {
  id: string;
  name: string;
  type: ExecutionStepType;
  // TOOLKIT
  toolkitName?: string;
  toolkitId?: string;
  // VALIDATION
  rulesetName?: string;
  rulesetId?: string;
  // TOOLKIT / VALIDATION
  api?: Record<string, unknown>;
  requestMapping?: Record<string, unknown>;
  responseMapping?: Record<string, unknown>;
  successCriteria?: unknown;
  errorHandling?: unknown;
  // TRANSFORM
  mappingLanguage?: string;
  map?: unknown;
  when?: unknown;
  saveAs?: string;
  schemaRef?: string;
  // preserve any other keys present in the source
  [key: string]: unknown;
}

export interface TaskSteps {
  executionMode?: string;
  failOnFirstError?: boolean;
  execution_steps: ExecutionStep[];
}

export interface ProcessTask {
  task_id: string;
  task_key: string;
  name: string;
  type: string;
  department?: string;
  role?: string;
  description?: string;
  inputs?: string[];
  outputs?: string[];
  task_steps?: TaskSteps;
  [key: string]: unknown;
}

/** Entry or exit point. Entry uses entry_point_*; exit uses exit_point_*. */
export interface ProcessPoint {
  entry_point_key?: string;
  exit_point_key?: string;
  name?: string;
  endpoint_config?: Record<string, unknown>;
  event_schema?: string;
  mapped_process_context?: unknown;
  audit?: Record<string, unknown>;
  [key: string]: unknown;
}

/** A full Process document, matching the attached JSON. */
export interface ProcessDoc {
  process_id: string;
  process_key: string;
  name: string;
  description?: string;
  version: string;
  status: string;
  metadata?: Record<string, unknown>;
  domain?: Record<string, unknown>;
  operator?: Record<string, unknown>;
  process_context?: Record<string, unknown>;
  exports?: unknown[];
  entry_points?: ProcessPoint[];
  exit_points?: ProcessPoint[];
  tasks: ProcessTask[];
  processFlow: ProcessFlow;
  [key: string]: unknown;
}

export type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface ProcessesState {
  items: ProcessDoc[];
  status: LoadStatus;
  error: string | null;
  /** process_key of the currently selected process, or null. */
  selectedProcessKey: string | null;
}

/** Minimal root shape this module's selectors rely on. */
export interface ProcessesRootShape {
  processes: ProcessesState;
}
