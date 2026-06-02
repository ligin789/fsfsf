export interface Rule {
  id: number;
  ruleId: string;
  ruleName: string;
  alertName: string;
  ruleJson: Record<string, unknown>;
}

export interface RuleState {
  rules: Rule[];
  selectedRule: Rule | null;
  draftJson: Record<string, unknown> | null;
  isDirty: boolean;
  loading: boolean;
  error: string | null;
}

export const CREATE_RULE = "CREATE_RULE";
export const UPDATE_RULE = "UPDATE_RULE";
export const DELETE_RULE = "DELETE_RULE";
export const SELECT_RULE = "SELECT_RULE";
export const SAVE_RULE_JSON = "SAVE_RULE_JSON";

interface CreateRuleAction {
  type: typeof CREATE_RULE;
  payload: Rule;
}

interface UpdateRuleAction {
  type: typeof UPDATE_RULE;
  payload: Rule;
}

interface DeleteRuleAction {
  type: typeof DELETE_RULE;
  payload: number;
}

interface SelectRuleAction {
  type: typeof SELECT_RULE;
  payload: Rule | null;
}

interface SaveRuleJsonAction {
  type: typeof SAVE_RULE_JSON;
  payload: { id: number; ruleJson: Record<string, unknown> };
}

export type RuleActionTypes =
  | CreateRuleAction
  | UpdateRuleAction
  | DeleteRuleAction
  | SelectRuleAction
  | SaveRuleJsonAction;
