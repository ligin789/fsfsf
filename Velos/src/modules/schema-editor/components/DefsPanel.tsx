/**
 * `$defs` manager: lists each definition with its usage count, jump-to-usage,
 * jump-to-definition, rename (rewrites every `#/$defs/<old>` pointer) and
 * delete (blocked while referenced). Circular defs are badged.
 */
import { useDispatch } from 'react-redux';
import {
  removeAtPointer,
  renameDef,
  selectNode,
  setAtPointer,
} from '../store/actions';
import { joinPointer } from '../lib/pointer';
import {
  canDeleteDef,
  defUsageCounts,
  defUsages,
  detectCircularDefs,
  listDefs,
} from '../lib/refs';
import { useSchema } from './hooks';
import { useSchemaEditorContext } from '../context';

export default function DefsPanel() {
  const schema = useSchema();
  const dispatch = useDispatch();
  const { readOnly } = useSchemaEditorContext();
  if (!schema) return null;

  const defs = listDefs(schema);
  const counts = defUsageCounts(schema);
  const cyclic = detectCircularDefs(schema);

  const addDef = () => {
    const name = window.prompt('New $defs name:')?.trim();
    if (!name) return;
    if (defs.includes(name)) {
      window.alert(`"${name}" already exists.`);
      return;
    }
    if (!schema.$defs) dispatch(setAtPointer({ pointer: '/$defs', value: {} }));
    dispatch(setAtPointer({ pointer: joinPointer('/$defs', name), value: { type: 'object' } }));
    dispatch(selectNode(joinPointer('/$defs', name)));
  };

  const onRename = (name: string) => {
    const next = window.prompt(`Rename "${name}" to:`, name)?.trim();
    if (!next || next === name) return;
    if (defs.includes(next)) {
      window.alert(`"${next}" already exists.`);
      return;
    }
    dispatch(renameDef({ oldName: name, newName: next }));
  };

  const onDelete = (name: string) => {
    if (!canDeleteDef(schema, name)) {
      const used = defUsages(schema, name);
      window.alert(
        `Cannot delete "${name}" — referenced by ${used.length} location(s):\n` +
          used.map((u) => u.pointer).join('\n'),
      );
      return;
    }
    if (window.confirm(`Delete $defs/${name}?`)) {
      dispatch(removeAtPointer(joinPointer('/$defs', name)));
    }
  };

  const jumpToUsage = (name: string) => {
    const used = defUsages(schema, name);
    if (used.length > 0) dispatch(selectNode(used[0].pointer));
  };

  return (
    <div className="se-defs">
      <div className="se-row" style={{ marginBottom: 8 }}>
        <div className="se-group-title" style={{ flex: 1, border: 'none' }}>
          $defs ({defs.length})
        </div>
        {!readOnly && (
          <button className="se-btn" onClick={addDef}>
            + def
          </button>
        )}
      </div>

      {defs.length === 0 && <div className="se-inspector-empty">No definitions.</div>}

      {defs.map((name) => (
        <div className="se-def-row" key={name}>
          <span
            className="se-def-name"
            onClick={() => dispatch(selectNode(joinPointer('/$defs', name)))}
            style={{ cursor: 'pointer' }}
            title="Jump to definition"
          >
            {name}
          </span>
          {cyclic.has(name) && <span className="se-badge se-badge--cycle">↻</span>}
          <span
            className="se-def-usage"
            onClick={() => jumpToUsage(name)}
            title="Jump to first usage"
          >
            {counts[name]} use{counts[name] === 1 ? '' : 's'}
          </span>
          {!readOnly && (
            <>
              <button className="se-btn" onClick={() => onRename(name)}>
                rename
              </button>
              <button
                className="se-btn"
                onClick={() => onDelete(name)}
                disabled={!canDeleteDef(schema, name)}
                title={canDeleteDef(schema, name) ? 'Delete' : 'Referenced — cannot delete'}
              >
                del
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
