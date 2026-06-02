/**
 * Monaco JSON source pane, two-way synced with the tree.
 *
 * - Invalid JSON shows an error and does NOT corrupt tree state; the tree keeps
 *   the last good document until the text parses again.
 * - When dereference-preview is on, the pane is read-only and shows the inlined
 *   (`references=DEREFERENCE`) document; the raw ref'd doc stays the source of
 *   truth.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Editor from '@monaco-editor/react';
import { setFromSource, setSourceError } from '../store/actions';
import { buildDereferencePreview } from '../store/thunks';
import { dereferenceLocal } from '../lib/dereference';
import { useSchema, useEditorState } from './hooks';
import { useSchemaEditorContext } from '../context';
import type { JsonSchema } from '../types';

export default function SourcePane() {
  const schema = useSchema();
  const sourceError = useEditorState((s) => s.sourceError);
  const preview = useEditorState((s) => s.dereferencePreview);
  const dispatch = useDispatch();
  const { readOnly, registryClient, theme } = useSchemaEditorContext();

  const serialized = useMemo(() => (schema ? JSON.stringify(schema, null, 2) : ''), [schema]);
  const [text, setText] = useState(serialized);
  const [previewDoc, setPreviewDoc] = useState<JsonSchema | null>(null);
  const dirtyRef = useRef(false);

  // Keep the editor in sync with the store unless the user is mid-edit with an
  // unparseable buffer.
  useEffect(() => {
    if (!dirtyRef.current) setText(serialized);
  }, [serialized]);

  // Build the dereferenced preview (async to cover external refs via client).
  useEffect(() => {
    let cancelled = false;
    if (preview && schema) {
      // optimistic local inline first, then full async resolution
      setPreviewDoc(dereferenceLocal(schema));
      (dispatch as never as (a: unknown) => Promise<JsonSchema>)(
        buildDereferencePreview(schema, registryClient),
      ).then((doc) => {
        if (!cancelled) setPreviewDoc(doc);
      });
    } else {
      setPreviewDoc(null);
    }
    return () => {
      cancelled = true;
    };
  }, [preview, schema, registryClient, dispatch]);

  const handleChange = (value?: string) => {
    const next = value ?? '';
    setText(next);
    dirtyRef.current = true;
    try {
      const parsed = JSON.parse(next) as JsonSchema;
      dispatch(setSourceError(null));
      dispatch(setFromSource(parsed));
      dirtyRef.current = false;
    } catch (err) {
      dispatch(setSourceError(err instanceof Error ? err.message : 'Invalid JSON'));
      // leave tree state intact
    }
  };

  const isReadOnly = readOnly || preview;
  const displayValue = preview
    ? JSON.stringify(previewDoc ?? {}, null, 2)
    : text;

  return (
    <div className="se-pane se-pane--source">
      <div className="se-pane-head">
        Source {preview ? '· dereferenced (read-only)' : '· JSON'}
      </div>
      {sourceError && <div className="se-source-error">⚠ {sourceError}</div>}
      <div className="se-pane-body" style={{ padding: 0 }}>
        <Editor
          language="json"
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          value={displayValue}
          onChange={isReadOnly ? undefined : handleChange}
          options={{
            readOnly: isReadOnly,
            minimap: { enabled: false },
            fontSize: 12,
            scrollBeyondLastLine: false,
            tabSize: 2,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
