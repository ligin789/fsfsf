import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store/store';
import { loadFlightNetwork } from '../store/threeDMapActions';
import { setSelectedFlight, clearSelectedFlight } from '../store/threeDMapReducer';

export const useThreeDMap = () => {
  const dispatch = useDispatch<AppDispatch>();
  const threeDMap = useSelector((s: RootState) => s.threeDMap);

  const loadNetwork = useCallback(() => dispatch(loadFlightNetwork()), [dispatch]);
  const selectFlight = useCallback(
    (id: string | null) => dispatch(setSelectedFlight(id)),
    [dispatch],
  );
  const clearFlight = useCallback(() => dispatch(clearSelectedFlight()), [dispatch]);

  return {
    routes: threeDMap.routes,
    vertiports: threeDMap.vertiports,
    selectedFlightId: threeDMap.selectedFlightId,
    status: threeDMap.status,
    error: threeDMap.error,
    loadNetwork,
    selectFlight,
    clearFlight,
  };
};

export default useThreeDMap;
