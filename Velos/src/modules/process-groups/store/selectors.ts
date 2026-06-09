/**
 * Selectors for the Process Groups module. Typed against the module's own
 * root-shape so the module stays decoupled from the host RootState.
 */
import type { ProcessGroup, ProcessGroupsRootShape } from './types';

export const selectProcessGroupsItems = (state: ProcessGroupsRootShape): ProcessGroup[] =>
  state.processGroups.items;

export const selectProcessGroupsStatus = (state: ProcessGroupsRootShape) =>
  state.processGroups.status;

export const selectProcessGroupsError = (state: ProcessGroupsRootShape): string | null =>
  state.processGroups.error;

export const selectSelectedGroupId = (state: ProcessGroupsRootShape): string | null =>
  state.processGroups.selectedGroupId;

export const selectSelectedGroup = (state: ProcessGroupsRootShape): ProcessGroup | null => {
  const { items, selectedGroupId } = state.processGroups;
  if (!selectedGroupId) return null;
  return items.find((g) => g.process_group_id === selectedGroupId) ?? null;
};
