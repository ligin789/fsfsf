/**
 * Internal context so every child component can reach the (sliceKey-bound)
 * selectors, the optional registry client, and editor-wide flags without
 * prop-drilling. Actions don't need the key (their type is fixed), so only
 * selectors are key-dependent.
 */
import { createContext, useContext } from 'react';
import type { RegistryClient } from './types';
import type { SchemaEditorSelectors } from './store/selectors';

export interface SchemaEditorContextValue {
  sliceKey: string;
  selectors: SchemaEditorSelectors;
  registryClient?: RegistryClient;
  readOnly: boolean;
  onSave?: (schema: unknown) => void | Promise<void>;
  theme: 'dark' | 'light';
}

export const SchemaEditorContext = createContext<SchemaEditorContextValue | null>(null);

export function useSchemaEditorContext(): SchemaEditorContextValue {
  const ctx = useContext(SchemaEditorContext);
  if (!ctx) {
    throw new Error('schema-editor components must be rendered inside <SchemaEditor>');
  }
  return ctx;
}
