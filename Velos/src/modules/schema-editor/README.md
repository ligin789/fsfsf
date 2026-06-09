# schema-editor

A self-contained **JSON Schema document editor** for Vite + React + Redux
(redux-thunk / Redux Toolkit) apps. It edits the *schema itself* — JSON Schema
draft **2020-12** with `$defs` + internal `$ref`, Apicurio-style `$id`
coordinates, and a custom `domain` block — **not** data that conforms to it.
Any keyword the editor doesn't understand (`domain`, `$id`, `example`,
type-less `enum` nodes, `format`, every `additionalProperties:false`) is
preserved untouched on round-trip, because every edit is a targeted JSON-Pointer
mutation of one parsed object that the tree, inspector, and source pane all
derive from.

The module owns everything under `src/modules/schema-editor/`, including its own
Redux slice. **Store and route wiring are left to you** (snippets below); the
module never edits your root store, `combineReducers`, or router.

---

## 1. Required packages

The host app already provides these as peer deps (don't reinstall):
`react`, `react-dom`, `react-redux`, `redux` / `@reduxjs/toolkit`.
`immer` is used for immutable edits — it ships **inside `@reduxjs/toolkit`**, so
no separate install is needed when you're on RTK.

Install the module's own runtime deps:

```bash
npm i ajv ajv-formats @monaco-editor/react
```

| Package | Why |
|---|---|
| `ajv` (2020-12 build) | meta-schema validity + `example` validation (`import Ajv2020 from "ajv/dist/2020"`) |
| `ajv-formats` | `ipv4`, `date-time`, `date`, … format checks |
| `@monaco-editor/react` | the JSON source pane |

> **Optional:** if you'd rather not ship Monaco, swap `components/SourcePane.tsx`'s
> `<Editor/>` for a `<textarea className="se-source-fallback">` — the two-way
> sync logic is editor-agnostic.

All of the above (and the peer deps) are **MIT-licensed**.

## 2. Install

Copy the whole `src/modules/schema-editor/` folder into your project's
`src/modules/`. That's it — no build-config changes.

## 3. Redux linking (you do this)

The module exports its reducer as `schemaEditorReducer`. Mount it under a key
(default `schemaEditor`) in **your** store.

**Redux Toolkit (`configureStore`):**
```ts
import { schemaEditorReducer } from './modules/schema-editor';

export const store = configureStore({
  reducer: {
    // …your existing reducers
    schemaEditor: schemaEditorReducer,
  },
});
```

**Classic redux (`combineReducers`):**
```ts
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { schemaEditorReducer } from './modules/schema-editor';

const rootReducer = combineReducers({
  // …your existing reducers
  schemaEditor: schemaEditorReducer,
});
const store = createStore(rootReducer, applyMiddleware(thunk));
```

**Changing the slice key.** If you mount it somewhere other than `schemaEditor`
(e.g. `editors.schema`), pass the same key to the component and build matching
selectors:
```ts
import { createSchemaEditorSelectors } from './modules/schema-editor';
const selectors = createSchemaEditorSelectors('editors.schema'); // top-level key
<SchemaEditor sliceKey="editors.schema" />
```
> The default selectors assume a top-level `schemaEditor` key. For nested mounts,
> mount the reducer at a top-level key — `sliceKey` is a single root key, not a
> deep path.

## 4. Route linking (you do this)

**react-router v6/v7:**
```tsx
import { SchemaEditor } from './modules/schema-editor';
import fixture from './modules/schema-editor/fixtures/aam-shopping-request.schema.json';

<Route
  path="/schema-editor"
  element={<SchemaEditor initialValue={fixture} registryClient={myRegistryClient} />}
/>
```

**Plain (no router):**
```tsx
function SchemaEditorScreen() {
  return <div style={{ height: '100vh' }}><SchemaEditor initialValue={fixture} /></div>;
}
```

## 5. Usage example (minimal, end-to-end)

```tsx
import { SchemaEditor } from './modules/schema-editor';
import fixture from './modules/schema-editor/fixtures/aam-shopping-request.schema.json';
import type { JsonSchema, RegistryClient } from './modules/schema-editor';

const registryClient: RegistryClient = {
  getArtifact: (groupId, artifactId, version) =>
    fetch(`/apis/registry/v3/groups/${groupId}/artifacts/${artifactId}/versions/${version ?? 'latest'}/content`)
      .then((r) => r.json()),
  getArtifactDereferenced: (groupId, artifactId, version) =>
    fetch(`/apis/registry/v3/groups/${groupId}/artifacts/${artifactId}/versions/${version ?? 'latest'}/content?references=DEREFERENCE`)
      .then((r) => r.json()),
};

export default function Demo() {
  const handleSave = async (schema: JsonSchema) => {
    await fetch('/api/schemas', { method: 'POST', body: JSON.stringify(schema) });
  };
  return (
    <SchemaEditor
      initialValue={fixture as JsonSchema}
      onSave={handleSave}
      registryClient={registryClient}   // omit to hide external-$ref features
      theme="dark"
    />
  );
}
```

## 6. Public API

### `<SchemaEditor>` props
| Prop | Type | Default | Notes |
|---|---|---|---|
| `initialValue` | `JsonSchema` | – | seeds the slice on mount (once, if slice is empty) |
| `onSave` | `(schema) => void \| Promise<void>` | – | called by the **save** button and **Cmd/Ctrl+S** |
| `registryClient` | `RegistryClient` | – | omit → external-`$ref` features hidden |
| `sliceKey` | `string` | `"schemaEditor"` | host store mount key |
| `readOnly` | `boolean` | `false` | disables all edits |
| `theme` | `"dark" \| "light"` | `"dark"` | CSS-variable themed; fully overridable |

### Exports (`index.ts`)
| Export | Kind | Purpose |
|---|---|---|
| `SchemaEditor` | component | the editor |
| `schemaEditorReducer` | reducer (default of `store/reducer`) | mount in your store |
| `schemaEditorActions` | namespace | sync action creators (`loadSchema`, `setAtPointer`, `renameDef`, `toggleRequired`, `undo`, …) |
| `schemaEditorThunks` | namespace | `loadFromRegistry`, `loadDereferencedFromRegistry`, `buildDereferencePreview` |
| `selectors` | object | selectors for the default `schemaEditor` key |
| `createSchemaEditorSelectors(sliceKey)` | factory | selectors for a custom key |
| `SchemaEditorActionTypes`, `SLICE_NAME` | constants | `@schema-editor/…` action type strings |
| `JsonSchema`, `RegistryClient`, `ValidationError`, … | types | from `types.ts` |

### Thunks take the client explicitly
Thunks receive the `RegistryClient` as an argument so you **don't** need
`thunk.withExtraArgument`:
```ts
dispatch(schemaEditorThunks.loadFromRegistry(client, { registry, coordinate, version }));
```
*Optional alternative:* if you prefer `withExtraArgument(client)`, you can write
thin wrappers that read the client from the thunk's third arg and delegate to
these — the module doesn't require it.

### `RegistryClient` interface
```ts
interface RegistryClient {
  getArtifact(groupId: string, artifactId: string, version?: string): Promise<JsonSchema>;
  getArtifactDereferenced(groupId: string, artifactId: string, version?: string): Promise<JsonSchema>;
}
```

## 7. Apicurio alignment

- **Dereference preview** mirrors Apicurio v3 `references=DEREFERENCE`. Toggling
  it inlines every `$ref` (read-only view; the raw ref'd doc stays the editable
  source of truth). Internal `#/$defs/...` refs — whole-schema, definition-level
  (`#/$defs/X`) and property-level (`#/$defs/X/properties/y`) — are resolved
  locally; external refs are fetched via `registryClient.getArtifactDereferenced`.
  Circular refs are left as labelled links and never infinite-loop the renderer.
- **Export → Apicurio v3 create-artifact payload:**
  ```jsonc
  {
    "artifactId": "<from $id coordinate or title>",
    "artifactType": "JSON",
    "firstVersion": {
      "content": {
        "content": "<stringified schema>",
        "contentType": "application/json",
        "references": []   // empty when self-contained; populated from external $refs
      }
    }
  }
  ```
- `$id` is edited as the structured Apicurio coordinate
  `schema://<registry>/<coordinate>:<version>` and written back as the raw string.

## 8. Known limitation

The bundled fixture
(`fixtures/aam-shopping-request.schema.json`) ships an **intentionally invalid
`example`**: `Metadata.Other.OtherMetadata.BookingDestinationLocation` violates
`OtherMetadata`'s `additionalProperties: false`. The validation panel reports it
and offers a one-click *"remove offending key from example"* — it is **never**
auto-edited. This is by design so you can see the example-validation path work.
