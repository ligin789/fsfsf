/**
 * Top-level schema-editor shell.
 *
 * Reads/writes the module slice via react-redux hooks. The slice must be
 * mounted in the host store (default key `schemaEditor`) — see the README.
 * Layout: toolbar, metadata bar, then a tree + `$defs` pane, an inspector pane,
 * and a toggleable Monaco source pane, with a live validation panel at the
 * bottom. Everything is two-way synced because it all derives from the single
 * schema object in the slice.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SchemaEditorContext } from './context';
import { createSchemaEditorSelectors } from './store/selectors';
import {
  loadSchema,
  markSaved,
  redo,
  removeExampleKey,
  selectNode,
  setValidationErrors,
  undo,
} from './store/actions';
import { validateAll } from './lib/validate';
import Toolbar from './components/Toolbar';
import MetadataBar from './components/MetadataBar';
import TreeView from './components/TreeView';
import Inspector from './components/Inspector';
import DefsPanel from './components/DefsPanel';
import SourcePane from './components/SourcePane';
import type { JsonSchema, RegistryClient, ValidationError } from './types';
import './styles.css';

export interface SchemaEditorProps {
  /** Seed the slice on mount. */
  initialValue?: JsonSchema;
  onSave?: (schema: JsonSchema) => void | Promise<void>;
  /** Omit to hide external-$ref features. */
  registryClient?: RegistryClient;
  /** Slice mount key in the host store. Default "schemaEditor". */
  sliceKey?: string;
  readOnly?: boolean;
  theme?: 'dark' | 'light';
}

type Root = Record<string, unknown>;

export default function SchemaEditor({
  initialValue,
  onSave,
  registryClient,
  sliceKey = 'schemaEditor',
  readOnly = false,
  theme = 'dark',
}: SchemaEditorProps) {
  const dispatch = useDispatch();
  const selectors = useMemo(() => createSchemaEditorSelectors(sliceKey), [sliceKey]);

  const schema = useSelector((s: Root) => selectors.selectSchema(s));
  const errors = useSelector((s: Root) => selectors.selectValidationErrors(s));
  const [sourceVisible, setSourceVisible] = useState(true);
  const seededRef = useRef(false);

  // Seed once on mount (only if provided and slice is still empty).
  useEffect(() => {
    if (!seededRef.current && initialValue && !schema) {
      dispatch(loadSchema(initialValue));
      seededRef.current = true;
    }
  }, [initialValue, schema, dispatch]);

  // Debounced live (re)validation: meta-schema + example.
  useEffect(() => {
    if (!schema) return;
    const id = setTimeout(() => {
      dispatch(setValidationErrors(validateAll(schema)));
    }, 300);
    return () => clearTimeout(id);
  }, [schema, dispatch]);

  // Keyboard: undo / redo / save.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (!readOnly) dispatch(undo());
      } else if ((k === 'z' && e.shiftKey) || k === 'y') {
        e.preventDefault();
        if (!readOnly) dispatch(redo());
      } else if (k === 's') {
        e.preventDefault();
        if (schema && onSave && !readOnly) {
          Promise.resolve(onSave(schema)).then(() => dispatch(markSaved()));
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [schema, onSave, readOnly, dispatch]);

  const ctx = useMemo(
    () => ({
      sliceKey,
      selectors,
      registryClient,
      readOnly,
      onSave: onSave as ((s: unknown) => void | Promise<void>) | undefined,
      theme,
    }),
    [sliceKey, selectors, registryClient, readOnly, onSave, theme],
  );

  return (
    <SchemaEditorContext.Provider value={ctx}>
      <div className="schema-editor" data-theme={theme}>
        <Toolbar sourceVisible={sourceVisible} onToggleSource={() => setSourceVisible((v) => !v)} />
        <MetadataBar />
        <div className="se-main">
          <div className="se-pane se-pane--tree">
            <div className="se-pane-head">Schema tree</div>
            <div className="se-pane-body">
              <TreeView />
              <DefsPanel />
            </div>
          </div>
          <div className="se-pane se-pane--inspector">
            <div className="se-pane-head">Inspector</div>
            <div className="se-pane-body">
              <Inspector />
            </div>
          </div>
          {sourceVisible && <SourcePane />}
        </div>
        <ValidationPanel errors={errors} onRemoveExampleKey={(p) => dispatch(removeExampleKey(p))} onJump={(p) => dispatch(selectNode(p))} />
      </div>
    </SchemaEditorContext.Provider>
  );
}

function ValidationPanel({
  errors,
  onRemoveExampleKey,
  onJump,
}: {
  errors: ValidationError[];
  onRemoveExampleKey: (pointer: string) => void;
  onJump: (pointer: string) => void;
}) {
  if (errors.length === 0) {
    return (
      <div className="se-validation">
        <div className="se-val-row se-val-row--ok">
          <span className="se-val-msg">✓ valid — meta-schema OK, example conforms</span>
        </div>
      </div>
    );
  }
  return (
    <div className="se-validation">
      {errors.map((e, i) => (
        <div className="se-val-row" key={i}>
          <span className="se-badge se-badge--error">{e.kind}</span>
          <span className="se-val-msg se-error" onClick={() => onJump(e.pointer)} style={{ cursor: 'pointer' }}>
            {e.message}
          </span>
          {e.kind === 'example' && e.offendingProperty && (
            <button className="se-btn" onClick={() => onRemoveExampleKey(e.pointer)}>
              remove "{e.offendingProperty}" from example
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
