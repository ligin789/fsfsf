/**
 * Shared inline styles for the Regulators module.
 * Mirrors the dashboard visual language (light surfaces, rounded cards,
 * slate text) used by the Geographical Management module.
 */
import type { CSSProperties } from 'react';

export const card: CSSProperties = {
  background: 'var(--app-surface)',
  borderRadius: 14,
  border: '1px solid var(--app-border-subtle)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
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
  boxSizing: 'border-box',
};

export const select: CSSProperties = {
  ...input,
  appearance: 'none',
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

export const btnGhost: CSSProperties = {
  ...btn,
  background: 'transparent',
  borderColor: 'transparent',
  color: 'var(--app-primary)',
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
    case 'ENABLED':
    case 'APPROVED':
    case 'VALID':
      return badge('#065F46', '#D1FAE5');
    case 'PENDING':
    case 'DRAFT':
    case 'CONDITIONAL':
      return badge('#1E40AF', '#DBEAFE');
    case 'SUSPENDED':
    case 'MAINTENANCE':
      return badge('#92400E', '#FEF3C7');
    case 'DECOMMISSIONED':
    case 'OFFBOARDED':
    case 'INACTIVE':
    case 'DISABLED':
      return badge('var(--app-text-muted)', 'var(--app-border)');
    case 'REVOKED':
    case 'EXPIRED':
      return badge('#9F1239', '#FFE4E6');
    default:
      return badge('var(--app-text-muted)', 'var(--app-border)');
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

// ---------- Modal ----------
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
  background: 'var(--app-surface)',
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
  borderBottom: '1px solid var(--app-border-subtle)',
};

export const modalTitle: CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 800,
  color: 'var(--app-text)',
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
  borderTop: '1px solid var(--app-border-subtle)',
  background: 'var(--app-surface-footer)',
};

// ---------- Tabs ----------
export const tabBar: CSSProperties = {
  display: 'flex',
  gap: 4,
  borderBottom: '1px solid var(--app-border)',
  marginBottom: 18,
};

export const tabItem = (active: boolean): CSSProperties => ({
  padding: '10px 18px',
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
  color: active ? 'var(--app-primary)' : 'var(--app-text-subtle)',
  borderBottom: active ? '2px solid var(--app-primary)' : '2px solid transparent',
  marginBottom: -1,
});

// ---------- External-link style UTM tile ----------
export const linkTile: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '14px 16px',
  borderRadius: 12,
  border: '1px solid var(--app-border)',
  background: 'var(--app-surface-subtle)',
  marginBottom: 10,
};
