/**
 * Shared inline styles for the Route module.
 * Mirrors the rest of the dashboard visual language.
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
  fontSize: '0.95rem',
  fontWeight: 700,
  color: '#0F172A',
  marginBottom: 12,
  paddingBottom: 8,
  borderBottom: '1px solid #F1F5F9',
};

export const label: CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#64748B',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  marginBottom: 4,
};

export const value: CSSProperties = {
  fontSize: '0.875rem',
  color: '#0F172A',
  fontWeight: 600,
};

export const input: CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  borderRadius: 8,
  fontSize: '0.875rem',
  color: '#1E293B',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
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

export const btnGhost: CSSProperties = {
  ...btn,
  background: 'transparent',
  borderColor: 'transparent',
  color: '#2563EB',
};

export const pill = (color: string, bg: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '3px 8px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
  color,
  background: bg,
  letterSpacing: '0.02em',
});

export const statusBadge = (status?: string): CSSProperties => {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'ACTIVE':
    case 'APPROVED':
    case 'CONFIRMED':
    case 'HARD_LOCK':
      return pill('#065F46', '#D1FAE5');
    case 'PENDING':
    case 'PENDING_APPROVAL':
    case 'SOFT_LOCK':
    case 'DRAFT':
      return pill('#1E40AF', '#DBEAFE');
    case 'CANCELLED':
    case 'REVOKED':
    case 'EXPIRED':
      return pill('#9F1239', '#FFE4E6');
    case 'SUSPENDED':
      return pill('#92400E', '#FEF3C7');
    default:
      return pill('#475569', '#E2E8F0');
  }
};

export const pageHeader: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 12,
  marginBottom: 20,
  flexWrap: 'wrap',
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

export const tabBar: CSSProperties = {
  display: 'flex',
  gap: 4,
  borderBottom: '1px solid #E2E8F0',
  marginBottom: 18,
};

export const tabItem = (active: boolean): CSSProperties => ({
  padding: '10px 14px',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  color: active ? '#2563EB' : '#64748B',
  borderBottom: active ? '2px solid #2563EB' : '2px solid transparent',
  marginBottom: -1,
});

export const modalOverlay: CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(15,23,42,0.45)',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '40px 16px',
  zIndex: 2000,
  overflowY: 'auto',
};

export const modalBox: CSSProperties = {
  background: '#FFFFFF',
  borderRadius: 16,
  width: '100%',
  maxWidth: 760,
  boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
  overflow: 'hidden',
};

export const modalHeader: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '18px 22px',
  borderBottom: '1px solid #F1F5F9',
};

export const modalTitle: CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 800,
  color: '#0F172A',
  margin: 0,
};

export const modalBody: CSSProperties = {
  padding: 22,
  maxHeight: '70vh',
  overflowY: 'auto',
};

export const modalFooter: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  padding: '16px 22px',
  borderTop: '1px solid #F1F5F9',
  background: '#FAFBFC',
};

export const fieldLabel: CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '#475569',
  marginBottom: 6,
  letterSpacing: '0.02em',
};

export const approvalBanner = (status?: string): CSSProperties => {
  const s = (status || '').toUpperCase();
  const palette = {
    APPROVED: { bg: '#D1FAE5', border: '#A7F3D0', color: '#065F46' },
    PENDING_APPROVAL: { bg: '#DBEAFE', border: '#BFDBFE', color: '#1E40AF' },
    PENDING: { bg: '#DBEAFE', border: '#BFDBFE', color: '#1E40AF' },
    EXPIRED: { bg: '#FFE4E6', border: '#FECDD3', color: '#9F1239' },
    DRAFT: { bg: '#F1F5F9', border: '#E2E8F0', color: '#475569' },
  } as const;
  const p = palette[s as keyof typeof palette] ?? palette.DRAFT;
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 12,
    background: p.bg,
    border: `1px solid ${p.border}`,
    color: p.color,
    fontWeight: 600,
    fontSize: 13,
  };
};
