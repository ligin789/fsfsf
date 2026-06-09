/**
 * Shared select field.
 */
import './fields.css';

export interface SelectOption {
  value: string;
  label?: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}

export default function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="vfld">
      <span className="vfld__label">{label}</span>
      <select className="vfld__select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label ?? opt.value}
          </option>
        ))}
      </select>
    </label>
  );
}
