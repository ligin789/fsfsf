/**
 * "Create new process" modal — UI only for now. Opened from the + icon next to a
 * process group in the sidebar; the new process would be created under that
 * group. Fields are dummy/local; nothing is persisted yet.
 * // TODO: wire up api.createProcess() + dispatch into the processes store.
 */
import { useState } from 'react';
import { Modal, SelectField, TextField } from '../../shared';

interface CreateProcessModalProps {
  groupName: string;
  groupKey: string;
  onClose: () => void;
}

export default function CreateProcessModal({ groupName, groupKey, onClose }: CreateProcessModalProps) {
  const [name, setName] = useState('');
  const [processKey, setProcessKey] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [status, setStatus] = useState('draft');
  const [executionModel, setExecutionModel] = useState('DAG');
  const [description, setDescription] = useState('');

  const footer = (
    <>
      <button
        type="button"
        className="proc-btn proc-btn--primary"
        // UI only — would create the process under the group, then close.
        onClick={onClose}
      >
        Create process
      </button>
      <button type="button" className="proc-btn" onClick={onClose}>
        Cancel
      </button>
    </>
  );

  return (
    <Modal title="Create new process" onClose={onClose} footer={footer} width={580}>
      <div className="proc-create">
        <label className="vfld proc-create__full">
          <span className="vfld__label">Process group</span>
          <input className="vfld__input" value={`${groupName} · ${groupKey}`} disabled readOnly />
        </label>

        <TextField
          label="Name"
          value={name}
          onCommit={setName}
          placeholder="e.g. Passenger Re-accommodation"
        />
        <TextField
          label="Process key"
          value={processKey}
          onCommit={setProcessKey}
          placeholder="e.g. PASSENGER_REACCOMMODATION"
        />
        <TextField label="Version" value={version} onCommit={setVersion} />
        <SelectField
          label="Status"
          value={status}
          options={[{ value: 'draft' }, { value: 'active' }, { value: 'inactive' }]}
          onChange={setStatus}
        />
        <SelectField
          label="Execution model"
          value={executionModel}
          options={[{ value: 'DAG' }, { value: 'SEQUENTIAL' }, { value: 'STATE_MACHINE' }]}
          onChange={setExecutionModel}
        />
        <div className="proc-create__full">
          <TextField
            label="Description"
            value={description}
            onCommit={setDescription}
            multiline
            placeholder="Short description of what this process does…"
          />
        </div>
      </div>
    </Modal>
  );
}
