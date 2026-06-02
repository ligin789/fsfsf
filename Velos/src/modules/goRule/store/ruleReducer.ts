import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RuleState, Rule } from "./ruleTypes";
import mockRules from "../data/mockRules.json";

const STORAGE_KEY = "gorule_rule_management_state";

function loadFromStorage(): RuleState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        selectedRule: null,
        draftJson: null,
        isDirty: false,
      };
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

function saveToStorage(state: RuleState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        rules: state.rules,
        loading: false,
        error: null,
      })
    );
  } catch {
    // ignore quota errors
  }
}

const defaultState: RuleState = {
  rules: mockRules as Rule[],
  selectedRule: null,
  draftJson: null,
  isDirty: false,
  loading: false,
  error: null,
};

const initialState: RuleState = loadFromStorage() ?? defaultState;

const ruleSlice = createSlice({
  name: "rule",
  initialState,
  reducers: {
    createRule(state, action: PayloadAction<Rule>) {
      state.rules.push(action.payload);
      saveToStorage(state);
    },
    updateRule(state, action: PayloadAction<Rule>) {
      const idx = state.rules.findIndex((r) => r.id === action.payload.id);
      if (idx !== -1) state.rules[idx] = action.payload;
      if (state.selectedRule?.id === action.payload.id) {
        state.selectedRule = action.payload;
      }
      saveToStorage(state);
    },
    deleteRule(state, action: PayloadAction<number>) {
      state.rules = state.rules.filter((r) => r.id !== action.payload);
      if (state.selectedRule?.id === action.payload) {
        state.selectedRule = null;
        state.draftJson = null;
        state.isDirty = false;
      }
      saveToStorage(state);
    },
    selectRule(state, action: PayloadAction<Rule | null>) {
      state.selectedRule = action.payload;
      state.draftJson = action.payload?.ruleJson ?? null;
      state.isDirty = false;
    },
    updateDraftJson(state, action: PayloadAction<Record<string, unknown>>) {
      state.draftJson = action.payload;
      state.isDirty = true;
    },
    saveRuleJson(state) {
      if (!state.selectedRule || !state.draftJson) return;
      const idx = state.rules.findIndex((r) => r.id === state.selectedRule!.id);
      if (idx !== -1) {
        state.rules[idx].ruleJson = state.draftJson;
      }
      state.selectedRule.ruleJson = state.draftJson;
      state.isDirty = false;
      saveToStorage(state);
    },
    discardDraft(state) {
      if (state.selectedRule) {
        state.draftJson = state.selectedRule.ruleJson;
      }
      state.isDirty = false;
    },
  },
});

export const ruleActions = ruleSlice.actions;
export default ruleSlice.reducer;
