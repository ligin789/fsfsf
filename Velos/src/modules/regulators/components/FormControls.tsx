/**
 * Small reusable labelled form controls for the Regulators modals.
 */
import type { ReactNode } from 'react';
import { input, label, select } from './uiStyles';

export function Field({
  title,
  required,
  children,
  span = 6,
}: {
  title: string;
  required?: boolean;
  children: ReactNode;
  span?: number;
}) {
  return (
    <div className={`col-12 col-md-${span}`} style={{ marginBottom: 14 }}>
      <label style={label}>
        {title}
        {required && <span style={{ color: '#DC2626' }}> *</span>}
      </label>
      {children}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      style={input}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export function SelectInput({
  value,
  onChange,
  options,
  placeholder = 'Select…',
}: {
  value: string;
  onChange: (v: string) => void;
  options: { id: string; labelText: string }[];
  placeholder?: string;
}) {
  return (
    <select
      style={select}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.labelText}
        </option>
      ))}
    </select>
  );
}

export function Checkbox({
  checked,
  onChange,
  title,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  title: string;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--app-text-muted)',
        cursor: 'pointer',
        padding: '8px 0',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {title}
    </label>
  );
}
