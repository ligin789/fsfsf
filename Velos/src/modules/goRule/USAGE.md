# goRule — Rule Library Module

This module embeds the **GoRules JDM (JSON Decision Model) editor** inside
the Velos dashboard. It is the in-app port of the standalone
`src/backup/goRule/` project — all the runtime code lives under
`src/modules/goRule/` and is wired into the dashboard through the same
pattern used by `regulators`, `oem`, and `geographical-management`.

---

## 1. Folder layout

```
src/modules/goRule/
├── index.ts                       # Public surface (reducer, actions, types, page)
├── USAGE.md                       # This document
├── data/
│   └── mockRules.json             # Seed rules loaded when localStorage is empty
├── store/
│   ├── ruleTypes.ts               # Rule / RuleState types + action constants
│   ├── ruleReducer.ts             # Redux Toolkit slice with localStorage persistence
│   └── ruleActions.ts             # Thunk-style action creators
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx         # Sidebar + EditorPanel split (uses .gorule-* classes)
│   │   ├── RuleSidebar.tsx        # Rule list + Create / Edit / Delete actions
│   │   └── EditorPanel.tsx        # GoRules <DecisionGraph> wrapper + Save / Run
│   └── rule/
│       ├── RuleList.tsx
│       ├── RuleItem.tsx
│       ├── CreateRuleModal.tsx
│       ├── EditRuleModal.tsx
│       ├── DeleteConfirmModal.tsx
│       └── RunRuleModal.tsx       # Stub — dummy input / nodes / output panes
├── styles/
│   └── goRule.css                 # All styles scoped under `.gorule-root`
└── pages/
    └── RuleLibraryPage.tsx        # Route entrypoint — wraps MainLayout in .gorule-root
```

> Nothing in this folder reaches into other modules. The page mounts under a
> `.gorule-root` wrapper so the CSS cannot leak into the rest of the
> dashboard.

---

## 2. Required npm package

The editor itself is the npm package **`@gorules/jdm-editor`**. It is
declared in the root `package.json`:

```json
"dependencies": {
  "@gorules/jdm-editor": "^1.51.5"
}
```

After pulling the change, run:

```bash
npm install
# or
yarn install
```

No other goRule dependency is required — `@reduxjs/toolkit`,
`react-redux`, `react-bootstrap`, and `bootstrap` are already in the
project.

The editor's stylesheet is imported at the top of `EditorPanel.tsx`:

```ts
import "@gorules/jdm-editor/dist/style.css";
```

That import is co-located with the component that uses it, so the CSS is
only loaded when the Rule Library page is opened.

---

## 3. How it is linked into the dashboard

Three small additions outside this folder make the module live. They follow
the same convention as every other module in `src/modules/`.

### a. Store registration — `src/store/store.ts`

```ts
import { ruleReducer } from "../modules/goRule";

export const store = configureStore({
  reducer: {
    // …existing reducers…
    rule: ruleReducer,
  },
});
```

The rest of the dashboard reads from this slice as `state.rule`.

### b. Route — `src/App.tsx`

```tsx
const RuleLibraryPage = lazy(
  () => import("./modules/goRule/pages/RuleLibraryPage")
);

// inside the <Route path="/dashboard" …> children:
<Route
  path="designer/rule-library"
  element={
    <Suspense fallback={null}>
      <RuleLibraryPage />
    </Suspense>
  }
/>;
```

### c. Sidebar nav — `src/components/dashboard/navigation/Sidebar.tsx`

The **Velos Platform Manager → Designer → Rule Library** submenu item now
points to the new route:

```ts
{
  id: "designer-rule-library",
  label: "Rule Library",
  path: "/dashboard/designer/rule-library",
}
```

---

## 4. The JSON shape the editor consumes

A `Rule` is just metadata + a `ruleJson` graph definition:

```ts
interface Rule {
  id: number;                      // local numeric key (used as Redux/list key)
  ruleId: string;                  // business code, e.g. "RULE_001"
  ruleName: string;
  alertName: string;
  ruleJson: Record<string, unknown>; // GoRules JDM graph (see below)
}
```

`ruleJson` is what the `@gorules/jdm-editor` `<DecisionGraph>` component
reads and writes. The minimum viable shape is:

```json
{
  "nodes": [
    {
      "id": "1",
      "type": "inputNode",
      "position": { "x": 100, "y": 200 },
      "name": "Request"
    },
    {
      "id": "2",
      "type": "outputNode",
      "position": { "x": 600, "y": 200 },
      "name": "Response"
    }
  ],
  "edges": [
    { "id": "e1-2", "sourceId": "1", "targetId": "2", "type": "edge" }
  ]
}
```

Supported node `type`s include (non-exhaustive):

| type            | purpose                                       |
| --------------- | --------------------------------------------- |
| `inputNode`     | Request payload entry into the graph          |
| `outputNode`    | Response payload exit                         |
| `decisionTableNode` | Tabular rules (`hit policy`, conditions)  |
| `expressionNode`    | JS-like expressions                       |
| `functionNode`      | Custom JavaScript / Zen function          |
| `switchNode`        | Conditional branching                     |
| `decisionNode`      | Linked nested decision graph              |

See the GoRules JDM docs for the full node schema:
[https://gorules.io/docs/](https://gorules.io/docs/).

---

## 5. Passing JSON in & out

### Loading a rule into the editor

The currently-loaded rule lives in Redux under
`state.rule.selectedRule`. Selecting one calls `selectRule(rule)`, which
copies `rule.ruleJson` into `state.rule.draftJson`. `<DecisionGraph>` is
given that draft via the `value` prop:

```tsx
<DecisionGraph value={graphValue} onChange={handleChange} />
```

### Capturing user edits

Each user action emits `onChange({ nodes, edges })`. `EditorPanel`
dispatches `updateDraftJson(val)` which:

- replaces `state.rule.draftJson`
- sets `state.rule.isDirty = true`
- enables the **Save** button

The first onChange after a rule loads is intentionally swallowed
(`skipNextChange` ref) so opening a rule doesn't immediately mark it
dirty.

### Saving back

Clicking **Save** dispatches `saveRuleJson()`. The reducer copies
`draftJson` into the rule's `ruleJson`, persists the rules array to
`localStorage`, and clears `isDirty`.

### Programmatic access

To read the current graph from outside the module:

```ts
import { useSelector } from "react-redux";
import type { RootState } from "src/store/store";

const draft = useSelector((s: RootState) => s.rule.draftJson);
```

To inject a rule programmatically:

```ts
import { createRule } from "src/modules/goRule";
import type { Rule } from "src/modules/goRule";

dispatch(
  createRule({
    id: 99,
    ruleId: "RULE_099",
    ruleName: "External Rule",
    alertName: "External Alert",
    ruleJson: { nodes: [], edges: [] },
  })
);
```

---

## 6. Persistence

The reducer mirrors the rules array to `localStorage` under the key
`gorule_rule_management_state`. On first load (no key yet), it falls back
to the seed data in `data/mockRules.json`. To reset the editor, clear
that key from the browser DevTools application tab.

`selectedRule`, `draftJson`, and `isDirty` are **not** persisted — they
reset on every page load.

---

## 7. Styling & scoping

All goRule CSS lives in `styles/goRule.css` and is prefixed with
`.gorule-root`. `RuleLibraryPage.tsx` wraps the entire UI in that class,
so the styles never affect other modules.

Bootstrap is imported globally elsewhere in the dashboard, so
`react-bootstrap` components (`Modal`, `Button`, `Form`) just work
without an extra import here.

---

## 8. Common extension points

- **Replace seed data** — edit `data/mockRules.json` (used only when
  localStorage is empty).
- **Wire to a real backend** — swap the localStorage calls in
  `store/ruleReducer.ts` for async thunks calling your API; the action
  files already follow the thunk shape.
- **Make Run real** — `components/rule/RunRuleModal.tsx` currently shows
  dummy input / output. Plug the GoRules ZEN engine (`@gorules/zen-engine`)
  or a backend `/evaluate` endpoint to evaluate `draftJson` against the
  user's input and render the trace.
- **Embed elsewhere** — `RuleLibraryPage` can be rendered inside any
  layout; just keep the `.gorule-root` wrapper.
