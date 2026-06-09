/**
 * Process basic-information modal (replaces the old top header bar). Opened from
 * the sidebar's per-process "info" (view) and "edit" icons. View mode shows a
 * read-only summary; edit mode exposes the editable fields that write back via
 * UPDATE_PROCESS_META. // TODO: replace with api.saveProcess().
 */
import { useState } from 'react';
import { Modal, JsonField, SelectField, TextField } from '../../shared';
import { useAppDispatch } from '../../../store/hooks';
import { updateProcessMeta } from '../store/actions';
import type { ProcessDoc } from '../store/types';

interface ProcessInfoModalProps {
  process: ProcessDoc;
  initialMode: 'view' | 'edit';
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { value: 'draft' },
  { value: 'active' },
  { value: 'inactive' },
  { value: 'deprecated' },
];

export default function ProcessInfoModal({ process, initialMode, onClose }: ProcessInfoModalProps) {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<'view' | 'edit'>(initialMode);
  const key = process.process_key;
  const patch = (p: Record<string, unknown>) => dispatch(updateProcessMeta(key, p));

  const footer = (
    <>
      {mode === 'view' ? (
        <button type="button" className="proc-btn proc-btn--primary" onClick={() => setMode('edit')}>
          Edit
        </button>
      ) : (
        <button type="button" className="proc-btn proc-btn--primary" onClick={() => setMode('view')}>
          Done
        </button>
      )}
      <button type="button" className="proc-btn" onClick={onClose}>
        Close
      </button>
    </>
  );

  return (
    <Modal title="Process Information" onClose={onClose} footer={footer} width={620}>
      {mode === 'view' ? (
        <dl className="proc-info">
          <dt>name</dt>
          <dd>{process.name}</dd>
          <dt>process_key</dt>
          <dd><code className="proc-info__code">{process.process_key}</code></dd>
          <dt>version</dt>
          <dd>{process.version}</dd>
          <dt>status</dt>
          <dd><span className="proc-info__status">{process.status}</span></dd>
          <dt>description</dt>
          <dd>{process.description ?? '—'}</dd>
          <dt>domain</dt>
          <dd><pre className="proc-info__json">{JSON.stringify(process.domain ?? {}, null, 2)}</pre></dd>
          <dt>operator</dt>
          <dd><pre className="proc-info__json">{JSON.stringify(process.operator ?? {}, null, 2)}</pre></dd>
        </dl>
      ) : (
        <div className="proc-info__edit">
          <TextField label="name" value={process.name ?? ''} onCommit={(v) => patch({ name: v })} />
          <TextField
            label="process_key"
            value={process.process_key ?? ''}
            onCommit={(v) => patch({ process_key: v })}
          />
          <TextField label="version" value={process.version ?? ''} onCommit={(v) => patch({ version: v })} />
          <SelectField
            label="status"
            value={process.status ?? ''}
            options={
              STATUS_OPTIONS.some((o) => o.value === process.status)
                ? STATUS_OPTIONS
                : [{ value: process.status ?? '' }, ...STATUS_OPTIONS]
            }
            onChange={(v) => patch({ status: v })}
          />
          <TextField
            label="description"
            value={process.description ?? ''}
            multiline
            onCommit={(v) => patch({ description: v })}
          />
          <JsonField label="domain" value={process.domain} rows={5} onCommit={(v) => patch({ domain: v })} />
          <JsonField label="operator" value={process.operator} rows={6} onCommit={(v) => patch({ operator: v })} />
        </div>
      )}
    </Modal>
  );
}
