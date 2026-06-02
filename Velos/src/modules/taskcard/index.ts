export { default as TaskBoard } from './components/TaskBoard';
export { TASK_TEMPLATES, getTemplate } from './registry';
export type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskType,
  TaskActions,
  ApprovalTask,
  ChecklistTask,
  InspectionTask,
  MaintenanceTask,
  GenericTask,
} from './types';
