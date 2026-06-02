import type { AppDispatch } from "../../../store/store";
import type { Rule } from "./ruleTypes";
import { ruleActions } from "./ruleReducer";

export const createRule = (rule: Rule) => {
  return (dispatch: AppDispatch) => {
    dispatch(ruleActions.createRule(rule));
  };
};

export const updateRule = (rule: Rule) => {
  return (dispatch: AppDispatch) => {
    dispatch(ruleActions.updateRule(rule));
  };
};

export const deleteRule = (id: number) => {
  return (dispatch: AppDispatch) => {
    dispatch(ruleActions.deleteRule(id));
  };
};

export const selectRule = (rule: Rule | null) => {
  return (dispatch: AppDispatch) => {
    dispatch(ruleActions.selectRule(rule));
  };
};

export const updateDraftJson = (json: Record<string, unknown>) => {
  return (dispatch: AppDispatch) => {
    dispatch(ruleActions.updateDraftJson(json));
  };
};

export const saveRuleJson = () => {
  return (dispatch: AppDispatch) => {
    dispatch(ruleActions.saveRuleJson());
  };
};

export const discardDraft = () => {
  return (dispatch: AppDispatch) => {
    dispatch(ruleActions.discardDraft());
  };
};
