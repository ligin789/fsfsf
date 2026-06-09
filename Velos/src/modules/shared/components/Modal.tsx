/**
 * Lightweight modal (shared). Overlay + centered dialog, closes on backdrop
 * click or Escape. Themed via --app-* vars (classes under `.vmodal`).
 */
import { useEffect } from 'react';
import './modal.css';

interface ModalProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}

export default function Modal({ title, onClose, children, footer, width = 560 }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="vmodal__overlay" onClick={onClose} role="presentation">
      <div
        className="vmodal__dialog"
        style={{ maxWidth: width }}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="vmodal__header">
            <h2 className="vmodal__title">{title}</h2>
            <button type="button" className="vmodal__close" onClick={onClose} aria-label="Close">
              ×
            </button>
          </div>
        )}
        <div className="vmodal__body">{children}</div>
        {footer && <div className="vmodal__footer">{footer}</div>}
      </div>
    </div>
  );
}
