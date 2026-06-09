import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";
import type { Rule } from "../../store/ruleTypes";
import {
  createRule,
  updateRule,
  deleteRule,
  selectRule,
} from "../../store/ruleActions";
import RuleList from "../rule/RuleList";
import CreateRuleModal from "../rule/CreateRuleModal";
import EditRuleModal from "../rule/EditRuleModal";
import DeleteConfirmModal from "../rule/DeleteConfirmModal";

const RuleSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const rules = useSelector((state: RootState) => state.rule.rules);
  const isDirty = useSelector((state: RootState) => state.rule.isDirty);
  const selectedRule = useSelector(
    (state: RootState) => state.rule.selectedRule
  );

  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [targetRule, setTargetRule] = useState<Rule | null>(null);

  const confirmIfDirty = (): boolean => {
    if (isDirty) {
      return window.confirm(
        "You have unsaved changes. Are you sure you want to leave without saving?"
      );
    }
    return true;
  };

  const handleSelect = (rule: Rule) => {
    if (rule.id === selectedRule?.id) return;
    if (!confirmIfDirty()) return;
    (dispatch as any)(selectRule(rule));
  };

  const handleCreate = (
    ruleId: string,
    ruleName: string,
    alertName: string
  ) => {
    const newId = rules.length > 0 ? Math.max(...rules.map((r) => r.id)) + 1 : 1;
    const newRule: Rule = {
      id: newId,
      ruleId,
      ruleName,
      alertName,
      ruleJson: {
        nodes: [
          {
            id: "1",
            type: "inputNode",
            position: { x: 100, y: 200 },
            name: "Request",
          },
          {
            id: "2",
            type: "outputNode",
            position: { x: 600, y: 200 },
            name: "Response",
          },
        ],
        edges: [
          {
            id: "e1-2",
            sourceId: "1",
            targetId: "2",
            type: "edge",
          },
        ],
      },
    };
    (dispatch as any)(createRule(newRule));
    setShowCreate(false);
  };

  const handleEdit = (rule: Rule) => {
    setTargetRule(rule);
    setShowEdit(true);
  };

  const handleUpdate = (rule: Rule) => {
    (dispatch as any)(updateRule(rule));
    setShowEdit(false);
    setTargetRule(null);
  };

  const handleDeleteClick = (rule: Rule) => {
    setTargetRule(rule);
    setShowDelete(true);
  };

  const handleDeleteConfirm = () => {
    if (targetRule) {
      (dispatch as any)(deleteRule(targetRule.id));
    }
    setShowDelete(false);
    setTargetRule(null);
  };

  return (
    <div className="sidebar-container d-flex flex-column h-100">
      <div className="sidebar-header">
        <h6 className="sidebar-title">Rules</h6>
        <Button
          variant="primary"
          size="sm"
          className="w-100 create-btn"
          onClick={() => setShowCreate(true)}
        >
          + Create Rule
        </Button>
      </div>
      <RuleList
        onSelect={handleSelect}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      <CreateRuleModal
        show={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />
      <EditRuleModal
        show={showEdit}
        rule={targetRule}
        onClose={() => {
          setShowEdit(false);
          setTargetRule(null);
        }}
        onUpdate={handleUpdate}
      />
      <DeleteConfirmModal
        show={showDelete}
        onClose={() => {
          setShowDelete(false);
          setTargetRule(null);
        }}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default RuleSidebar;
