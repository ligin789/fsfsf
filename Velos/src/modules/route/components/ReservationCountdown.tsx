import { useEffect, useState } from 'react';
import { pill } from './uiStyles';

interface Props {
  expiresAt?: string;
}

export default function ReservationCountdown({ expiresAt }: Props) {
  const [remaining, setRemaining] = useState<number>(() =>
    expiresAt ? new Date(expiresAt).getTime() - Date.now() : 0,
  );

  useEffect(() => {
    if (!expiresAt) return;
    const t = setInterval(() => {
      setRemaining(new Date(expiresAt).getTime() - Date.now());
    }, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);

  if (!expiresAt) return null;
  if (remaining <= 0) return <span style={pill('#9F1239', '#FFE4E6')}>EXPIRED</span>;

  const mm = Math.floor(remaining / 60_000);
  const ss = Math.floor((remaining % 60_000) / 1000);
  const tone = remaining < 60_000 ? pill('#9F1239', '#FFE4E6') : pill('#92400E', '#FEF3C7');
  return (
    <span style={tone}>
      ⏱ {mm}:{ss.toString().padStart(2, '0')}
    </span>
  );
}
