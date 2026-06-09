/**
 * Domain types for the Process Groups module.
 *
 * Field names mirror the ProcessGroup JSON schema exactly so that state stays a
 * faithful, round-trippable representation of the source documents.
 */

/** A single node in the process-group DAG. */
export interface PGNode {
  node_id: string;
  process_key: string;
  /** Context objects this node consumes. Optional in the source schema. */
  imports?: string[];
  /** Context objects this node produces. Optional in the source schema. */
  exports?: string[];
}

/** A directed edge between two nodes. */
export interface PGEdge {
  from: string;
  to: string;
  /** Optional guard expression that gates traversal of this edge. */
  condition?: string;
}

export interface PGPurpose {
  business_objective: string;
  primary_kpis: string[];
}

export interface PGDomain {
  industry: string;
  function: string;
  subfunction: string;
  applicability: {
    operatingcluster: string[];
  };
}

export interface PGOperator {
  operatorCode: string;
  operatorName: string;
  operatorType: string;
  policyNamespace: string;
  region: string;
}

export interface PGMetadata {
  updatedForProcess: string;
  changeReason: string;
}

/** A full process group, matching the attached JSON document shape. */
export interface ProcessGroup {
  process_group_id: string;
  process_group_key: string;
  name: string;
  execution_model: string;
  purpose: PGPurpose;
  domain: PGDomain;
  operator: PGOperator;
  nodes: PGNode[];
  edges: PGEdge[];
  version: string;
  metadata: PGMetadata;
}

export type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

/** Slice state shape owned by this module. */
export interface ProcessGroupsState {
  items: ProcessGroup[];
  status: LoadStatus;
  error: string | null;
  /** process_group_id of the currently selected group, or null. */
  selectedGroupId: string | null;
}

/**
 * Minimal view of the root store this module relies on. Selectors are typed
 * against this so the module stays decoupled from the host RootState type.
 */
export interface ProcessGroupsRootShape {
  processGroups: ProcessGroupsState;
}
