import { getTemplate } from '../registry';
import type { Task, TaskPriority } from '../types';

const PRIORITY_COLOR: Record<TaskPriority, { fg: string; bg: string; label: string }> = {
  low: { fg: '#475569', bg: '#F1F5F9', label: 'Low' },
  medium: { fg: '#1D4ED8', bg: '#DBEAFE', label: 'Medium' },
  high: { fg: '#9A3412', bg: '#FFEDD5', label: 'High' },
  critical: { fg: '#B91C1C', bg: '#FEE2E2', label: 'Critical' },
};

function formatDue(iso?: string): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TaskCard({ task, onOpen }: { task: Task; onOpen: () => void }) {
  const template = getTemplate(task);
  const Body = template.Body;
  const prio = PRIORITY_COLOR[task.priority];
  const due = formatDue(task.dueAt);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="tc-card"
      style={{ ['--tc-accent' as never]: template.accent }}
    >
      <div className="tc-card__topline">
        <span className="tc-card__type">
          <span aria-hidden style={{ marginRight: 4 }}>{template.icon}</span>
          {template.label}
        </span>
        <span className="tc-pill" style={{ color: prio.fg, background: prio.bg }}>
          {prio.label}
        </span>
        <span className="tc-card__id">{task.id}</span>
      </div>

      <h4 className="tc-card__title">{task.title}</h4>

      <Body task={task} />

      <div className="tc-card__footer">
        <span>👤 {task.assignee}</span>
        {task.related && <span>· {task.related.label}</span>}
        {due && (
          <span style={{ marginLeft: 'auto' }}>
            <span aria-hidden>⏱</span> {due}
          </span>
        )}
      </div>
    </button>
  );
}
