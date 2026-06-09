/**
 * Shared text field. Edits locally and commits on blur or Enter so callers can
 * write straight to the Redux store without a dispatch per keystroke.
 */
import { useEffect, useState } from 'react';
import './fields.css';

interface TextFieldProps {
  label: string;
  value: string;
  onCommit: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}

export default function TextField({ label, value, onCommit, placeholder, multiline }: TextFieldProps) {
  const [draft, setDraft] = useState(value);

  // Re-sync when the external value changes (e.g. a different node selected).
  useEffect(() => setDraft(value), [value]);

  const commit = () => {
    if (draft !== value) onCommit(draft);
  };

  return (
    <label className="vfld">
      <span className="vfld__label">{label}</span>
      {multiline ? (
        <textarea
          className="vfld__textarea"
          style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 12 }}
          rows={3}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
        />
      ) : (
        <input
          className="vfld__input"
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
        />
      )}
    </label>
  );
}
