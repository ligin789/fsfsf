import type { ApprovalTask, TaskActions } from '../../types';

const KIND_LABELS: Record<ApprovalTask['approvalKind'], string> = {
  flight_plan: 'Flight Plan',
  operator_onboarding: 'Operator Onboarding',
  maintenance_release: 'Maintenance Release',
  route_change: 'Route Change',
};

export function ApprovalBody({ task }: { task: ApprovalTask }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 12, color: '#475569' }}>
        <strong style={{ color: '#0F172A' }}>{KIND_LABELS[task.approvalKind]}</strong>
        {' · '}from {task.requester}
      </div>
      <div
        style={{
          fontSize: 12.5,
          color: '#334155',
          lineHeight: 1.45,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {task.summary}
      </div>
      {task.decision && (
        <span
          style={{
            alignSelf: 'flex-start',
            fontSize: 11,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 999,
            color: task.decision === 'approved' ? '#15803D' : '#B91C1C',
            background: task.decision === 'approved' ? '#DCFCE7' : '#FEE2E2',
          }}
        >
          {task.decision.toUpperCase()}
        </span>
      )}
    </div>
  );
}

export function ApprovalDetail({
  task,
  actions,
}: {
  task: ApprovalTask;
  actions: TaskActions;
}) {
  const decided = !!task.decision;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Section label="Approval Kind">{KIND_LABELS[task.approvalKind]}</Section>
      <Section label="Requester">{task.requester}</Section>
      <Section label="Summary">{task.summary}</Section>
      {decided && (
        <Section label="Decision">
          <span
            style={{
              fontWeight: 600,
              color: task.decision === 'approved' ? '#15803D' : '#B91C1C',
            }}
          >
            {task.decision!.toUpperCase()}
          </span>
        </Section>
      )}
      {!decided && (
        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
          <button
            type="button"
            style={btnPrimary}
            onClick={() => {
              actions.update({ decision: 'approved' } as Partial<ApprovalTask>);
              actions.setStatus('done');
            }}
          >
            Approve
          </button>
          <button
            type="button"
            style={btnDanger}
            onClick={() => {
              actions.update({ decision: 'rejected' } as Partial<ApprovalTask>);
              actions.setStatus('done');
            }}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: '#0F172A', lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 8,
  border: '1px solid #15803D',
  background: '#15803D',
  color: '#FFFFFF',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};
const btnDanger: React.CSSProperties = {
  ...btnPrimary,
  background: '#FFFFFF',
  borderColor: '#FCA5A5',
  color: '#B91C1C',
};
