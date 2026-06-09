/**
 * Selectors for the Processes module, typed against the module's own root-shape.
 */
import type { ProcessDoc, ProcessesRootShape } from './types';

export const selectProcessesItems = (state: ProcessesRootShape): ProcessDoc[] =>
  state.processes.items;

export const selectProcessesStatus = (state: ProcessesRootShape) => state.processes.status;

export const selectProcessesError = (state: ProcessesRootShape): string | null =>
  state.processes.error;

export const selectSelectedProcessKey = (state: ProcessesRootShape): string | null =>
  state.processes.selectedProcessKey;

export const selectSelectedProcess = (state: ProcessesRootShape): ProcessDoc | null => {
  const { items, selectedProcessKey } = state.processes;
  if (!selectedProcessKey) return null;
  return items.find((p) => p.process_key === selectedProcessKey) ?? null;
};

/** Build a quick lookup of process_key → ProcessDoc (for the group↔process tree). */
export const selectProcessesByKey = (state: ProcessesRootShape): Record<string, ProcessDoc> => {
  const map: Record<string, ProcessDoc> = {};
  for (const p of state.processes.items) map[p.process_key] = p;
  return map;
};
