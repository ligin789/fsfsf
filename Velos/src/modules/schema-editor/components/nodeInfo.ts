/** Display helpers describing a schema node for the tree. */
import type { JsonSchema } from '../types';

export type NodeKind = 'ref' | 'object' | 'array' | 'enum' | 'scalar' | 'unknown';

export function nodeKind(node: JsonSchema | undefined): NodeKind {
  if (!node || typeof node !== 'object') return 'unknown';
  if (typeof node.$ref === 'string') return 'ref';
  if (node.type === 'object' || node.properties) return 'object';
  if (node.type === 'array' || node.items) return 'array';
  // type-less enum node, e.g. { "enum": ["EVTOL"] } or { "items": { "enum": [...] } }
  if (Array.isArray(node.enum)) return 'enum';
  if (typeof node.type === 'string') return 'scalar';
  return 'unknown';
}

/** Short label shown next to the key in the tree. */
export function nodeTypeLabel(node: JsonSchema | undefined): string {
  if (!node) return '';
  if (typeof node.$ref === 'string') return node.$ref;
  if (Array.isArray(node.type)) return node.type.join(' | ');
  if (typeof node.type === 'string') {
    if (node.type === 'object' && !node.properties) return 'object (open)';
    return node.type;
  }
  if (Array.isArray(node.enum)) return `enum(${node.enum.length})`;
  if (node.properties) return 'object';
  if (node.items) return 'array';
  return '—';
}

/** Whether the node can be expanded to reveal children. */
export function hasChildren(node: JsonSchema | undefined): boolean {
  if (!node) return false;
  if (typeof node.$ref === 'string') return true; // expand-on-demand
  if (node.properties && Object.keys(node.properties).length > 0) return true;
  if (node.items) return true;
  return false;
}
