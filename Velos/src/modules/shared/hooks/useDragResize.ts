/**
 * Small pointer-driven resize hook for draggable splitters. Shared by the
 * process-groups and processes modules.
 *
 * Returns the current size plus a pointer-down handler to attach to a splitter
 * handle. Uses pointer capture so the drag keeps tracking even when the cursor
 * passes over the React Flow canvas or an iframe.
 */
import { useCallback, useRef, useState } from 'react';

export type ResizeAxis = 'x' | 'y';

interface UseDragResizeOptions {
  axis: ResizeAxis;
  initial: number;
  min: number;
  max: number;
  /**
   * When true, dragging toward the negative axis direction grows the size —
   * e.g. a handle on the left edge of a right-docked panel.
   */
  invert?: boolean;
}

export function useDragResize({ axis, initial, min, max, invert = false }: UseDragResizeOptions) {
  const [size, setSize] = useState(initial);
  const [dragging, setDragging] = useState(false);
  const startRef = useRef({ pos: 0, size: initial });

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      // Pointer capture keeps the drag tracking over the canvas/iframe; it can
      // throw if the pointer is already released, so it must not abort the drag.
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // ignore — fall back to the window listeners below
      }
      startRef.current = { pos: axis === 'x' ? e.clientX : e.clientY, size };
      setDragging(true);

      const handleMove = (ev: PointerEvent) => {
        const current = axis === 'x' ? ev.clientX : ev.clientY;
        let delta = current - startRef.current.pos;
        if (invert) delta = -delta;
        setSize(Math.min(max, Math.max(min, startRef.current.size + delta)));
      };
      const handleUp = () => {
        setDragging(false);
        window.removeEventListener('pointermove', handleMove);
        window.removeEventListener('pointerup', handleUp);
      };
      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    },
    [axis, size, min, max, invert],
  );

  return { size, dragging, onPointerDown };
}
