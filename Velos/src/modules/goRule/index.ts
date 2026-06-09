/**
 * goRule module — public surface.
 *
 * See `USAGE.md` in this folder for setup instructions (package install,
 * store wiring, route wiring, JSON shape).
 */
export { default as RuleLibraryPage } from "./pages/RuleLibraryPage";

export { default as ruleReducer } from "./store/ruleReducer";
export * from "./store/ruleActions";
export * from "./store/ruleTypes";
