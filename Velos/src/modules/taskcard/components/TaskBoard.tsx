import { useCallback, useMemo, useState } from 'react';
import tasksFixture from '../data/tasks.json';
import { TASK_TEMPLATES } from '../registry';
import type { Task, TaskActions, TaskStatus, TaskType } from '../types';
import TaskCard from './TaskCard';
import TaskDetailsModal from './TaskDetailsModal';
import '../styles.css';

// ---------- Layout config ----------

const STATUS_ROWS: { status: TaskStatus; title: string; color: string }[] = [
  { status: 'todo', title: 'To Do', color: '#64748B' },
  { status: 'in_progress', title: 'In Progress', color: '#2563EB' },
  { status: 'blocked', title: 'Blocked', color: '#B91C1C' },
  { status: 'done', title: 'Done', color: '#15803D' },
];

// 4-hour time slots covering a 24-hour day.
interface TimeSlot {
  id: string;
  startHour: number; // inclusive
  endHour: number; // exclusive
  label: string;
}
const TIME_SLOTS: TimeSlot[] = [
  { id: 's0', startHour: 0, endHour: 4, label: 'Late night' },
  { id: 's1', startHour: 4, endHour: 8, label: 'Early morning' },
  { id: 's2', startHour: 8, endHour: 12, label: 'Morning' },
  { id: 's3', startHour: 12, endHour: 16, label: 'Afternoon' },
  { id: 's4', startHour: 16, endHour: 20, label: 'Evening' },
  { id: 's5', startHour: 20, endHour: 24, label: 'Night' },
];

const UNSCHEDULED_ID = 'unscheduled' as const;

type Filter = 'all' | TaskType;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  ...(Object.keys(TASK_TEMPLATES) as TaskType[]).map((k) => ({
    id: k,
    label: `${TASK_TEMPLATES[k].icon} ${TASK_TEMPLATES[k].label}`,
  })),
];

const ANY = '__any__' as const;
type AnyOr<T extends string> = typeof ANY | T;

// ---------- Helpers ----------

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function slotForHour(hour: number): TimeSlot | undefined {
  return TIME_SLOTS.find((s) => hour >= s.startHour && hour < s.endHour);
}

function formatHour(h: number): string {
  return `${h.toString().padStart(2, '0')}:00`;
}

function formatDay(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/** Pick the most populated day across the fixture so the first paint shows something useful. */
function pickInitialDay(tasks: Task[]): Date {
  const counts = new Map<string, number>();
  for (const t of tasks) {
    if (!t.dueAt) continue;
    const d = new Date(t.dueAt);
    if (Number.isNaN(d.getTime())) continue;
    const key = startOfDay(d).toISOString();
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let bestKey: string | null = null;
  let best = -1;
  counts.forEach((v, k) => {
    if (v > best) {
      best = v;
      bestKey = k;
    }
  });
  return bestKey ? new Date(bestKey) : startOfDay(new Date());
}

// ---------- Component ----------

export default function TaskBoard() {
  const [tasks, setTasks] = useState<Task[]>(() => tasksFixture as Task[]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [day, setDay] = useState<Date>(() => pickInitialDay(tasksFixture as Task[]));
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState<AnyOr<string>>(ANY);
  const [zone, setZone] = useState<AnyOr<string>>(ANY);
  const [cluster, setCluster] = useState<AnyOr<string>>(ANY);

  const today = useMemo(() => startOfDay(new Date()), []);
  const isToday = sameDay(day, today);

  // Distinct values across the dataset, narrowed by upstream selection so the
  // dropdowns stay self-consistent (region → zone → cluster).
  const regionOptions = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.region))).sort(),
    [tasks],
  );
  const zoneOptions = useMemo(() => {
    const scope = region === ANY ? tasks : tasks.filter((t) => t.region === region);
    return Array.from(new Set(scope.map((t) => t.zone))).sort();
  }, [tasks, region]);
  const clusterOptions = useMemo(() => {
    let scope = tasks;
    if (region !== ANY) scope = scope.filter((t) => t.region === region);
    if (zone !== ANY) scope = scope.filter((t) => t.zone === zone);
    return Array.from(new Set(scope.map((t) => t.cluster))).sort();
  }, [tasks, region, zone]);

  const filteredTasks = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks.filter((t) => {
      if (filter !== 'all' && t.type !== filter) return false;
      if (region !== ANY && t.region !== region) return false;
      if (zone !== ANY && t.zone !== zone) return false;
      if (cluster !== ANY && t.cluster !== cluster) return false;
      if (q) {
        const haystack = [
          t.id,
          t.title,
          t.assignee,
          t.cluster,
          t.region,
          t.zone,
          t.related?.label ?? '',
          t.related?.id ?? '',
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [tasks, filter, search, region, zone, cluster]);

  const hasActiveFilters =
    filter !== 'all' ||
    region !== ANY ||
    zone !== ANY ||
    cluster !== ANY ||
    search.trim() !== '';

  const resetFilters = () => {
    setFilter('all');
    setRegion(ANY);
    setZone(ANY);
    setCluster(ANY);
    setSearch('');
  };

  /**
   * Bucket tasks into a 2D map: status → (slotId | 'unscheduled') → tasks.
   * Rules:
   *   - tasks with dueAt on the selected day go into the matching time slot
   *   - tasks with dueAt on a different day are hidden (use date nav)
   *   - tasks without dueAt are always shown in the "Unscheduled" column
   */
  const grid = useMemo(() => {
    const empty = () => {
      const row: Record<string, Task[]> = {};
      for (const s of TIME_SLOTS) row[s.id] = [];
      row[UNSCHEDULED_ID] = [];
      return row;
    };
    const map: Record<TaskStatus, Record<string, Task[]>> = {
      todo: empty(),
      in_progress: empty(),
      blocked: empty(),
      done: empty(),
    };
    for (const t of filteredTasks) {
      if (!t.dueAt) {
        map[t.status][UNSCHEDULED_ID].push(t);
        continue;
      }
      const due = new Date(t.dueAt);
      if (Number.isNaN(due.getTime())) {
        map[t.status][UNSCHEDULED_ID].push(t);
        continue;
      }
      if (!sameDay(due, day)) continue;
      const slot = slotForHour(due.getHours());
      if (slot) map[t.status][slot.id].push(t);
    }
    return map;
  }, [filteredTasks, day]);

  const statusCounts = useMemo(() => {
    const c: Record<TaskStatus, number> = { todo: 0, in_progress: 0, blocked: 0, done: 0 };
    (Object.keys(grid) as TaskStatus[]).forEach((s) => {
      const row = grid[s];
      c[s] = Object.values(row).reduce((acc, list) => acc + list.length, 0);
    });
    return c;
  }, [grid]);

  const selected = useMemo(
    () => tasks.find((t) => t.id === selectedId) ?? null,
    [tasks, selectedId],
  );

  const actionsFor = useCallback(
    (taskId: string): TaskActions => ({
      setStatus: (status) =>
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? ({ ...t, status } as Task) : t)),
        ),
      update: (patch) =>
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? ({ ...t, ...patch } as Task) : t)),
        ),
    }),
    [],
  );

  return (
    <div className="tc-board">
      <div className="tc-board__header">
        <div>
          <h2 className="tc-board__title">Task Cards</h2>
          <p className="tc-board__subtitle">
            Daily timeline of operational tasks — rows by status, columns by time of day.
          </p>
        </div>

        <div className="tc-datenav">
          <button
            type="button"
            className="tc-datenav__btn"
            onClick={() => setDay((d) => addDays(d, -1))}
            aria-label="Previous day"
          >
            ←
          </button>
          <span className="tc-datenav__label">{formatDay(day)}</span>
          <button
            type="button"
            className="tc-datenav__btn"
            onClick={() => setDay((d) => addDays(d, 1))}
            aria-label="Next day"
          >
            →
          </button>
          <button
            type="button"
            className={`tc-datenav__btn ${isToday ? 'is-today' : ''}`}
            onClick={() => setDay(today)}
          >
            Today
          </button>
        </div>

        <div className="tc-board__filters">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`tc-filter ${filter === f.id ? 'is-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tc-board__toolbar">
        <div className="tc-search">
          <span className="tc-search__icon" aria-hidden>🔎</span>
          <input
            type="search"
            className="tc-search__input"
            placeholder="Search by title, ID, assignee, related entity…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="tc-search__clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        <div className="tc-selectgroup">
          <label className="tc-select">
            <span className="tc-select__label">Region</span>
            <select
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setZone(ANY);
                setCluster(ANY);
              }}
            >
              <option value={ANY}>All regions</option>
              {regionOptions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>

          <label className="tc-select">
            <span className="tc-select__label">Zone</span>
            <select
              value={zone}
              onChange={(e) => {
                setZone(e.target.value);
                setCluster(ANY);
              }}
            >
              <option value={ANY}>All zones</option>
              {zoneOptions.map((z) => (
                <option key={z} value={z}>{z}</option>
              ))}
            </select>
          </label>

          <label className="tc-select">
            <span className="tc-select__label">Cluster</span>
            <select value={cluster} onChange={(e) => setCluster(e.target.value)}>
              <option value={ANY}>All clusters</option>
              {clusterOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>

          {hasActiveFilters && (
            <button type="button" className="tc-toolbar__clear" onClick={resetFilters}>
              Clear filters
            </button>
          )}
        </div>

        <span className="tc-toolbar__count">
          {filteredTasks.length} of {tasks.length} tasks
        </span>
      </div>

      <div className="tc-grid__scroll">
        <div className="tc-grid">
          {/* Header row: corner + time slots + unscheduled */}
          <div className="tc-grid__corner" />
          {TIME_SLOTS.map((slot) => (
            <div key={slot.id} className="tc-grid__time-head">
              <span className="tc-grid__time-head__range">
                {formatHour(slot.startHour)} – {formatHour(slot.endHour)}
              </span>
              <span className="tc-grid__time-head__label">{slot.label}</span>
            </div>
          ))}
          <div className="tc-grid__time-head">
            <span className="tc-grid__time-head__range">Unscheduled</span>
            <span className="tc-grid__time-head__label">No due time</span>
          </div>

          {/* Body rows: status label + cells */}
          {STATUS_ROWS.map((row) => (
            <StatusRow
              key={row.status}
              row={row}
              grid={grid}
              total={statusCounts[row.status]}
              onOpen={(t) => setSelectedId(t.id)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <TaskDetailsModal
          task={selected}
          actions={actionsFor(selected.id)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

// ---------- Row ----------

function StatusRow({
  row,
  grid,
  total,
  onOpen,
}: {
  row: { status: TaskStatus; title: string; color: string };
  grid: Record<TaskStatus, Record<string, Task[]>>;
  total: number;
  onOpen: (t: Task) => void;
}) {
  const cells = grid[row.status];
  return (
    <>
      <div className="tc-grid__status-head">
        <span className="tc-grid__status-head__dot" style={{ background: row.color }} />
        <span className="tc-grid__status-head__title">{row.title}</span>
        <span className="tc-grid__status-head__count">{total}</span>
      </div>
      {TIME_SLOTS.map((slot) => {
        const list = cells[slot.id];
        return (
          <Cell key={slot.id} tasks={list} onOpen={onOpen} />
        );
      })}
      <Cell tasks={cells[UNSCHEDULED_ID]} onOpen={onOpen} unscheduled />
    </>
  );
}

function Cell({
  tasks,
  onOpen,
  unscheduled,
}: {
  tasks: Task[];
  onOpen: (t: Task) => void;
  unscheduled?: boolean;
}) {
  const empty = tasks.length === 0;
  const classes = [
    'tc-grid__cell',
    empty ? 'is-empty' : '',
    unscheduled ? 'is-unscheduled' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div className={classes}>
      {empty ? (
        <span className="tc-cell__empty">—</span>
      ) : (
        tasks.map((t) => <TaskCard key={t.id} task={t} onOpen={() => onOpen(t)} />)
      )}
    </div>
  );
}
