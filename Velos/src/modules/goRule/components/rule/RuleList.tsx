import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import type { Rule } from "../../store/ruleTypes";
import RuleItem from "./RuleItem";

interface RuleListProps {
  onSelect: (rule: Rule) => void;
  onEdit: (rule: Rule) => void;
  onDelete: (rule: Rule) => void;
}

const RuleList: React.FC<RuleListProps> = ({ onSelect, onEdit, onDelete }) => {
  const { rules, selectedRule, isDirty } = useSelector(
    (state: RootState) => state.rule
  );

  if (rules.length === 0) {
    return <p className="text-muted p-3 small">No rules created yet.</p>;
  }

  return (
    <div className="rule-list">
      {rules.map((rule) => (
        <RuleItem
          key={rule.id}
          rule={rule}
          isSelected={selectedRule?.id === rule.id}
          isUnsaved={selectedRule?.id === rule.id && isDirty}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default RuleList;
