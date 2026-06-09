/**
 * Shared JSON-editable field. Renders any value as pretty JSON in a textarea;
 * commits the parsed value on blur. Invalid JSON shows an error and is NOT
 * committed, so the underlying object is never corrupted — this is how nested
 * blocks (api, mappings, audit, endpoint_config, …) are edited without dropping
 * unsurfaced keys.
 */
import { useEffect, useState } from 'react';
import './fields.css';

interface JsonFieldProps {
  label: string;
  value: unknown;
  onCommit: (value: unknown) => void;
  rows?: number;
}

const pretty = (value: unknown): string => {
  if (value === undefined) return '';
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

export default function JsonField({ label, value, onCommit, rows = 6 }: JsonFieldProps) {
  const [draft, setDraft] = useState(() => pretty(value));
  const [error, setError] = useState<string | null>(null);

  // Re-sync when the external value changes (different node/step selected).
  useEffect(() => {
    setDraft(pretty(value));
    setError(null);
  }, [value]);

  const commit = () => {
    const text = draft.trim();
    if (text === '') {
      setError(null);
      if (value !== undefined) onCommit(undefined);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      setError(null);
      if (pretty(parsed) !== pretty(value)) onCommit(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  };

  return (
    <label className="vfld">
      <span className="vfld__label">{label}</span>
      <textarea
        className={`vfld__textarea ${error ? 'vfld__textarea--error' : ''}`}
        rows={rows}
        value={draft}
        spellCheck={false}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
      />
      {error && <span className="vfld__error">{error}</span>}
    </label>
  );
}
