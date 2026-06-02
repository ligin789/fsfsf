import React from "react";
import type { Rule } from "../../store/ruleTypes";

interface RuleItemProps {
  rule: Rule;
  isSelected: boolean;
  isUnsaved: boolean;
  onSelect: (rule: Rule) => void;
  onEdit: (rule: Rule) => void;
  onDelete: (rule: Rule) => void;
}

const RuleItem: React.FC<RuleItemProps> = ({
  rule,
  isSelected,
  isUnsaved,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <div
      className={`rule-item ${isSelected ? "active" : ""}`}
      onClick={() => onSelect(rule)}
    >
      <div className="rule-item-info">
        <div className="rule-item-name">
          {isUnsaved && <span className="unsaved-star">*</span>}
          {rule.ruleName}
        </div>
        <div className="rule-item-alert">{rule.alertName}</div>
      </div>
      <div className="rule-item-actions">
        <button
          className="icon-btn edit"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(rule);
          }}
        >
          &#9998;
        </button>
        <button
          className="icon-btn delete"
          title="Delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(rule);
          }}
        >
          &#128465;
        </button>
      </div>
    </div>
  );
};

export default RuleItem;
