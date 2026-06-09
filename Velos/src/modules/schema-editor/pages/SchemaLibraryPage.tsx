/**
 * Route page for Velos Platform Manager › Designer › Schema Library.
 *
 * Thin wrapper that mounts <SchemaEditor> full-height inside the dashboard
 * layout and seeds it with the canonical AAMShoppingRequest fixture.
 */
import { useEffect } from 'react';
import SchemaEditor from '../SchemaEditor';
import fixture from '../fixtures/aam-shopping-request.schema.json';
import type { JsonSchema } from '../types';
import { useTheme } from '../../../contexts/ThemeContext';

export default function SchemaLibraryPage() {
  const { theme } = useTheme();

  // Full-bleed: strip the dashboard's .main-content gutter while mounted, so
  // the editor sits flush against the content area (mirrors the Gantt page).
  useEffect(() => {
    document.body.classList.add('schema-editor-fullbleed');
    return () => document.body.classList.remove('schema-editor-fullbleed');
  }, []);

  const handleSave = (schema: JsonSchema) => {
    // Wire this to your registry/API when available.
    console.info('[schema-library] save', schema.$id);
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <SchemaEditor
        initialValue={fixture as unknown as JsonSchema}
        onSave={handleSave}
        theme={theme}
      />
    </div>
  );
}
