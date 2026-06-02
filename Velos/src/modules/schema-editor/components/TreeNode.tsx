/**
 * One row in the schema tree, recursive.
 *
 * The tree is derived directly from the schema object addressed by JSON
 * Pointer — there is no parallel model. `$ref` nodes render as a labelled link
 * and expand on demand; a ref whose target is already an ancestor is marked as
 * a cycle and never expanded (so the renderer can't infinite-loop).
 */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { selectNode } from '../store/actions';
import { getAtPointer, joinPointer } from '../lib/pointer';
import { parseRef } from '../lib/refs';
import { hasChildren, nodeKind, nodeTypeLabel } from './nodeInfo';
import { useSchema, useSelectedPointer } from './hooks';
import type { JsonSchema } from '../types';

interface TreeNodeProps {
  pointer: string;
  label: string;
  required?: boolean;
  hasError?: boolean;
  /** Ref target pointers already open in the ancestor chain (cycle guard). */
  ancestors?: string[];
  depth?: number;
}

export default function TreeNode({
  pointer,
  label,
  required,
  hasError,
  ancestors = [],
  depth = 0,
}: TreeNodeProps) {
  const schema = useSchema();
  const selected = useSelectedPointer();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(depth < 1);

  if (!schema) return null;
  const node = getAtPointer<JsonSchema>(schema, pointer);
  if (node === undefined) return null;

  const kind = nodeKind(node);
  const expandable = hasChildren(node);

  // Resolve a $ref so we can show its children when expanded.
  let refTargetPointer: string | undefined;
  let isCycle = false;
  if (kind === 'ref' && typeof node.$ref === 'string') {
    const parsed = parseRef(node.$ref);
    if (!parsed.external && parsed.pointer != null) {
      refTargetPointer = parsed.pointer;
      isCycle = ancestors.includes(parsed.pointer);
    }
  }

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((o) => !o);
  };

  const renderChildren = () => {
    // For a (non-cyclic) ref, render the *target's* children under this row.
    const effectivePointer = refTargetPointer ?? pointer;
    const target =
      refTargetPointer != null ? getAtPointer<JsonSchema>(schema, refTargetPointer) : node;
    if (!target) return null;
    const nextAncestors = refTargetPointer ? [...ancestors, refTargetPointer] : ancestors;
    const out: React.ReactNode[] = [];

    if (target.properties) {
      const req = new Set(target.required ?? []);
      for (const key of Object.keys(target.properties)) {
        const childPtr = joinPointer(joinPointer(effectivePointer, 'properties'), key);
        out.push(
          <TreeNode
            key={childPtr}
            pointer={childPtr}
            label={key}
            required={req.has(key)}
            ancestors={nextAncestors}
            depth={depth + 1}
          />,
        );
      }
    }
    if (target.items) {
      const childPtr = joinPointer(effectivePointer, 'items');
      out.push(
        <TreeNode
          key={childPtr}
          pointer={childPtr}
          label="items"
          ancestors={nextAncestors}
          depth={depth + 1}
        />,
      );
    }
    return out;
  };

  const showChildren = open && expandable && !isCycle;

  return (
    <div className="se-tree-node">
      <div
        className={`se-node-row${selected === pointer ? ' se-node-row--selected' : ''}`}
        onClick={() => dispatch(selectNode(pointer))}
        title={pointer || '(root)'}
      >
        <span className="se-twisty" onClick={expandable ? toggle : undefined}>
          {expandable ? (showChildren ? '▾' : '▸') : ''}
        </span>
        <span className="se-node-key">{label}</span>
        <span className={kind === 'ref' ? 'se-node-ref' : 'se-node-type'}>
          {nodeTypeLabel(node)}
        </span>
        {required && <span className="se-badge se-badge--required">req</span>}
        {isCycle && <span className="se-badge se-badge--cycle">↻ cycle</span>}
        {hasError && <span className="se-badge se-badge--error">!</span>}
      </div>
      {showChildren && <div className="se-node-children">{renderChildren()}</div>}
    </div>
  );
}
