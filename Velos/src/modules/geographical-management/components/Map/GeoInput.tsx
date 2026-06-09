/**
 * GeoInput
 *
 * Dual-mode geometry entry for Cluster / Region / Zone.
 *   - "Draw on Map"   → the existing interactive GeoMap (plot polygons)
 *   - "Paste GeoJSON" → a text box where users paste GeoJSON (or WKT). The
 *                        geometry is parsed, validated, and previewed on a
 *                        read-only map so non-mappers can still contribute.
 *
 * Drop-in replacement for GeoMap: same `value` / `onChange` contract.
 */
import { useEffect, useMemo, useState } from 'react';
import GeoMap from './GeoMap';
import {
  emptyFeatureCollection,
  featureCollectionToGeoJSONString,
  parseGeometryInput,
  type GeoFeatureCollection,
} from '../../utils/geojsonUtils';

interface Props {
  value: GeoFeatureCollection;
  onChange: (fc: GeoFeatureCollection) => void;
  readOnly?: boolean;
  height?: number;
}

type InputMode = 'map' | 'paste';

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 16px',
  fontSize: 13,
  fontWeight: 700,
  cursor: 'pointer',
  color: active ? 'var(--app-primary)' : 'var(--app-text-subtle)',
  borderBottom: active ? '2px solid var(--app-primary)' : '2px solid transparent',
  marginBottom: -1,
  background: 'transparent',
  border: 'none',
  borderBottomWidth: 2,
  borderBottomStyle: 'solid',
});

const SAMPLE = `{
  "type": "Polygon",
  "coordinates": [[
    [77.55, 12.95],
    [77.65, 12.95],
    [77.65, 13.05],
    [77.55, 13.05],
    [77.55, 12.95]
  ]]
}`;

export default function GeoInput({ value, onChange, readOnly = false, height = 360 }: Props) {
  const [mode, setMode] = useState<InputMode>('map');
  const [text, setText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  // When switching INTO paste mode, seed the textarea with the current geometry.
  useEffect(() => {
    if (mode === 'paste') {
      setText(featureCollectionToGeoJSONString(value));
      setError(null);
      setApplied(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const hasGeometry = useMemo(() => (value?.features?.length ?? 0) > 0, [value]);

  const handleApply = () => {
    const { fc, error: parseError } = parseGeometryInput(text);
    if (parseError) {
      setError(parseError);
      setApplied(false);
      return;
    }
    setError(null);
    setApplied(true);
    onChange(fc);
  };

  const handleClear = () => {
    setText('');
    setError(null);
    setApplied(false);
    onChange(emptyFeatureCollection());
  };

  return (
    <div>
      {/* Mode tabs */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          borderBottom: '1px solid var(--app-border)',
          marginBottom: 12,
        }}
      >
        <button type="button" style={tabStyle(mode === 'map')} onClick={() => setMode('map')}>
          Draw on Map
        </button>
        <button type="button" style={tabStyle(mode === 'paste')} onClick={() => setMode('paste')}>
          Paste GeoJSON
        </button>
      </div>

      {mode === 'map' && (
        <GeoMap value={value} onChange={onChange} readOnly={readOnly} height={height} />
      )}

      {mode === 'paste' && (
        <div>
          <div style={{ fontSize: 12, color: 'var(--app-text-subtle)', marginBottom: 6 }}>
            Paste GeoJSON (<code>Polygon</code>, <code>MultiPolygon</code>, <code>Feature</code>, or{' '}
            <code>FeatureCollection</code>) or a WKT string. It will be validated and previewed below.
          </div>
          <textarea
            style={{
              width: '100%',
              minHeight: 150,
              padding: 12,
              border: `1px solid ${error ? '#FCA5A5' : 'var(--app-border)'}`,
              borderRadius: 10,
              fontSize: 12,
              fontFamily: 'monospace',
              color: 'var(--app-text-strong)',
              background: readOnly ? 'var(--app-surface-subtle)' : 'var(--app-surface)',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
            value={text}
            placeholder={SAMPLE}
            readOnly={readOnly}
            onChange={(e) => {
              setText(e.target.value);
              setApplied(false);
            }}
          />

          {error && (
            <div
              style={{
                marginTop: 8,
                background: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: '#B91C1C',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}
          {applied && !error && (
            <div
              style={{
                marginTop: 8,
                background: '#DCFCE7',
                border: '1px solid #86EFAC',
                color: '#166534',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Geometry applied and previewed below.
            </div>
          )}

          {!readOnly && (
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button
                type="button"
                onClick={handleApply}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--app-primary)',
                  background: 'var(--app-primary)',
                  color: '#FFFFFF',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Validate & Apply
              </button>
              <button
                type="button"
                onClick={handleClear}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: '1px solid var(--app-border)',
                  background: 'var(--app-surface)',
                  color: 'var(--app-text)',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Clear
              </button>
            </div>
          )}

          {/* Read-only preview of whatever geometry is currently applied */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--app-text-muted)', marginBottom: 6 }}>
              Preview {hasGeometry ? '' : '(no geometry yet)'}
            </div>
            <GeoMap value={value} onChange={() => {}} readOnly height={height} />
          </div>
        </div>
      )}
    </div>
  );
}
