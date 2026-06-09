/**
 * Shared inline styles for the Geographical Management module.
 * Mirrors the visual language used elsewhere in the dashboard
 * (light surfaces, rounded cards, slate text).
 */
import type { CSSProperties } from 'react';

export const card: CSSProperties = {
  background: 'var(--app-surface)',
  borderRadius: 14,
  border: '1px solid var(--app-border-subtle)',
  boxShadow: 'var(--app-shadow-card)',
  padding: 20,
};

export const sectionTitle: CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--app-text)',
  marginBottom: 16,
  paddingBottom: 12,
  borderBottom: '1px solid var(--app-border-subtle)',
};

export const label: CSSProperties = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: 'var(--app-text-muted)',
  marginBottom: 6,
};

export const input: CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--app-surface-subtle)',
  border: '1px solid var(--app-border)',
  borderRadius: 10,
  fontSize: '0.875rem',
  color: 'var(--app-text-strong)',
  outline: 'none',
  fontFamily: 'inherit',
};

export const select: CSSProperties = {
  ...input,
  appearance: 'none',
};

export const tableWrap: CSSProperties = {
  width: '100%',
  overflowX: 'auto',
  borderRadius: 12,
  border: '1px solid var(--app-border-subtle)',
};

export const table: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.875rem',
  color: 'var(--app-text-strong)',
};

export const th: CSSProperties = {
  textAlign: 'left',
  padding: '12px 16px',
  background: 'var(--app-surface-subtle)',
  borderBottom: '1px solid var(--app-border)',
  fontWeight: 700,
  color: 'var(--app-text)',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
};

export const td: CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid var(--app-border-subtle)',
  whiteSpace: 'nowrap',
};

export const btn: CSSProperties = {
  padding: '8px 14px',
  borderRadius: 10,
  border: '1px solid var(--app-border)',
  background: 'var(--app-surface)',
  color: 'var(--app-text)',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

export const btnPrimary: CSSProperties = {
  ...btn,
  background: 'var(--app-primary)',
  borderColor: 'var(--app-primary)',
  color: '#FFFFFF',
};

export const btnDanger: CSSProperties = {
  ...btn,
  background: '#FEE2E2',
  borderColor: '#FCA5A5',
  color: '#B91C1C',
};

export const badge = (color: string, bg: string): CSSProperties => ({
  display: 'inline-block',
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
  color,
  background: bg,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
});

export const statusBadge = (status?: string): CSSProperties => {
  switch (status) {
    case 'ACTIVE':
      return badge('#065F46', '#D1FAE5');
    case 'PLANNED':
      return badge('#1E40AF', '#DBEAFE');
    case 'SUSPENDED':
      return badge('#92400E', '#FEF3C7');
    case 'DECOMMISSIONED':
      return badge('#475569', '#E2E8F0');
    case 'RESTRICTED':
      return badge('#9F1239', '#FFE4E6');
    default:
      return badge('#475569', '#E2E8F0');
  }
};

export const banner = (kind: 'success' | 'error'): CSSProperties => ({
  padding: '10px 14px',
  borderRadius: 10,
  marginBottom: 12,
  fontSize: 13,
  fontWeight: 600,
  background: kind === 'success' ? '#D1FAE5' : '#FEE2E2',
  color: kind === 'success' ? '#065F46' : '#B91C1C',
  border: `1px solid ${kind === 'success' ? '#A7F3D0' : '#FCA5A5'}`,
});

export const spinnerWrap: CSSProperties = {
  padding: 24,
  textAlign: 'center',
  color: 'var(--app-text-subtle)',
  fontSize: 13,
};

export const pageHeader: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  gap: 12,
  marginBottom: 20,
};

export const pageTitle: CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 800,
  color: 'var(--app-text)',
  margin: 0,
};

export const pageSubtitle: CSSProperties = {
  fontSize: '0.9rem',
  color: 'var(--app-text-subtle)',
  margin: '4px 0 0',
};
