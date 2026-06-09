import { useEffect } from 'react';
import { getTemplate } from '../registry';
import type { Task, TaskActions, TaskPriority, TaskStatus } from '../types';

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  done: 'Done',
};

const STATUS_COLOR: Record<TaskStatus, string> = {
  todo: 'var(--app-text-subtle)',
  in_progress: '#2563EB',
  blocked: '#B91C1C',
  done: '#15803D',
};

const PRIORITY_COLOR: Record<TaskPriority, { fg: string; bg: string; label: string }> = {
  low: { fg: 'var(--app-text-muted)', bg: 'var(--app-border-subtle)', label: 'Low' },
  medium: { fg: '#1D4ED8', bg: '#DBEAFE', label: 'Medium' },
  high: { fg: '#9A3412', bg: '#FFEDD5', label: 'High' },
  critical: { fg: '#B91C1C', bg: '#FEE2E2', label: 'Critical' },
};

interface Props {
  task: Task;
  actions: TaskActions;
  onClose: () => void;
}

export default function TaskDetailsModal({ task, actions, onClose }: Props) {
  const template = getTemplate(task);
  const Detail = template.Detail;
  const prio = PRIORITY_COLOR[task.priority];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const due = task.dueAt
    ? new Date(task.dueAt).toLocaleString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  return (
    <div className="tc-modal__overlay" onClick={onClose}>
      <div className="tc-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tc-modal__header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span
                className="tc-pill"
                style={{ color: template.accent, background: 'var(--app-border-subtle)' }}
              >
                {template.icon} {template.label}
              </span>
              <span className="tc-pill" style={{ color: prio.fg, background: prio.bg }}>
                {prio.label}
              </span>
              <span
                className="tc-pill"
                style={{
                  color: '#FFFFFF',
                  background: STATUS_COLOR[task.status],
                }}
              >
                {STATUS_LABEL[task.status]}
              </span>
              <span style={{ fontSize: 11, color: 'var(--app-text-faint)', fontFamily: 'monospace' }}>
                {task.id}
              </span>
            </div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--app-text)' }}>
              {task.title}
            </h3>
          </div>
          <button
            type="button"
            className="tc-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="tc-modal__body">
          <MetaGrid
            assignee={task.assignee}
            related={task.related?.label}
            due={due}
          />
          <Detail task={task as never} actions={actions} />
        </div>

        <div className="tc-modal__footer">
          <span style={{ fontSize: 12, color: 'var(--app-text-subtle)', fontWeight: 600 }}>Move to:</span>
          {(Object.keys(STATUS_LABEL) as TaskStatus[]).map((s) => {
            const isActive = s === task.status;
            return (
              <button
                key={s}
                type="button"
                onClick={() => actions.setStatus(s)}
                disabled={isActive}
                style={{
                  padding: '6px 12px',
                  borderRadius: 999,
                  border: `1px solid ${isActive ? STATUS_COLOR[s] : 'var(--app-border)'}`,
                  background: isActive ? STATUS_COLOR[s] : 'var(--app-surface)',
                  color: isActive ? '#FFFFFF' : 'var(--app-text)',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: isActive ? 'default' : 'pointer',
                  opacity: isActive ? 0.95 : 1,
                }}
              >
                {STATUS_LABEL[s]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function MetaGrid({
  assignee,
  related,
  due,
}: {
  assignee: string;
  related?: string;
  due: string;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: 10,
        padding: 12,
        background: 'var(--app-surface-subtle)',
        border: '1px solid var(--app-border-subtle)',
        borderRadius: 10,
      }}
    >
      <Meta label="Assignee">{assignee}</Meta>
      <Meta label="Related">{related ?? '—'}</Meta>
      <Meta label="Due">{due}</Meta>
    </div>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--app-text-subtle)',
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13, color: 'var(--app-text)', fontWeight: 500 }}>{children}</div>
    </div>
  );
}
