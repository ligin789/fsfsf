import type { MaintenanceTask } from '../../types';

const CATEGORY_LABEL: Record<MaintenanceTask['category'], string> = {
  battery: 'Battery',
  rotor: 'Rotor',
  avionics: 'Avionics',
  airframe: 'Airframe',
  software: 'Software',
};

const CATEGORY_COLOR: Record<MaintenanceTask['category'], { fg: string; bg: string }> = {
  battery: { fg: '#9A3412', bg: '#FFEDD5' },
  rotor: { fg: '#1D4ED8', bg: '#DBEAFE' },
  avionics: { fg: '#6D28D9', bg: '#EDE9FE' },
  airframe: { fg: '#0F766E', bg: '#CCFBF1' },
  software: { fg: '#7C2D12', bg: '#FEF3C7' },
};

export function MaintenanceBody({ task }: { task: MaintenanceTask }) {
  const c = CATEGORY_COLOR[task.category];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 999,
            color: c.fg,
            background: c.bg,
          }}
        >
          {CATEGORY_LABEL[task.category]}
        </span>
        <span style={{ fontSize: 11, color: 'var(--app-text-subtle)', fontFamily: 'monospace' }}>
          {task.ticketRef}
        </span>
      </div>
      <div
        style={{
          fontSize: 12.5,
          color: 'var(--app-text-strong)',
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {task.description}
      </div>
    </div>
  );
}

export function MaintenanceDetail({ task }: { task: MaintenanceTask }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Section label="Ticket">
        <span style={{ fontFamily: 'monospace' }}>{task.ticketRef}</span>
      </Section>
      <Section label="Category">{CATEGORY_LABEL[task.category]}</Section>
      <Section label="Description">{task.description}</Section>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: 'var(--app-text-subtle)',
          textTransform: 'uppercase',
          letterSpacing: 0.4,
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 13, color: 'var(--app-text)', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}
