/**
 * Small store-access hooks shared by the components. They use react-redux's
 * untyped useSelector/useDispatch (the module is store-agnostic) together with
 * the sliceKey-bound selectors from context.
 */
import { useSelector } from 'react-redux';
import { useSchemaEditorContext } from '../context';
import type { JsonSchema, SchemaEditorState } from '../types';

type Root = Record<string, unknown>;

export function useSchema(): JsonSchema | null {
  const { selectors } = useSchemaEditorContext();
  return useSelector((s: Root) => selectors.selectSchema(s));
}

export function useSelectedPointer(): string {
  const { selectors } = useSchemaEditorContext();
  return useSelector((s: Root) => selectors.selectSelectedPointer(s));
}

export function useEditorState<T>(pick: (st: SchemaEditorState) => T): T {
  const { selectors } = useSchemaEditorContext();
  return useSelector((s: Root) => pick(selectors.selectState(s)));
}
