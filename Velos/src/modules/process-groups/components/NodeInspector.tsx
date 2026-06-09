/**
 * Right-hand inspector drawer.
 *
 * Shows the full detail of the selected node (node_id, process_key, imports[],
 * exports[]) or the selected edge (from, to, condition). Closes back to a hint
 * prompt when nothing is selected.
 */
import type { PGEdge, PGNode } from '../store/types';

interface NodeInspectorProps {
  node: PGNode | null;
  edge: PGEdge | null;
  onClose: () => void;
  width: number;
}

function ChipList({ values, kind }: { values: string[]; kind: 'in' | 'out' }) {
  if (values.length === 0) {
    return <span className="pg-inspector__empty">none</span>;
  }
  return (
    <div className="pg-inspector__chips">
      {values.map((v) => (
        <span key={v} className={`pg-chip pg-chip--${kind}`}>
          {v}
        </span>
      ))}
    </div>
  );
}

export default function NodeInspector({ node, edge, onClose, width }: NodeInspectorProps) {
  const sizeStyle = { width, flexBasis: width };

  if (!node && !edge) {
    return (
      <aside className="pg-inspector pg-inspector--empty" style={sizeStyle}>
        <p className="pg-inspector__hint">
          Select a node or edge in the canvas to inspect its detail.
        </p>
      </aside>
    );
  }

  return (
    <aside className="pg-inspector" style={sizeStyle}>
      <div className="pg-inspector__header">
        <span className="pg-inspector__kind">{node ? 'Node' : 'Edge'}</span>
        <button type="button" className="pg-inspector__close" onClick={onClose} aria-label="Close inspector">
          ×
        </button>
      </div>

      {node && (
        <div className="pg-inspector__body">
          <dl className="pg-kv">
            <dt>node_id</dt>
            <dd>
              <code className="pg-inline-code">{node.node_id}</code>
            </dd>
            <dt>process_key</dt>
            <dd>
              <code className="pg-inline-code">{node.process_key}</code>
            </dd>
          </dl>

          <div className="pg-inspector__group">
            <h3 className="pg-inspector__group-title">imports ↓</h3>
            <ChipList values={node.imports ?? []} kind="in" />
          </div>

          <div className="pg-inspector__group">
            <h3 className="pg-inspector__group-title">exports ↑</h3>
            <ChipList values={node.exports ?? []} kind="out" />
          </div>
        </div>
      )}

      {edge && (
        <div className="pg-inspector__body">
          <dl className="pg-kv">
            <dt>from</dt>
            <dd>
              <code className="pg-inline-code">{edge.from}</code>
            </dd>
            <dt>to</dt>
            <dd>
              <code className="pg-inline-code">{edge.to}</code>
            </dd>
            <dt>condition</dt>
            <dd>
              {edge.condition ? (
                <code className="pg-inline-code">{edge.condition}</code>
              ) : (
                <span className="pg-inspector__empty">unconditional</span>
              )}
            </dd>
          </dl>
        </div>
      )}
    </aside>
  );
}
