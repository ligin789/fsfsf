/**
 * Public type surface for the schema-editor module.
 *
 * The editor operates on the *schema document* itself (JSON Schema draft
 * 2020-12), not on data that conforms to it. We deliberately keep `JsonSchema`
 * permissive (index signature) so that custom / unknown keywords carried by the
 * VELOS schema — `domain`, Apicurio `$id`, `example`, type-less `enum` nodes —
 * are preserved untouched on round-trip.
 */

/** A JSON Schema node. Permissive on purpose so unknown keywords survive. */
export interface JsonSchema {
  $schema?: string;
  $id?: string;
  $ref?: string;
  $defs?: Record<string, JsonSchema>;
  title?: string;
  description?: string;
  type?: JsonSchemaType | JsonSchemaType[];
  enum?: unknown[];
  const?: unknown;
  format?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  minItems?: number;
  maxItems?: number;
  required?: string[];
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  additionalProperties?: boolean | JsonSchema;
  example?: unknown;
  /** Custom VELOS block — must never be dropped. */
  domain?: DomainBlock;
  /** Anything else (unknown keywords) is preserved verbatim. */
  [key: string]: unknown;
}

export type JsonSchemaType =
  | 'object'
  | 'array'
  | 'string'
  | 'integer'
  | 'number'
  | 'boolean'
  | 'null';

export interface DomainBlock {
  industry?: string;
  function?: string;
  subfunction?: string;
  [key: string]: unknown;
}

/** RFC 6901 JSON Pointer. "" addresses the root document. */
export type JsonPointer = string;

/** A validation error mapped onto a JSON Pointer location in the document. */
export interface ValidationError {
  /** JSON Pointer into the schema document (e.g. "/example/Metadata/..."). */
  pointer: JsonPointer;
  message: string;
  /** Source of the error. */
  kind: 'meta-schema' | 'example';
  /** Ajv keyword that failed, when available (e.g. "additionalProperties"). */
  keyword?: string;
  /** The offending additional property name, for one-click removal. */
  offendingProperty?: string;
}

/** Apicurio-style coordinate parsed from `$id`. */
export interface ApicurioCoordinates {
  /** e.g. "schema" */
  scheme: string;
  /** e.g. "velos-registry" */
  registry: string;
  /** e.g. "aam.shopping.AAMShoppingRequest" */
  coordinate: string;
  /** e.g. "1.0.0" */
  version: string;
}

/**
 * Registry client used for external `$ref` resolution and Apicurio-aligned
 * dereferencing. Omit it from <SchemaEditor> to hide all external-ref features.
 */
export interface RegistryClient {
  getArtifact(groupId: string, artifactId: string, version?: string): Promise<JsonSchema>;
  getArtifactDereferenced(
    groupId: string,
    artifactId: string,
    version?: string,
  ): Promise<JsonSchema>;
}

/** Usage record for a `$defs` entry. */
export interface DefUsage {
  /** Pointer to the `{ "$ref": "#/$defs/<name>" }` node. */
  pointer: JsonPointer;
  /** The raw `$ref` string at that location. */
  ref: string;
}

/** Shape of the module's slice. */
export interface SchemaEditorState {
  schema: JsonSchema | null;
  selectedPointer: JsonPointer;
  dirty: boolean;
  undoStack: JsonSchema[];
  redoStack: JsonSchema[];
  validationErrors: ValidationError[];
  dereferencePreview: boolean;
  sourceError: string | null;
  loading: boolean;
}

/** Apicurio v3 create-artifact payload produced on export. */
export interface ApicurioArtifactPayload {
  artifactId: string;
  artifactType: 'JSON';
  firstVersion: {
    content: {
      content: string;
      contentType: 'application/json';
      references: ApicurioReference[];
    };
  };
}

export interface ApicurioReference {
  name: string;
  groupId: string;
  artifactId: string;
  version: string;
}
