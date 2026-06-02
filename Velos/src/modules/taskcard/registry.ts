/**
 * Template registry — maps each task `type` to:
 *   - a card body (rendered inside the kanban card)
 *   - a detail body (rendered inside the details modal)
 *   - presentation metadata (label, accent color, icon)
 *
 * Add a new task type:
 *   1. extend the Task union in types.ts
 *   2. write a template (body + detail) under components/templates
 *   3. register it here
 */
import type { ComponentType } from 'react';
import type { Task, TaskActions, TaskType } from './types';
import { ApprovalBody, ApprovalDetail } from './components/templates/ApprovalTemplate';
import { ChecklistBody, ChecklistDetail } from './components/templates/ChecklistTemplate';
import { InspectionBody, InspectionDetail } from './components/templates/InspectionTemplate';
import { MaintenanceBody, MaintenanceDetail } from './components/templates/MaintenanceTemplate';
import { GenericBody, GenericDetail } from './components/templates/GenericTemplate';

export interface TaskTemplate<T extends Task = Task> {
  label: string;
  icon: string;
  accent: string;
  Body: ComponentType<{ task: T }>;
  Detail: ComponentType<{ task: T; actions: TaskActions }>;
}

export const TASK_TEMPLATES: { [K in TaskType]: TaskTemplate<Extract<Task, { type: K }>> } = {
  approval: {
    label: 'Approval',
    icon: '✅',
    accent: '#2563EB',
    Body: ApprovalBody,
    Detail: ApprovalDetail,
  },
  checklist: {
    label: 'Checklist',
    icon: '📋',
    accent: '#0EA5E9',
    Body: ChecklistBody,
    Detail: ChecklistDetail,
  },
  inspection: {
    label: 'Inspection',
    icon: '🔍',
    accent: '#14B8A6',
    Body: InspectionBody,
    Detail: InspectionDetail,
  },
  maintenance: {
    label: 'Maintenance',
    icon: '🔧',
    accent: '#F97316',
    Body: MaintenanceBody,
    Detail: MaintenanceDetail,
  },
  generic: {
    label: 'Task',
    icon: '🗂️',
    accent: '#64748B',
    Body: GenericBody,
    Detail: GenericDetail,
  },
};

export function getTemplate<T extends Task>(task: T): TaskTemplate<T> {
  return TASK_TEMPLATES[task.type] as unknown as TaskTemplate<T>;
}
