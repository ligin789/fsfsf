/**
 * Validation:
 *   1. the document is a valid JSON Schema (draft 2020-12 meta-schema, Ajv2020)
 *   2. the embedded `example` validates against the schema itself
 *
 * Ajv `instancePath`s are already JSON Pointers, so we map example errors to
 * `/example<instancePath>` and meta-schema errors to `<schemaPath>`.
 */
import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';
import type { JsonSchema, ValidationError } from '../types';

function makeAjv(): Ajv2020 {
  // strict:false so custom keywords (`domain`, `example`) and the Apicurio
  // `$id` coordinate string don't throw.
  const ajv = new Ajv2020({ strict: false, allErrors: true, validateFormats: true });
  addFormats(ajv);
  return ajv;
}

/** A schema stripped of keywords that would interfere with compilation. */
function compilableSchema(schema: JsonSchema): JsonSchema {
  // Remove the Apicurio coordinate `$id` (not a resolvable URI) and the custom
  // `domain` / `example` keywords so Ajv compiles the structural schema only.
  const { $id: _id, domain: _domain, example: _example, ...rest } = schema;
  return rest as JsonSchema;
}

/** Validate that the document is itself a valid JSON Schema. */
export function validateMetaSchema(schema: JsonSchema): ValidationError[] {
  const ajv = makeAjv();
  const errors: ValidationError[] = [];
  try {
    const valid = ajv.validateSchema(compilableSchema(schema), false);
    if (!valid && ajv.errors) {
      for (const e of ajv.errors) {
        errors.push({
          pointer: e.instancePath || '',
          message: `${e.instancePath || '(root)'} ${e.message ?? 'is invalid'}`,
          kind: 'meta-schema',
          keyword: e.keyword,
        });
      }
    }
  } catch (err) {
    errors.push({
      pointer: '',
      message: err instanceof Error ? err.message : 'Schema failed to compile',
      kind: 'meta-schema',
    });
  }
  return errors;
}

/** Validate the embedded `example` against the schema. */
export function validateExample(schema: JsonSchema): ValidationError[] {
  if (!('example' in schema) || schema.example === undefined) return [];
  const ajv = makeAjv();
  const errors: ValidationError[] = [];
  let validate;
  try {
    validate = ajv.compile(compilableSchema(schema));
  } catch (err) {
    return [
      {
        pointer: '',
        message: err instanceof Error ? err.message : 'Schema failed to compile',
        kind: 'meta-schema',
      },
    ];
  }
  const ok = validate(schema.example);
  if (!ok && validate.errors) {
    for (const e of validate.errors) {
      const offendingProperty =
        e.keyword === 'additionalProperties'
          ? (e.params as { additionalProperty?: string }).additionalProperty
          : undefined;
      const loc = `/example${e.instancePath}`;
      const where = e.instancePath || '(example root)';
      const detail = offendingProperty
        ? `property "${offendingProperty}" is not allowed`
        : e.message ?? 'is invalid';
      errors.push({
        pointer: offendingProperty ? `${loc}/${offendingProperty}` : loc,
        message: `${where} ${detail}`,
        kind: 'example',
        keyword: e.keyword,
        offendingProperty,
      });
    }
  }
  return errors;
}

/** Run both validation passes. */
export function validateAll(schema: JsonSchema | null): ValidationError[] {
  if (!schema) return [];
  return [...validateMetaSchema(schema), ...validateExample(schema)];
}
