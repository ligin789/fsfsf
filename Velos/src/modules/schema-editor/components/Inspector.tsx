/**
 * Right pane: edits the selected node by kind.
 *
 * Every edit is a targeted JSON-Pointer mutation, so unknown keywords on the
 * node survive. Supports object / array / string / integer / number / boolean /
 * null, the type-less `enum` case, `required` toggling (on the parent),
 * `additionalProperties` (incl. `false`), string facets, number bounds, array
 * facets, `$ref` editing with `$defs` autocomplete, and "open object" nodes
 * (`type:object` with no `properties`) without auto-filling them.
 */
import { useDispatch } from 'react-redux';
import {
  removeAtPointer,
  selectNode,
  setAtPointer,
  toggleRequired,
} from '../store/actions';
import { getAtPointer, joinPointer, splitParent } from '../lib/pointer';
import { defRef, listDefs, parseRef } from '../lib/refs';
import { useSchema, useSelectedPointer } from './hooks';
import { useSchemaEditorContext } from '../context';
import type { JsonSchema, JsonSchemaType } from '../types';

const SCALAR_TYPES: JsonSchemaType[] = [
  'object',
  'array',
  'string',
  'integer',
  'number',
  'boolean',
  'null',
];

const FORMATS = [
  '',
  'date-time',
  'date',
  'time',
  'duration',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uuid',
  'regex',
];

export default function Inspector() {
  const schema = useSchema();
  const pointer = useSelectedPointer();
  const dispatch = useDispatch();
  const { readOnly } = useSchemaEditorContext();
  const disabled = readOnly;

  if (!schema) return <div className="se-inspector-empty">No schema loaded.</div>;
  const node = getAtPointer<JsonSchema>(schema, pointer);
  if (node === undefined || typeof node !== 'object') {
    return <div className="se-inspector-empty">Select a node to inspect.</div>;
  }

  // ---- helpers -----------------------------------------------------------
  const setKw = (kw: string, value: unknown) =>
    dispatch(setAtPointer({ pointer: joinPointer(pointer, kw), value }));
  const delKw = (kw: string) => dispatch(removeAtPointer(joinPointer(pointer, kw)));
  const num = (v: string): number | undefined => (v === '' ? undefined : Number(v));

  const setNumKw = (kw: string, v: string) => {
    const n = num(v);
    if (n === undefined || Number.isNaN(n)) delKw(kw);
    else setKw(kw, n);
  };

  const isRef = typeof node.$ref === 'string';
  const type = Array.isArray(node.type) ? node.type[0] : node.type;
  const defs = listDefs(schema);

  // parent object pointer + key, for the `required` toggle
  const sp = splitParent(pointer);
  const parentIsProperties = sp?.parent.endsWith('/properties');
  const objectPointer = parentIsProperties
    ? sp!.parent.slice(0, -'/properties'.length)
    : null;
  const ownerObject = objectPointer != null ? getAtPointer<JsonSchema>(schema, objectPointer) : null;
  const isRequired = !!(sp && ownerObject?.required?.includes(sp.key));

  // ---- render ------------------------------------------------------------
  return (
    <div className="se-inspector">
      <div className="se-group">
        <div className="se-group-title">Node · {pointer || '(root)'}</div>

        {parentIsProperties && (
          <div className="se-row">
            <label>required</label>
            <input
              type="checkbox"
              className="se-checkbox"
              disabled={disabled}
              checked={isRequired}
              onChange={() =>
                dispatch(toggleRequired({ objectPointer: objectPointer!, key: sp!.key }))
              }
            />
          </div>
        )}

        <Field label="title">
          <input
            className="se-input"
            disabled={disabled}
            value={(node.title as string) ?? ''}
            onChange={(e) => (e.target.value ? setKw('title', e.target.value) : delKw('title'))}
          />
        </Field>
        <Field label="description">
          <input
            className="se-input"
            disabled={disabled}
            value={(node.description as string) ?? ''}
            onChange={(e) =>
              e.target.value ? setKw('description', e.target.value) : delKw('description')
            }
          />
        </Field>
      </div>

      {/* ---- $ref editing ---- */}
      {isRef ? (
        <div className="se-group">
          <div className="se-group-title">$ref</div>
          <Field label="target ($defs)">
            <select
              className="se-select"
              disabled={disabled}
              value={parseRef(node.$ref as string).defName ?? ''}
              onChange={(e) => setKw('$ref', defRef(e.target.value))}
            >
              <option value="" disabled>
                — choose —
              </option>
              {defs.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
              {/* allow external/raw refs to remain selectable */}
              {!parseRef(node.$ref as string).defName && (
                <option value="">{node.$ref as string}</option>
              )}
            </select>
          </Field>
          <Field label="raw $ref">
            <input
              className="se-input"
              disabled={disabled}
              value={node.$ref as string}
              onChange={(e) => setKw('$ref', e.target.value)}
            />
          </Field>
        </div>
      ) : (
        <>
          <div className="se-group">
            <div className="se-group-title">Type</div>
            <Field label="type">
              <select
                className="se-select"
                disabled={disabled}
                value={typeof type === 'string' ? type : ''}
                onChange={(e) => {
                  const v = e.target.value as JsonSchemaType;
                  if (!v) delKw('type');
                  else setKw('type', v);
                }}
              >
                <option value="">(type-less)</option>
                {SCALAR_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>

            {/* convert to $ref */}
            {defs.length > 0 && (
              <Field label="convert to $ref">
                <select
                  className="se-select"
                  disabled={disabled}
                  value=""
                  onChange={(e) => {
                    if (e.target.value) setKw('$ref', defRef(e.target.value));
                  }}
                >
                  <option value="">— keep inline —</option>
                  {defs.map((d) => (
                    <option key={d} value={d}>
                      → {d}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </div>

          {/* ---- object ---- */}
          {type === 'object' && (
            <div className="se-group">
              <div className="se-group-title">Object</div>
              <div className="se-row">
                <label>additionalProperties: false</label>
                <input
                  type="checkbox"
                  className="se-checkbox"
                  disabled={disabled}
                  checked={node.additionalProperties === false}
                  onChange={(e) =>
                    e.target.checked ? setKw('additionalProperties', false) : delKw('additionalProperties')
                  }
                />
              </div>
              {!node.properties && (
                <div className="se-readonly-note">open object (no properties) — left as-is</div>
              )}
            </div>
          )}

          {/* ---- string ---- */}
          {type === 'string' && (
            <div className="se-group">
              <div className="se-group-title">String</div>
              <Field label="format">
                <select
                  className="se-select"
                  disabled={disabled}
                  value={(node.format as string) ?? ''}
                  onChange={(e) => (e.target.value ? setKw('format', e.target.value) : delKw('format'))}
                >
                  {FORMATS.map((f) => (
                    <option key={f} value={f}>
                      {f || '(none)'}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="pattern">
                <input
                  className="se-input"
                  disabled={disabled}
                  value={(node.pattern as string) ?? ''}
                  onChange={(e) =>
                    e.target.value ? setKw('pattern', e.target.value) : delKw('pattern')
                  }
                />
              </Field>
              <div className="se-row">
                <NumField label="minLength" value={node.minLength} onChange={(v) => setNumKw('minLength', v)} disabled={disabled} />
                <NumField label="maxLength" value={node.maxLength} onChange={(v) => setNumKw('maxLength', v)} disabled={disabled} />
              </div>
              <EnumEditor node={node} onChange={(arr) => (arr.length ? setKw('enum', arr) : delKw('enum'))} disabled={disabled} />
            </div>
          )}

          {/* ---- number / integer ---- */}
          {(type === 'number' || type === 'integer') && (
            <div className="se-group">
              <div className="se-group-title">Number</div>
              <div className="se-row">
                <NumField label="minimum" value={node.minimum} onChange={(v) => setNumKw('minimum', v)} disabled={disabled} />
                <NumField label="maximum" value={node.maximum} onChange={(v) => setNumKw('maximum', v)} disabled={disabled} />
              </div>
            </div>
          )}

          {/* ---- array ---- */}
          {type === 'array' && (
            <div className="se-group">
              <div className="se-group-title">Array</div>
              <div className="se-row">
                <NumField label="minItems" value={node.minItems} onChange={(v) => setNumKw('minItems', v)} disabled={disabled} />
                <NumField label="maxItems" value={node.maxItems} onChange={(v) => setNumKw('maxItems', v)} disabled={disabled} />
              </div>
              <div className="se-row">
                <label>items</label>
                <button
                  className="se-btn"
                  disabled={disabled}
                  onClick={() => dispatch(selectNode(joinPointer(pointer, 'items')))}
                >
                  {node.items && typeof (node.items as JsonSchema).$ref === 'string'
                    ? (node.items as JsonSchema).$ref
                    : 'edit items →'}
                </button>
              </div>
              {!node.items && !disabled && (
                <button className="se-btn" onClick={() => setKw('items', { type: 'string' })}>
                  + add items schema
                </button>
              )}
            </div>
          )}

          {/* ---- type-less enum ---- */}
          {!type && Array.isArray(node.enum) && (
            <div className="se-group">
              <div className="se-group-title">Enum (type-less)</div>
              <EnumEditor node={node} onChange={(arr) => setKw('enum', arr)} disabled={disabled} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="se-field" style={{ flex: 1 }}>
      <label>{label}</label>
      {children}
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: unknown;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="se-field">
      <label>{label}</label>
      <input
        type="number"
        className="se-input se-input--narrow"
        disabled={disabled}
        value={typeof value === 'number' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function EnumEditor({
  node,
  onChange,
  disabled,
}: {
  node: JsonSchema;
  onChange: (values: unknown[]) => void;
  disabled?: boolean;
}) {
  const values = Array.isArray(node.enum) ? node.enum : [];
  return (
    <div className="se-field">
      <label>enum</label>
      <div className="se-tags">
        {values.map((v, i) => (
          <span className="se-tag" key={i}>
            {String(v)}
            {!disabled && (
              <button
                onClick={() => onChange(values.filter((_, j) => j !== i))}
                aria-label="remove"
              >
                ×
              </button>
            )}
          </span>
        ))}
        {!disabled && (
          <button
            className="se-btn"
            onClick={() => {
              const v = window.prompt('Add enum value:');
              if (v != null && v !== '') onChange([...values, v]);
            }}
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
