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
  const color = warnAt != null && v >= warnAt ? '#DC2626' : '#2563EB';

  return (
    <div
      style={{
        padding: 14,
        border: '1px solid #E2E8F0',
        borderRadius: 12,
        background: '#FFFFFF',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>{value ?? '—'}</div>
        {unit && <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>{unit}</div>}
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 3,
          background: '#F1F5F9',
          marginTop: 10,
          overflow: 'hidden',
        }}
      >
        <div style={{ height: '100%', width: `${pct}%`, background: color }} />
      </div>
      <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 4 }}>limit {max}{unit ? ` ${unit}` : ''}</div>
    </div>
  );
}
