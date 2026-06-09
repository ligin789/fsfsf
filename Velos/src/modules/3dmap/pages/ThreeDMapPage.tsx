import { useEffect, useState, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HiArrowsExpand, HiX } from 'react-icons/hi';
import CesiumViewer from '../components/CesiumViewer';
import ThreeDMapLoader from '../components/ThreeDMapLoader';
import useThreeDMap from '../hooks/useThreeDMap';

export default function ThreeDMapPage() {
  const { routes, vertiports, selectedFlightId, status, loadNetwork, selectFlight } = useThreeDMap();
  const [viewerReady, setViewerReady] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status === 'idle') loadNetwork();
  }, [status, loadNetwork]);

  // Sync state with browser fullscreen changes (e.g., user presses Esc).
  useEffect(() => {
    const onChange = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await wrapperRef.current?.requestFullscreen?.();
      } else {
        await document.exitFullscreen?.();
      }
    } catch {
      // Fallback for browsers/contexts that block the Fullscreen API.
      setFullscreen((v) => !v);
    }
  }, []);

  const dataReady = status === 'ready' && routes.length > 0;
  const handleReady = useCallback(() => setViewerReady(true), []);

  const wrapperStyle: React.CSSProperties = fullscreen
    ? { position: 'relative', width: '100vw', height: '100vh', background: '#050a14' }
    : { position: 'relative', width: '100%', height: 'calc(100vh - 140px)' };

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      {dataReady && (
        <CesiumViewer
          routes={routes}
          vertiports={vertiports}
          selectedFlightId={selectedFlightId}
          onSelectFlight={selectFlight}
          onReady={handleReady}
        />
      )}

      {/* Beautiful loader until both data + Cesium scene are ready */}
      <AnimatePresence>
        {(!dataReady || !viewerReady) && <ThreeDMapLoader key="loader" />}
      </AnimatePresence>

      {/* Fullscreen toggle */}
      {dataReady && viewerReady && (
        <button
          onClick={toggleFullscreen}
          title={fullscreen ? 'Exit fullscreen (Esc)' : 'Fullscreen'}
          style={{
            position: 'absolute',
            top: 72,
            right: 16,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 12px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(15,23,42,0.82)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {fullscreen ? <HiX size={16} /> : <HiArrowsExpand size={16} />}
          {fullscreen ? 'Exit' : 'Fullscreen'}
        </button>
      )}

      {/* Flight list overlay — driven by Redux state */}
      {dataReady && viewerReady && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 20,
            background: 'rgba(15,23,42,0.82)',
            color: '#fff',
            borderRadius: 12,
            padding: 14,
            width: 260,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>
            Live Flights ({routes.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {routes.map((r) => {
              const active = r.id === selectedFlightId;
              return (
                <button
                  key={r.id}
                  onClick={() => selectFlight(active ? null : r.id)}
                  style={{
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: 8,
                    border: `1px solid ${active ? '#60A5FA' : 'rgba(255,255,255,0.15)'}`,
                    background: active ? 'rgba(37,99,235,0.35)' : 'rgba(255,255,255,0.06)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  <div>{r.label}</div>
                  <div style={{ fontSize: 11, color: '#CBD5E1', marginTop: 2 }}>
                    {r.from.name.replace(' Vertiport', '')} → {r.to.name.replace(' Vertiport', '')}
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 10 }}>
            Click a flight to focus the camera, or click an aircraft in the scene.
          </div>
        </div>
      )}
    </div>
  );
}
