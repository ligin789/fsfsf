import type { ChecklistTask, TaskActions } from '../../types';

function progress(task: ChecklistTask) {
  const total = task.items.length;
  const done = task.items.filter((i) => i.done).length;
  return { total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export function ChecklistBody({ task }: { task: ChecklistTask }) {
  const p = progress(task);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569' }}>
        <span>
          {p.done} / {p.total} complete
        </span>
        <span style={{ fontWeight: 600, color: '#0F172A' }}>{p.pct}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: '#E2E8F0', overflow: 'hidden' }}>
        <div
          style={{
            width: `${p.pct}%`,
            height: '100%',
            background: '#2563EB',
            transition: 'width 200ms ease',
          }}
        />
      </div>
    </div>
  );
}

export function ChecklistDetail({
  task,
  actions,
}: {
  task: ChecklistTask;
  actions: TaskActions;
}) {
  const toggle = (itemId: string) => {
    const items = task.items.map((it) =>
      it.id === itemId ? { ...it, done: !it.done } : it,
    );
    actions.update({ items } as Partial<ChecklistTask>);
    const allDone = items.every((it) => it.done);
    if (allDone) actions.setStatus('done');
    else if (task.status === 'todo') actions.setStatus('in_progress');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {task.items.map((item) => (
        <label
          key={item.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 10px',
            borderRadius: 8,
            border: '1px solid #F1F5F9',
            background: item.done ? '#F0FDF4' : '#FFFFFF',
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={item.done}
            onChange={() => toggle(item.id)}
            style={{ width: 16, height: 16, cursor: 'pointer' }}
          />
          <span
            style={{
              fontSize: 13,
              color: '#0F172A',
              textDecoration: item.done ? 'line-through' : 'none',
              opacity: item.done ? 0.7 : 1,
            }}
          >
            {item.label}
          </span>
        </label>
      ))}
    </div>
  );
}
