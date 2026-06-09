/**
 * Left sidebar — scrollable list of every process group in the fixture.
 * Shows name + process_group_key + operator code; highlights the active group.
 */
import type { ProcessGroup } from '../store/types';

interface ProcessGroupListProps {
  items: ProcessGroup[];
  selectedGroupId: string | null;
  onSelect: (id: string) => void;
  width: number;
}

export default function ProcessGroupList({
  items,
  selectedGroupId,
  onSelect,
  width,
}: ProcessGroupListProps) {
  return (
    <aside className="pg-list" style={{ width, flexBasis: width }}>
      <div className="pg-list__header">
        <span className="pg-list__title">Process Groups</span>
        <span className="pg-list__count">{items.length}</span>
      </div>
      <ul className="pg-list__items">
        {items.map((group) => {
          const active = group.process_group_id === selectedGroupId;
          return (
            <li key={group.process_group_id}>
              <button
                type="button"
                className={`pg-list__item ${active ? 'pg-list__item--active' : ''}`}
                onClick={() => onSelect(group.process_group_id)}
              >
                <span className="pg-list__item-name">{group.name}</span>
                <span className="pg-list__item-key">{group.process_group_key}</span>
                <span className="pg-list__item-op">{group.operator.operatorCode}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
