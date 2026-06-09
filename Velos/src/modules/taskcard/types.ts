/**
 * Task types for the eVTOL operations Task Card board.
 *
 * Each concrete task type extends BaseTask with a `type` discriminator and
 * its own payload. Templates are registered against `type` in registry.ts —
 * adding a new task type means: add an interface here, add a JSON fixture,
 * write a template, register it.
 */

export type TaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type RelatedEntityKind = 'aircraft' | 'vertiport' | 'operator' | 'flight';

export interface RelatedEntity {
  kind: RelatedEntityKind;
  id: string;
  label: string;
}

export interface BaseTask {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  createdAt: string;
  dueAt?: string;
  related?: RelatedEntity;
  cluster: string;
  region: string;
  zone: string;
}

export type ApprovalKind =
  | 'flight_plan'
  | 'operator_onboarding'
  | 'maintenance_release'
  | 'route_change';

export interface ApprovalTask extends BaseTask {
  type: 'approval';
  requester: string;
  approvalKind: ApprovalKind;
  summary: string;
  decision?: 'approved' | 'rejected';
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface ChecklistTask extends BaseTask {
  type: 'checklist';
  items: ChecklistItem[];
}

export type InspectionPhase = 'pre_flight' | 'post_flight' | 'periodic';
export type InspectionItemStatus = 'pending' | 'pass' | 'fail';

export interface InspectionItem {
  id: string;
  label: string;
  status: InspectionItemStatus;
}

export interface InspectionTask extends BaseTask {
  type: 'inspection';
  phase: InspectionPhase;
  items: InspectionItem[];
}

export type MaintenanceCategory =
  | 'battery'
  | 'rotor'
  | 'avionics'
  | 'airframe'
  | 'software';

export interface MaintenanceTask extends BaseTask {
  type: 'maintenance';
  ticketRef: string;
  category: MaintenanceCategory;
  description: string;
}

export interface GenericTask extends BaseTask {
  type: 'generic';
  description: string;
}

export type Task =
  | ApprovalTask
  | ChecklistTask
  | InspectionTask
  | MaintenanceTask
  | GenericTask;

export type TaskType = Task['type'];

export interface TaskActions {
  setStatus: (status: TaskStatus) => void;
  update: (patch: Partial<Task>) => void;
}
