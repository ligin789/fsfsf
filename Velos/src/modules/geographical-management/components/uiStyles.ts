/**
 * Shared inline styles for the Geographical Management module.
 * Mirrors the visual language used elsewhere in the dashboard
 * (light surfaces, rounded cards, slate text).
 */
import type { CSSProperties } from 'react';

export const card: CSSProperties = {
  background: '#FFFFFF',
  borderRadius: 14,
  border: '1px solid #F1F5F9',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
  padding: 20,
};

export const sectionTitle: CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: '#0F172A',
  marginBottom: 16,
  paddingBottom: 12,
  borderBottom: '1px solid #F1F5F9',
};

export const label: CSSProperties = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: '#475569',
  marginBottom: 6,
};

export const input: CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  borderRadius: 10,
  fontSize: '0.875rem',
  color: '#1E293B',
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
  border: '1px solid #F1F5F9',
};

export const table: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.875rem',
  color: '#1E293B',
};

export const th: CSSProperties = {
  textAlign: 'left',
  padding: '12px 16px',
  background: '#F8FAFC',
  borderBottom: '1px solid #E2E8F0',
  fontWeight: 700,
  color: '#0F172A',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  whiteSpace: 'nowrap',
};

export const td: CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #F1F5F9',
  whiteSpace: 'nowrap',
};

export const btn: CSSProperties = {
  padding: '8px 14px',
  borderRadius: 10,
  border: '1px solid #E2E8F0',
  background: '#FFFFFF',
  color: '#0F172A',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
};

export const btnPrimary: CSSProperties = {
  ...btn,
  background: '#2563EB',
  borderColor: '#2563EB',
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
  color: '#64748B',
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
  color: '#0F172A',
  margin: 0,
};

export const pageSubtitle: CSSProperties = {
  fontSize: '0.9rem',
  color: '#64748B',
  margin: '4px 0 0',
};
