/**
 * Editor for a task's `execution_steps`. Each step is type-aware:
 *   TOOLKIT    → toolkitName/Id + api + request/response mapping + criteria/errors
 *   VALIDATION → rulesetName/Id + api + request/response mapping + criteria/errors
 *   TRANSFORM  → mappingLanguage + map + saveAs + schemaRef (+ when)
 *
 * Nested objects are edited as JSON so nothing is dropped. Any committed change
 * rebuilds the steps array and bubbles up via onCommitSteps.
 */
import { JsonField, TextField } from '../../shared';
import type { ExecutionStep } from '../store/types';

interface StepEditorProps {
  steps: ExecutionStep[];
  onCommitSteps: (steps: ExecutionStep[]) => void;
}

export default function StepEditor({ steps, onCommitSteps }: StepEditorProps) {
  const patchStep = (id: string, patch: Partial<ExecutionStep>) => {
    onCommitSteps(steps.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  if (steps.length === 0) {
    return <p className="proc-inspector__empty">No execution steps.</p>;
  }

  return (
    <div className="proc-steps">
      {steps.map((step, i) => (
        <div key={step.id} className={`proc-step proc-step--${step.type.toLowerCase()}`}>
          <div className="proc-step__head">
            <span className="proc-step__index">{i + 1}</span>
            <span className={`proc-step__badge proc-step__badge--${step.type.toLowerCase()}`}>
              {step.type}
            </span>
          </div>

          <TextField label="name" value={step.name ?? ''} onCommit={(v) => patchStep(step.id, { name: v })} />

          {step.type === 'TOOLKIT' && (
            <>
              <TextField
                label="toolkitName"
                value={step.toolkitName ?? ''}
                onCommit={(v) => patchStep(step.id, { toolkitName: v })}
              />
              <TextField
                label="toolkitId"
                value={step.toolkitId ?? ''}
                onCommit={(v) => patchStep(step.id, { toolkitId: v })}
              />
            </>
          )}

          {step.type === 'VALIDATION' && (
            <>
              <TextField
                label="rulesetName"
                value={step.rulesetName ?? ''}
                onCommit={(v) => patchStep(step.id, { rulesetName: v })}
              />
              <TextField
                label="rulesetId"
                value={step.rulesetId ?? ''}
                onCommit={(v) => patchStep(step.id, { rulesetId: v })}
              />
            </>
          )}

          {(step.type === 'TOOLKIT' || step.type === 'VALIDATION') && (
            <>
              <JsonField label="api" value={step.api} onCommit={(v) => patchStep(step.id, { api: v as Record<string, unknown> })} />
              <JsonField
                label="requestMapping"
                value={step.requestMapping}
                onCommit={(v) => patchStep(step.id, { requestMapping: v as Record<string, unknown> })}
              />
              <JsonField
                label="responseMapping"
                value={step.responseMapping}
                onCommit={(v) => patchStep(step.id, { responseMapping: v as Record<string, unknown> })}
              />
              <JsonField
                label="successCriteria"
                value={step.successCriteria}
                onCommit={(v) => patchStep(step.id, { successCriteria: v })}
              />
              <JsonField
                label="errorHandling"
                value={step.errorHandling}
                onCommit={(v) => patchStep(step.id, { errorHandling: v })}
              />
            </>
          )}

          {step.type === 'TRANSFORM' && (
            <>
              <TextField
                label="mappingLanguage"
                value={step.mappingLanguage ?? ''}
                onCommit={(v) => patchStep(step.id, { mappingLanguage: v })}
              />
              <JsonField label="map" value={step.map} onCommit={(v) => patchStep(step.id, { map: v })} />
              <TextField
                label="saveAs"
                value={step.saveAs ?? ''}
                onCommit={(v) => patchStep(step.id, { saveAs: v })}
              />
              <TextField
                label="schemaRef"
                value={step.schemaRef ?? ''}
                onCommit={(v) => patchStep(step.id, { schemaRef: v })}
              />
              {step.when !== undefined && (
                <JsonField label="when" value={step.when} onCommit={(v) => patchStep(step.id, { when: v })} />
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
