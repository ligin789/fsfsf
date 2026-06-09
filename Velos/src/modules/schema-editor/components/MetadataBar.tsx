/**
 * Top metadata bar: `$schema`, `$id` (structured Apicurio coordinate editor
 * that writes back the raw string), `title`, and the custom `domain` block
 * ({industry, function, subfunction}). `domain` is never dropped.
 */
import { useDispatch } from 'react-redux';
import { setAtPointer, removeAtPointer } from '../store/actions';
import { buildApicurioId, parseApicurioId } from '../lib/apicurio';
import { useSchema } from './hooks';
import { useSchemaEditorContext } from '../context';
import type { DomainBlock } from '../types';

export default function MetadataBar() {
  const schema = useSchema();
  const dispatch = useDispatch();
  const { readOnly } = useSchemaEditorContext();
  if (!schema) return null;

  const coords = parseApicurioId(schema.$id);
  const setId = (patch: Partial<typeof coords>) =>
    dispatch(setAtPointer({ pointer: '/$id', value: buildApicurioId({ ...coords, ...patch }) }));

  const domain: DomainBlock = (schema.domain as DomainBlock) ?? {};
  const setDomain = (key: keyof DomainBlock, value: string) => {
    const next = { ...domain, [key]: value };
    if (value === '') delete next[key];
    dispatch(setAtPointer({ pointer: '/domain', value: next }));
  };

  const set = (kw: string, value: string) =>
    value
      ? dispatch(setAtPointer({ pointer: `/${kw}`, value }))
      : dispatch(removeAtPointer(`/${kw}`));

  const ro = readOnly;

  return (
    <div className="se-metabar">
      <div className="se-field">
        <label>$schema</label>
        <input
          className="se-input"
          disabled={ro}
          style={{ width: 230 }}
          value={(schema.$schema as string) ?? ''}
          onChange={(e) => set('$schema', e.target.value)}
        />
      </div>
      <div className="se-field">
        <label>title</label>
        <input
          className="se-input"
          disabled={ro}
          value={(schema.title as string) ?? ''}
          onChange={(e) => set('title', e.target.value)}
        />
      </div>

      {/* structured $id editor */}
      <div className="se-field">
        <label>$id · scheme</label>
        <input className="se-input se-input--narrow" disabled={ro} value={coords.scheme} onChange={(e) => setId({ scheme: e.target.value })} />
      </div>
      <div className="se-field">
        <label>registry</label>
        <input className="se-input" disabled={ro} value={coords.registry} onChange={(e) => setId({ registry: e.target.value })} />
      </div>
      <div className="se-field">
        <label>coordinate</label>
        <input className="se-input" disabled={ro} style={{ width: 220 }} value={coords.coordinate} onChange={(e) => setId({ coordinate: e.target.value })} />
      </div>
      <div className="se-field">
        <label>version</label>
        <input className="se-input se-input--narrow" disabled={ro} value={coords.version} onChange={(e) => setId({ version: e.target.value })} />
      </div>

      {/* domain block */}
      <div className="se-field">
        <label>domain · industry</label>
        <input className="se-input" disabled={ro} value={domain.industry ?? ''} onChange={(e) => setDomain('industry', e.target.value)} />
      </div>
      <div className="se-field">
        <label>function</label>
        <input className="se-input" disabled={ro} value={domain.function ?? ''} onChange={(e) => setDomain('function', e.target.value)} />
      </div>
      <div className="se-field">
        <label>subfunction</label>
        <input className="se-input" disabled={ro} value={domain.subfunction ?? ''} onChange={(e) => setDomain('subfunction', e.target.value)} />
      </div>
    </div>
  );
}
