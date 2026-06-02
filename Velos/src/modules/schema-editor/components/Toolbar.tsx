/**
 * Top toolbar: undo / redo, dirty indicator, dereference-preview toggle,
 * source-pane toggle, import / export JSON, export Apicurio v3 payload, save.
 */
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  loadSchema,
  markSaved,
  redo,
  toggleDereferencePreview,
  undo,
} from '../store/actions';
import { buildArtifactPayload } from '../lib/apicurio';
import { useSchema, useEditorState } from './hooks';
import { useSchemaEditorContext } from '../context';
import type { JsonSchema } from '../types';

interface ToolbarProps {
  sourceVisible: boolean;
  onToggleSource: () => void;
}

function download(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Toolbar({ sourceVisible, onToggleSource }: ToolbarProps) {
  const schema = useSchema();
  const dirty = useEditorState((s) => s.dirty);
  const preview = useEditorState((s) => s.dereferencePreview);
  const canUndo = useEditorState((s) => s.undoStack.length > 0);
  const canRedo = useEditorState((s) => s.redoStack.length > 0);
  const loading = useEditorState((s) => s.loading);
  const dispatch = useDispatch();
  const { readOnly, onSave } = useSchemaEditorContext();
  const fileRef = useRef<HTMLInputElement>(null);

  const doImport = (file: File) => {
    if (dirty && !window.confirm('Discard unsaved changes and import?')) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        dispatch(loadSchema(JSON.parse(String(reader.result)) as JsonSchema));
      } catch (e) {
        window.alert('Import failed: ' + (e instanceof Error ? e.message : 'invalid JSON'));
      }
    };
    reader.readAsText(file);
  };

  const exportJson = () => {
    if (!schema) return;
    download('schema.json', JSON.stringify(schema, null, 2));
  };

  const exportApicurio = () => {
    if (!schema) return;
    download('artifact.apicurio.json', JSON.stringify(buildArtifactPayload(schema), null, 2));
  };

  const save = async () => {
    if (!schema || !onSave) return;
    await onSave(schema);
    dispatch(markSaved());
  };

  return (
    <div className="se-toolbar">
      <button className="se-btn" disabled={!canUndo || readOnly} onClick={() => dispatch(undo())} title="Undo (Cmd/Ctrl+Z)">
        ↶ undo
      </button>
      <button className="se-btn" disabled={!canRedo || readOnly} onClick={() => dispatch(redo())} title="Redo (Shift+Cmd/Ctrl+Z)">
        ↷ redo
      </button>

      <span className="se-spacer" />

      {loading && <span className="se-node-type">working…</span>}
      {dirty && (
        <span title="Unsaved changes">
          <span className="se-dirty-dot" /> unsaved
        </span>
      )}

      <button
        className={`se-btn${preview ? ' se-btn--active' : ''}`}
        onClick={() => dispatch(toggleDereferencePreview(undefined))}
        title="Inline all $refs (Apicurio references=DEREFERENCE)"
      >
        dereference
      </button>
      <button className={`se-btn${sourceVisible ? ' se-btn--active' : ''}`} onClick={onToggleSource}>
        source
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) doImport(f);
          e.target.value = '';
        }}
      />
      {!readOnly && (
        <button className="se-btn" onClick={() => fileRef.current?.click()}>
          import
        </button>
      )}
      <button className="se-btn" onClick={exportJson}>
        export
      </button>
      <button className="se-btn" onClick={exportApicurio} title="Apicurio v3 create-artifact payload">
        export apicurio
      </button>
      {onSave && !readOnly && (
        <button className="se-btn se-btn--primary" onClick={save} title="Save (Cmd/Ctrl+S)">
          save
        </button>
      )}
    </div>
  );
}
