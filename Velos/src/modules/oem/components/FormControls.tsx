/**
 * Reusable labelled form controls + a schema-driven form renderer used by
 * the heavier OEM modals (Aircraft Type / Battery Profile).
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
        color: '#475569',
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

// ---------- Schema-driven form ----------
export type FieldType = 'text' | 'number' | 'select' | 'checkbox' | 'date';

export interface FieldSpec {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  span?: number;
  options?: readonly string[] | { id: string; labelText: string }[];
}

export function SchemaForm({
  spec,
  values,
  onChange,
}: {
  spec: FieldSpec[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}) {
  return (
    <div className="row">
      {spec.map((f) => {
        if (f.type === 'checkbox') {
          return (
            <div className="col-12 col-md-4" key={f.key}>
              <Checkbox
                title={f.label}
                checked={Boolean(values[f.key])}
                onChange={(v) => onChange(f.key, v)}
              />
            </div>
          );
        }
        return (
          <Field
            key={f.key}
            title={f.label}
            required={f.required}
            span={f.span ?? 4}
          >
            {f.type === 'select' ? (
              <SelectInput
                value={String(values[f.key] ?? '')}
                onChange={(v) => onChange(f.key, v)}
                options={(f.options ?? []).map((o) =>
                  typeof o === 'string'
                    ? { id: o, labelText: o }
                    : (o as { id: string; labelText: string }),
                )}
              />
            ) : (
              <TextInput
                type={
                  f.type === 'number'
                    ? 'number'
                    : f.type === 'date'
                      ? 'date'
                      : 'text'
                }
                value={(values[f.key] ?? '') as string | number}
                onChange={(v) =>
                  onChange(
                    f.key,
                    f.type === 'number' ? (v === '' ? '' : Number(v)) : v,
                  )
                }
              />
            )}
          </Field>
        );
      })}
    </div>
  );
}
