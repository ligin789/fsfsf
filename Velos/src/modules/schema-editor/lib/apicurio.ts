/**
 * Apicurio helpers: parse / build the `$id` coordinate, and build the v3
 * create-artifact payload produced on export.
 *
 * `$id` form: `schema://<registry>/<coordinate>:<version>`
 *   e.g. `schema://velos-registry/aam.shopping.AAMShoppingRequest:1.0.0`
 */
import type {
  ApicurioArtifactPayload,
  ApicurioCoordinates,
  ApicurioReference,
  JsonSchema,
} from '../types';
import { parseRef, walkRefs } from './refs';

const DEFAULTS: ApicurioCoordinates = {
  scheme: 'schema',
  registry: '',
  coordinate: '',
  version: '',
};

/** Parse an Apicurio `$id` string into structured coordinates. */
export function parseApicurioId(id: string | undefined): ApicurioCoordinates {
  if (!id) return { ...DEFAULTS };
  const out: ApicurioCoordinates = { ...DEFAULTS };
  let rest = id;
  const schemeIdx = rest.indexOf('://');
  if (schemeIdx >= 0) {
    out.scheme = rest.slice(0, schemeIdx);
    rest = rest.slice(schemeIdx + 3);
  }
  const colon = rest.lastIndexOf(':');
  if (colon >= 0) {
    out.version = rest.slice(colon + 1);
    rest = rest.slice(0, colon);
  }
  const slash = rest.indexOf('/');
  if (slash >= 0) {
    out.registry = rest.slice(0, slash);
    out.coordinate = rest.slice(slash + 1);
  } else {
    out.coordinate = rest;
  }
  return out;
}

/** Build the raw `$id` string from coordinates. */
export function buildApicurioId(c: ApicurioCoordinates): string {
  const scheme = c.scheme || 'schema';
  const host = c.registry ? `${c.registry}` : '';
  const path = c.coordinate || '';
  const base = host ? `${scheme}://${host}/${path}` : `${scheme}://${path}`;
  return c.version ? `${base}:${c.version}` : base;
}

/**
 * Collect external `$ref`s as Apicurio references. Internal `#/...` refs are
 * self-contained and produce no entries.
 */
export function collectExternalReferences(schema: JsonSchema): ApicurioReference[] {
  const seen = new Set<string>();
  const refs: ApicurioReference[] = [];
  walkRefs(schema, (_pointer, ref) => {
    const parsed = parseRef(ref);
    if (!parsed.external || seen.has(ref)) return;
    seen.add(ref);
    // Best-effort coordinate parse: <groupId>/<artifactId>:<version>
    const coords = parseApicurioId(ref);
    refs.push({
      name: ref,
      groupId: coords.registry || 'default',
      artifactId: coords.coordinate || ref,
      version: coords.version || '',
    });
  });
  return refs;
}

/**
 * Build the Apicurio v3 create-artifact payload:
 * { artifactId, artifactType:"JSON",
 *   firstVersion:{ content:{ content:<stringified>, contentType, references[] } } }
 *
 * `references[]` is empty for a self-contained schema and populated from
 * external `$ref`s otherwise.
 */
export function buildArtifactPayload(
  schema: JsonSchema,
  options?: { artifactId?: string },
): ApicurioArtifactPayload {
  const coords = parseApicurioId(schema.$id);
  const artifactId =
    options?.artifactId || coords.coordinate || (schema.title as string) || 'artifact';
  return {
    artifactId,
    artifactType: 'JSON',
    firstVersion: {
      content: {
        content: JSON.stringify(schema, null, 2),
        contentType: 'application/json',
        references: collectExternalReferences(schema),
      },
    },
  };
}
