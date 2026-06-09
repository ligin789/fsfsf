/**
 * ProcessGroupsPage — full-height two-region layout:
 *   left  : scrollable list of all process groups
 *   right : header + React Flow DAG + node/edge inspector for the active group
 *
 * Loads the dummy fixture on mount via the loadProcessGroups thunk.
 */
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { loadProcessGroups, selectProcessGroup } from './store/actions';
import {
  selectProcessGroupsItems,
  selectProcessGroupsStatus,
  selectProcessGroupsError,
  selectSelectedGroupId,
  selectSelectedGroup,
} from './store/selectors';
import ProcessGroupList from './components/ProcessGroupList';
import ProcessGroupDetail from './components/ProcessGroupDetail';
import { Splitter, useDragResize } from '../shared';
import './styles/processGroups.css';

export default function ProcessGroupsPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectProcessGroupsItems);
  const status = useAppSelector(selectProcessGroupsStatus);
  const error = useAppSelector(selectProcessGroupsError);
  const selectedGroupId = useAppSelector(selectSelectedGroupId);
  const selectedGroup = useAppSelector(selectSelectedGroup);

  // Drag-resizable width of the left list (px).
  const list = useDragResize({ axis: 'x', initial: 260, min: 200, max: 480 });

  useEffect(() => {
    dispatch(loadProcessGroups());
  }, [dispatch]);

  // Lock the viewport to a single full-height screen while this page is mounted
  // so the flow canvas can claim all remaining space (mirrors the gantt page).
  useEffect(() => {
    document.body.classList.add('pg-active');
    return () => document.body.classList.remove('pg-active');
  }, []);

  return (
    <div className="pg-page">
      <ProcessGroupList
        items={items}
        selectedGroupId={selectedGroupId}
        onSelect={(id) => dispatch(selectProcessGroup(id))}
        width={list.size}
      />

      <Splitter orientation="vertical" dragging={list.dragging} onPointerDown={list.onPointerDown} />

      <div className="pg-page__main">
        {status === 'loading' && (
          <div className="pg-page__state">Loading process groups…</div>
        )}
        {status === 'failed' && (
          <div className="pg-page__state pg-page__state--error">
            {error ?? 'Failed to load process groups.'}
          </div>
        )}
        {status === 'succeeded' && !selectedGroup && (
          <div className="pg-page__state">Select a process group to view its detail.</div>
        )}
        {selectedGroup && <ProcessGroupDetail group={selectedGroup} />}
      </div>
    </div>
  );
}
