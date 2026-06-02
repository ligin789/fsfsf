import type {
  InspectionItemStatus,
  InspectionTask,
  TaskActions,
} from '../../types';

const PHASE_LABEL: Record<InspectionTask['phase'], string> = {
  pre_flight: 'Pre-flight',
  post_flight: 'Post-flight',
  periodic: 'Periodic',
};

const STATUS_COLOR: Record<InspectionItemStatus, { fg: string; bg: string; label: string }> = {
  pending: { fg: '#64748B', bg: '#F1F5F9', label: 'Pending' },
  pass: { fg: '#15803D', bg: '#DCFCE7', label: 'Pass' },
  fail: { fg: '#B91C1C', bg: '#FEE2E2', label: 'Fail' },
};

export function InspectionBody({ task }: { task: InspectionTask }) {
  const total = task.items.length;
  const passed = task.items.filter((i) => i.status === 'pass').length;
  const failed = task.items.filter((i) => i.status === 'fail').length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 12, color: '#475569' }}>
        <strong style={{ color: '#0F172A' }}>{PHASE_LABEL[task.phase]}</strong> inspection
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <Chip color="#15803D" bg="#DCFCE7">
          {passed} pass
        </Chip>
        {failed > 0 && (
          <Chip color="#B91C1C" bg="#FEE2E2">
            {failed} fail
          </Chip>
        )}
        <Chip color="#64748B" bg="#F1F5F9">
          {total - passed - failed} pending
        </Chip>
      </div>
    </div>
  );
}

export function InspectionDetail({
  task,
  actions,
}: {
  task: InspectionTask;
  actions: TaskActions;
}) {
  const setItemStatus = (itemId: string, status: InspectionItemStatus) => {
    const items = task.items.map((it) =>
      it.id === itemId ? { ...it, status } : it,
    );
    actions.update({ items } as Partial<InspectionTask>);
    if (items.some((i) => i.status === 'fail')) actions.setStatus('blocked');
    else if (items.every((i) => i.status === 'pass')) actions.setStatus('done');
    else if (task.status === 'todo') actions.setStatus('in_progress');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 12, color: '#64748B' }}>
        Phase: <strong style={{ color: '#0F172A' }}>{PHASE_LABEL[task.phase]}</strong>
      </div>
      {task.items.map((item) => {
        const sc = STATUS_COLOR[item.status];
        return (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '8px 10px',
              borderRadius: 8,
              border: '1px solid #F1F5F9',
              background: '#FFFFFF',
            }}
          >
            <span style={{ flex: 1, fontSize: 13, color: '#0F172A' }}>{item.label}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 999,
                color: sc.fg,
                background: sc.bg,
              }}
            >
              {sc.label}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              <SmallBtn onClick={() => setItemStatus(item.id, 'pass')}>Pass</SmallBtn>
              <SmallBtn onClick={() => setItemStatus(item.id, 'fail')} danger>
                Fail
              </SmallBtn>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Chip({
  children,
  color,
  bg,
}: {
  children: React.ReactNode;
  color: string;
  bg: string;
}) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: 999,
        color,
        background: bg,
      }}
    >
      {children}
    </span>
  );
}

function SmallBtn({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '4px 8px',
        borderRadius: 6,
        border: `1px solid ${danger ? '#FCA5A5' : '#CBD5E1'}`,
        background: '#FFFFFF',
        color: danger ? '#B91C1C' : '#0F172A',
        fontSize: 11,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {children}
    </button>
  );
}
