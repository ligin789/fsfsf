import { Map2D } from '../../modules/2d-map';

export default function MapView() {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 140px)' }}>
      <Map2D />
    </div>
  );
}
