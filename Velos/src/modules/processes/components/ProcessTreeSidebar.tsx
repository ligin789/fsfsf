/**
 * Left sidebar rendered as a hierarchical tree: each process GROUP is a
 * collapsible parent (folder), and its nodes appear as process CHILDREN, joined
 * by connector lines. A child resolves the group node's `process_key` against
 * the loaded processes — unresolved ones show muted ("not loaded"). Clicking a
 * resolved child selects that process; hovering reveals info / edit / delete.
 */
import { useState } from 'react';
import {
  HiOutlineFolder,
  HiOutlineFolderOpen,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlinePencil,
  HiOutlineTrash,
  HiPlus,
} from 'react-icons/hi';
import type { ProcessGroup } from '../../process-groups/store/types';
import type { ProcessDoc } from '../store/types';

interface ProcessTreeSidebarProps {
  groups: ProcessGroup[];
  processesByKey: Record<string, ProcessDoc>;
  selectedProcessKey: string | null;
  width: number;
  onSelectProcess: (processKey: string) => void;
  onInfo: (processKey: string) => void;
  onEdit: (processKey: string) => void;
  onDelete: (processKey: string) => void;
  onCreateProcess: (group: ProcessGroup) => void;
}

export default function ProcessTreeSidebar({
  groups,
  processesByKey,
  selectedProcessKey,
  width,
  onSelectProcess,
  onInfo,
  onEdit,
  onDelete,
  onCreateProcess,
}: ProcessTreeSidebarProps) {
  // Track collapsed groups so newly-loaded groups default to expanded.
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <aside className="proc-tree" style={{ width, flexBasis: width }}>
      <div className="proc-tree__header">
        <span className="proc-tree__title">Process Groups</span>
        <span className="proc-tree__count">{groups.length}</span>
      </div>

      <div className="proc-tree__scroll" role="tree">
        {groups.map((group) => {
          const isOpen = !collapsed.has(group.process_group_id);
          const loaded = group.nodes.filter((n) => processesByKey[n.process_key]).length;
          return (
            <div key={group.process_group_id} className="proc-tree__group" role="treeitem" aria-expanded={isOpen}>
              <div className="proc-tree__group-head">
                <button
                  type="button"
                  className={`proc-tree__group-row ${isOpen ? 'is-open' : ''}`}
                  onClick={() => toggle(group.process_group_id)}
                  title={group.process_group_key}
                >
                  <span className="proc-tree__caret">{isOpen ? '▾' : '▸'}</span>
                  {isOpen ? (
                    <HiOutlineFolderOpen className="proc-tree__folder" size={16} />
                  ) : (
                    <HiOutlineFolder className="proc-tree__folder" size={16} />
                  )}
                  <span className="proc-tree__group-name">{group.name}</span>
                  <span className="proc-tree__group-badge" title={`${loaded} of ${group.nodes.length} loaded`}>
                    {loaded}/{group.nodes.length}
                  </span>
                </button>
                <button
                  type="button"
                  className="proc-tree__group-add"
                  title="Create new process"
                  aria-label="Create new process"
                  onClick={() => onCreateProcess(group)}
                >
                  <HiPlus size={15} />
                </button>
              </div>

              {isOpen && (
                <ul className="proc-tree__leaves" role="group">
                  {group.nodes.map((node) => {
                    const proc = processesByKey[node.process_key];
                    const active = proc && proc.process_key === selectedProcessKey;
                    return (
                      <li key={node.node_id} className="proc-tree__leaf-li">
                        <div
                          className={`proc-tree__leaf-row ${active ? 'proc-tree__leaf-row--active' : ''} ${
                            proc ? '' : 'proc-tree__leaf-row--muted'
                          }`}
                        >
                          <button
                            type="button"
                            className="proc-tree__leaf"
                            disabled={!proc}
                            onClick={() => proc && onSelectProcess(proc.process_key)}
                          >
                            <HiOutlineDocumentText className="proc-tree__leaf-icon" size={14} />
                            <span className="proc-tree__leaf-text">
                              <span className="proc-tree__leaf-name">
                                {proc ? proc.name : node.process_key}
                              </span>
                              <span className="proc-tree__leaf-key">
                                {proc ? node.process_key : `${node.process_key} · not loaded`}
                              </span>
                            </span>
                          </button>

                          {proc && (
                            <div className="proc-tree__leaf-actions">
                              <button
                                type="button"
                                title="Info"
                                aria-label="Process info"
                                onClick={() => onInfo(proc.process_key)}
                              >
                                <HiOutlineInformationCircle size={15} />
                              </button>
                              <button
                                type="button"
                                title="Edit"
                                aria-label="Edit process"
                                onClick={() => onEdit(proc.process_key)}
                              >
                                <HiOutlinePencil size={14} />
                              </button>
                              <button
                                type="button"
                                title="Delete"
                                aria-label="Delete process"
                                className="proc-tree__leaf-action--danger"
                                onClick={() => onDelete(proc.process_key)}
                              >
                                <HiOutlineTrash size={14} />
                              </button>
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
