import { useMemo, useState } from 'react';
import { HiOutlineDocumentDuplicate, HiOutlineShieldCheck } from 'react-icons/hi';
import RouteApprovalBanner from '../components/RouteApprovalBanner';
import { mockRoutes, mockVersions } from '../data/mockRoutes';
import {
  card,
  input,
  pageHeader,
  pageSubtitle,
  pageTitle,
  pill,
  sectionTitle,
  statusBadge,
} from '../components/uiStyles';
import type { RouteVersionResponse } from '../types';

export default function VersionsPage() {
  const [routeId, setRouteId] = useState<string>(mockRoutes[0]?.routeId ?? '');
  const route = useMemo(() => mockRoutes.find((r) => r.routeId === routeId) ?? null, [routeId]);
  const versions = useMemo(
    () =>
      mockVersions
        .filter((v) => v.routeId === routeId)
        .sort((a, b) => (b.versionNumber ?? 0) - (a.versionNumber ?? 0)),
    [routeId],
  );

  const current = versions.find((v) => v.isCurrent) ?? versions[0] ?? null;
  const [compareId, setCompareId] = useState<string | null>(versions[1]?.versionId ?? null);
  const compare = versions.find((v) => v.versionId === compareId) ?? null;

  return (
    <div style={{ padding: 24 }}>
      <div style={pageHeader}>
        <div>
          <h1 style={pageTitle}>Lifecycle & Version Control</h1>
          <p style={pageSubtitle}>Compare versions, view approvals, and inspect change history.</p>
        </div>
        <select value={routeId} onChange={(e) => setRouteId(e.target.value)} style={{ ...input, maxWidth: 280 }}>
          {mockRoutes.map((r) => (
            <option key={r.routeId} value={r.routeId}>
              {r.routeDesignator} — {r.routeName}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <RouteApprovalBanner route={route} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 14 }}>
        <div style={{ ...card, padding: 14 }}>
          <div style={sectionTitle}>Version History ({versions.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {versions.map((v) => {
              const isCompare = compareId === v.versionId;
              return (
                <button
                  key={v.versionId}
                  onClick={() => setCompareId(v.versionId)}
                  style={{
                    textAlign: 'left',
                    padding: 10,
                    borderRadius: 8,
                    border: `1px solid ${isCompare ? '#2563EB' : '#E2E8F0'}`,
                    background: isCompare ? '#EFF6FF' : '#FFFFFF',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700, fontSize: 13 }}>v{v.versionNumber}</span>
                    {v.isCurrent && <span style={pill('#065F46', '#D1FAE5')}>CURRENT</span>}
                  </div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 4 }}>
                    {v.changeType} · {v.effectiveFrom}
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>AIRAC {v.airacCycle}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div style={card}>
          <div style={sectionTitle}>
            <HiOutlineDocumentDuplicate style={{ marginRight: 6 }} />
            Compare Versions
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <VersionCol title="Current" version={current} highlight />
            <VersionCol title="Compare to" version={compare} />
          </div>
        </div>
      </div>
    </div>
  );
}

function VersionCol({
  title,
  version,
  highlight,
}: {
  title: string;
  version: RouteVersionResponse | null;
  highlight?: boolean;
}) {
  if (!version) {
    return (
      <div
        style={{
          padding: 16,
          background: '#F8FAFC',
          border: '1px dashed #CBD5E1',
          borderRadius: 12,
          color: '#94A3B8',
          fontSize: 13,
        }}
      >
        {title}: none selected
      </div>
    );
  }
  return (
    <div
      style={{
        padding: 14,
        background: highlight ? '#EFF6FF' : '#F8FAFC',
        border: `1px solid ${highlight ? '#BFDBFE' : '#E2E8F0'}`,
        borderRadius: 12,
      }}
    >
      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
        {title}
      </div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          marginTop: 4,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>v{version.versionNumber}</span>
        <span style={statusBadge(version.approvalStatus)}>{version.approvalStatus}</span>
        <span style={pill('#475569', '#F1F5F9')}>{version.changeType}</span>
        <span style={pill('#1E40AF', '#DBEAFE')}>AIRAC {version.airacCycle || '—'}</span>
      </div>
      <Row k="Effective From" v={version.effectiveFrom} />
      <Row k="Effective Until" v={version.effectiveUntil} />
      <Row k="Approved At" v={version.approvedAt} />
      <Row k="Created At" v={version.createdAt} />

      <div style={{ marginTop: 10 }}>
        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, marginBottom: 2 }}>
          CHANGE SUMMARY
        </div>
        <div style={{ fontSize: 13, color: '#0F172A' }}>{version.changeSummary || '—'}</div>
      </div>

      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 700, marginBottom: 2 }}>REASON</div>
        <div style={{ fontSize: 12, color: '#475569' }}>{version.changeReason || '—'}</div>
      </div>

      {version.requiresRegulatoryApproval && (
        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            color: '#1E40AF',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <HiOutlineShieldCheck />
          Requires regulatory approval
        </div>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '3px 0' }}>
      <span style={{ color: '#64748B' }}>{k}</span>
      <span style={{ color: '#0F172A', fontWeight: 600 }}>{v || '—'}</span>
    </div>
  );
}
