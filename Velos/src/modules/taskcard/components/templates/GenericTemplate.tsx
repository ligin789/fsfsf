import type { GenericTask } from '../../types';

export function GenericBody({ task }: { task: GenericTask }) {
  return (
    <div
      style={{
        fontSize: 12.5,
        color: '#334155',
        lineHeight: 1.45,
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}
    >
      {task.description}
    </div>
  );
}

export function GenericDetail({ task }: { task: GenericTask }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#64748B',
          textTransform: 'uppercase',
          letterSpacing: 0.4,
          marginBottom: 4,
        }}
      >
        Description
      </div>
      <div style={{ fontSize: 13, color: '#0F172A', lineHeight: 1.5 }}>
        {task.description}
      </div>
    </div>
  );
}
