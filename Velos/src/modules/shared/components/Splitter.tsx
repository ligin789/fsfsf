/**
 * Draggable splitter handle (shared). `vertical` separates left/right columns
 * (col-resize); `horizontal` separates top/bottom rows (row-resize).
 *
 * Styling lives in each module's stylesheet under the `.pg-splitter` /
 * `.proc-splitter` classes; pass the class prefix via `variant`.
 */
interface SplitterProps {
  orientation: 'vertical' | 'horizontal';
  dragging: boolean;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  /** CSS class prefix, e.g. "pg" or "proc". Defaults to "pg". */
  variant?: string;
}

export default function Splitter({
  orientation,
  dragging,
  onPointerDown,
  variant = 'pg',
}: SplitterProps) {
  const base = `${variant}-splitter`;
  return (
    <div
      className={`${base} ${base}--${orientation} ${dragging ? `${base}--dragging` : ''}`}
      onPointerDown={onPointerDown}
      role="separator"
      aria-orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
    />
  );
}
