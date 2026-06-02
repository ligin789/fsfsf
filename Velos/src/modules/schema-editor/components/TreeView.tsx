/**
 * Left pane: the schema tree. Renders the root object's properties / items and
 * an add-property control. `$defs` are managed in the DefsPanel, not here.
 */
import { useDispatch } from 'react-redux';
import { selectNode, setAtPointer, toggleRequired } from '../store/actions';
import { getAtPointer, joinPointer } from '../lib/pointer';
import TreeNode from './TreeNode';
import { useSchema, useSelectedPointer } from './hooks';
import { useSchemaEditorContext } from '../context';
import type { JsonSchema } from '../types';

export default function TreeView() {
  const schema = useSchema();
  const selected = useSelectedPointer();
  const dispatch = useDispatch();
  const { readOnly } = useSchemaEditorContext();

  if (!schema) {
    return <div className="se-inspector-empty">No schema loaded.</div>;
  }

  const required = new Set(schema.required ?? []);
  const props = schema.properties ?? {};

  const addProperty = () => {
    const name = window.prompt('New property name:')?.trim();
    if (!name) return;
    const basePtr = schema.properties ? '/properties' : '/properties';
    if (!schema.properties) {
      dispatch(setAtPointer({ pointer: '/properties', value: {} }));
    }
    dispatch(setAtPointer({ pointer: joinPointer(basePtr, name), value: { type: 'string' } }));
    dispatch(selectNode(joinPointer(basePtr, name)));
  };

  return (
    <div className="se-tree">
      <div
        className={`se-node-row${selected === '' ? ' se-node-row--selected' : ''}`}
        onClick={() => dispatch(selectNode(''))}
        title="(root)"
      >
        <span className="se-twisty" />
        <span className="se-node-key">{(schema.title as string) || 'root'}</span>
        <span className="se-node-type">{Array.isArray(schema.type) ? schema.type.join('|') : (schema.type ?? 'object')}</span>
      </div>

      <div className="se-node-children">
        {Object.keys(props).map((key) => {
          const ptr = joinPointer('/properties', key);
          const child = getAtPointer<JsonSchema>(schema, ptr);
          void child;
          return (
            <TreeNode
              key={ptr}
              pointer={ptr}
              label={key}
              required={required.has(key)}
              depth={1}
            />
          );
        })}
        {schema.items && (
          <TreeNode pointer="/items" label="items" depth={1} />
        )}
      </div>

      {!readOnly && (
        <div style={{ padding: '8px 10px' }}>
          <button className="se-btn" onClick={addProperty}>+ property</button>
          {selected.endsWith('/properties') === false && selected !== '' && (
            <button
              className="se-btn"
              style={{ marginLeft: 6 }}
              onClick={() => {
                // toggle required on the selected property within its parent object
                const parts = selected.split('/');
                const key = parts[parts.length - 1];
                const objPtr = parts.slice(0, -2).join('/'); // strip /properties/<key>
                if (parts[parts.length - 2] === 'properties') {
                  dispatch(toggleRequired({ objectPointer: objPtr, key }));
                }
              }}
            >
              toggle required
            </button>
          )}
        </div>
      )}
    </div>
  );
}
