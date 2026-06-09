interface Props {
  label: string;
  value?: number;
  unit?: string;
  max: number;
  warnAt?: number;
}

export default function Gauge({ label, value, unit, max, warnAt }: Props) {
  const v = value ?? 0;
  const pct = Math.min(100, (v / max) * 100);
  const color = warnAt != null && v >= warnAt ? '#DC2626' : 'var(--app-primary)';

  return (
    <div
      style={{
        padding: 14,
        border: '1px solid var(--app-border)',
        borderRadius: 12,
        background: 'var(--app-surface)',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--app-text-subtle)', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--app-text)' }}>{value ?? '—'}</div>
        {unit && <div style={{ fontSize: 12, color: 'var(--app-text-subtle)', fontWeight: 600 }}>{unit}</div>}
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 3,
          background: 'var(--app-border-subtle)',
          marginTop: 10,
          overflow: 'hidden',
        }}
      >
        <div style={{ height: '100%', width: `${pct}%`, background: color }} />
      </div>
      <div style={{ fontSize: 10, color: 'var(--app-text-faint)', marginTop: 4 }}>limit {max}{unit ? ` ${unit}` : ''}</div>
    </div>
  );
}
