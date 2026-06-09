/**
 * ProcessesPage — Process Builder.
 *   • left: group→process tree (info/edit/delete on hover; process basic-info
 *     lives in a modal, not a header bar)
 *   • right: React Flow editor on top + type-aware node detail panel on bottom,
 *     with a full-screen toggle (like the rule editor)
 *
 * Shows a "Builder is loading…" splash until the fixtures resolve. Reads process
 * groups from the existing process-groups store (no refetch).
 */
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { Modal, Splitter, useDragResize } from '../shared';
import { loadProcessGroups } from '../process-groups/store/actions';
import { selectProcessGroupsItems } from '../process-groups/store/selectors';
import type { ProcessGroup } from '../process-groups/store/types';
import { loadProcesses, selectProcess, deleteProcess } from './store/actions';
import {
  selectProcessesItems,
  selectProcessesStatus,
  selectProcessesError,
  selectSelectedProcessKey,
  selectSelectedProcess,
} from './store/selectors';
import ProcessTreeSidebar from './components/ProcessTreeSidebar';
import ProcessDetail from './components/ProcessDetail';
import ProcessInfoModal from './components/ProcessInfoModal';
import CreateProcessModal from './components/CreateProcessModal';
import './styles/processes.css';

interface InfoModalState {
  key: string;
  mode: 'view' | 'edit';
}

export default function ProcessesPage() {
  const dispatch = useAppDispatch();
  const groups = useAppSelector(selectProcessGroupsItems);
  const items = useAppSelector(selectProcessesItems);
  // process_key → doc lookup (memoized so we don't hand a new ref to the tree).
  const processesByKey = useMemo(() => {
    const map: Record<string, (typeof items)[number]> = {};
    for (const p of items) map[p.process_key] = p;
    return map;
  }, [items]);
  const status = useAppSelector(selectProcessesStatus);
  const error = useAppSelector(selectProcessesError);
  const selectedProcessKey = useAppSelector(selectSelectedProcessKey);
  const selectedProcess = useAppSelector(selectSelectedProcess);

  const tree = useDragResize({ axis: 'x', initial: 300, min: 220, max: 520 });

  const [fullscreen, setFullscreen] = useState(false);
  const [infoModal, setInfoModal] = useState<InfoModalState | null>(null);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);
  const [createGroup, setCreateGroup] = useState<ProcessGroup | null>(null);

  useEffect(() => {
    dispatch(loadProcesses());
    if (groups.length === 0) dispatch(loadProcessGroups());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Lock the viewport to one full-height screen so the flow can fill space.
  useEffect(() => {
    document.body.classList.add('proc-active');
    return () => document.body.classList.remove('proc-active');
  }, []);

  // Esc exits full screen (unless a modal is open, which handles its own Esc).
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !infoModal && !deleteKey) setFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullscreen, infoModal, deleteKey]);

  const isLoading = status === 'idle' || status === 'loading';
  const infoProcess = infoModal ? processesByKey[infoModal.key] : undefined;
  const deleteProc = deleteKey ? processesByKey[deleteKey] : undefined;

  return (
    <div className={`proc-page ${fullscreen ? 'proc-page--fullscreen' : ''}`}>
      <ProcessTreeSidebar
        groups={groups}
        processesByKey={processesByKey}
        selectedProcessKey={selectedProcessKey}
        width={tree.size}
        onSelectProcess={(processKey) => dispatch(selectProcess(processKey))}
        onInfo={(processKey) => setInfoModal({ key: processKey, mode: 'view' })}
        onEdit={(processKey) => setInfoModal({ key: processKey, mode: 'edit' })}
        onDelete={(processKey) => setDeleteKey(processKey)}
        onCreateProcess={(group) => setCreateGroup(group)}
      />

      <Splitter orientation="vertical" dragging={tree.dragging} onPointerDown={tree.onPointerDown} variant="proc" />

      <div className="proc-page__main">
        {isLoading ? (
          <div className="proc-loader">
            <div className="proc-loader__spinner" />
            <div className="proc-loader__text">Builder is loading…</div>
          </div>
        ) : status === 'failed' ? (
          <div className="proc-page__state proc-page__state--error">
            {error ?? 'Failed to load processes.'}
          </div>
        ) : !selectedProcess ? (
          <div className="proc-page__state">Select a process from the tree to open it in the builder.</div>
        ) : (
          <ProcessDetail
            process={selectedProcess}
            fullscreen={fullscreen}
            onToggleFullscreen={() => setFullscreen((f) => !f)}
          />
        )}
      </div>

      {/* Create new process (UI only) */}
      {createGroup && (
        <CreateProcessModal
          groupName={createGroup.name}
          groupKey={createGroup.process_group_key}
          onClose={() => setCreateGroup(null)}
        />
      )}

      {/* Process basic-information (info = view, edit = edit) */}
      {infoModal && infoProcess && (
        <ProcessInfoModal
          process={infoProcess}
          initialMode={infoModal.mode}
          onClose={() => setInfoModal(null)}
        />
      )}

      {/* Delete confirmation */}
      {deleteKey && deleteProc && (
        <Modal
          title="Delete process"
          onClose={() => setDeleteKey(null)}
          width={440}
          footer={
            <>
              <button
                type="button"
                className="proc-btn proc-btn--danger"
                onClick={() => {
                  dispatch(deleteProcess(deleteKey));
                  setDeleteKey(null);
                }}
              >
                Delete
              </button>
              <button type="button" className="proc-btn" onClick={() => setDeleteKey(null)}>
                Cancel
              </button>
            </>
          }
        >
          <p style={{ margin: 0, fontSize: 13 }}>
            Delete <strong>{deleteProc.name}</strong> (<code>{deleteProc.process_key}</code>)? This removes
            it from the builder for this session.
          </p>
        </Modal>
      )}
    </div>
  );
}
