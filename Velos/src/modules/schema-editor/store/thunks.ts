/**
 * Async thunks.
 *
 * The `RegistryClient` is passed as an explicit argument (e.g.
 * `dispatch(loadFromRegistry(client, coords))`) so the host does NOT need to
 * configure `thunk.withExtraArgument`. (See the README for the optional
 * `withExtraArgument` alternative.)
 *
 * These are plain redux-thunk functions — they work under RTK's default
 * middleware, which includes redux-thunk.
 */
import type { ApicurioCoordinates, JsonSchema, RegistryClient } from '../types';
import { loadSchema, setLoading } from './actions';
import { dereference } from '../lib/dereference';

/** Minimal dispatch type so the module stays store-agnostic. */
type Dispatch = (action: unknown) => unknown;

/** Load a raw artifact from the registry and seed the editor with it. */
export function loadFromRegistry(
  client: RegistryClient,
  coords: Pick<ApicurioCoordinates, 'registry' | 'coordinate' | 'version'>,
) {
  return async (dispatch: Dispatch): Promise<JsonSchema> => {
    dispatch(setLoading(true));
    try {
      const doc = await client.getArtifact(
        coords.registry,
        coords.coordinate,
        coords.version || undefined,
      );
      dispatch(loadSchema(doc));
      return doc;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

/** Load a fully-dereferenced artifact from the registry and seed the editor. */
export function loadDereferencedFromRegistry(
  client: RegistryClient,
  coords: Pick<ApicurioCoordinates, 'registry' | 'coordinate' | 'version'>,
) {
  return async (dispatch: Dispatch): Promise<JsonSchema> => {
    dispatch(setLoading(true));
    try {
      const doc = await client.getArtifactDereferenced(
        coords.registry,
        coords.coordinate,
        coords.version || undefined,
      );
      dispatch(loadSchema(doc));
      return doc;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

/**
 * Build a dereferenced *preview* of the supplied document. Internal refs are
 * resolved locally; external refs are fetched via the client when provided.
 * The result is returned (not stored) so the raw ref'd document stays the
 * editable source of truth.
 */
export function buildDereferencePreview(schema: JsonSchema, client?: RegistryClient) {
  return async (dispatch: Dispatch): Promise<JsonSchema> => {
    dispatch(setLoading(true));
    try {
      return await dereference(schema, client);
    } finally {
      dispatch(setLoading(false));
    }
  };
}
