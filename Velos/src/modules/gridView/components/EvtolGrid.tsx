import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  ModuleRegistry,
  AllCommunityModule,
  themeQuartz,
  type ColDef,
  type ColGroupDef,
} from 'ag-grid-community';
import { evtolFlights, type EvtolFlight } from '../data/evtolData';
import { useTheme } from '../../../contexts/ThemeContext';
import './evtol-grid.scss';

ModuleRegistry.registerModules([AllCommunityModule]);

const lightTheme = themeQuartz.withParams({
  headerBackgroundColor: '#0B1F4D',
  headerTextColor: '#FFFFFF',
  headerFontWeight: 600,
  foregroundColor: '#0F172A',
  borderColor: '#E2E8F0',
});

const darkTheme = themeQuartz.withParams({
  headerBackgroundColor: '#0B1F4D',
  headerTextColor: '#FFFFFF',
  headerFontWeight: 600,
  backgroundColor: '#1A2332',
  foregroundColor: '#E2E8F0',
  borderColor: 'rgba(255, 255, 255, 0.10)',
  chromeBackgroundColor: '#111827',
});

export default function EvtolGrid() {
  const { theme: appTheme } = useTheme();
  const theme = appTheme === 'dark' ? darkTheme : lightTheme;
  const columnDefs = useMemo<(ColDef<EvtolFlight> | ColGroupDef<EvtolFlight>)[]>(
    () => [
      {
        headerName: 'Aircraft',
        headerClass: 'evtol-grid__group-header',
        children: [
          { field: 'flightId',   headerName: 'Flight ID', pinned: 'left', width: 120 },
          { field: 'tailNumber', headerName: 'Tail #',    width: 110 },
          { field: 'model',      headerName: 'Model',     width: 160 },
          { field: 'operator',   headerName: 'Operator',  width: 150 },
        ],
      },
      {
        headerName: 'Route',
        headerClass: 'evtol-grid__group-header',
        children: [
          { field: 'origin',      headerName: 'Origin',      width: 170 },
          { field: 'destination', headerName: 'Destination', width: 170 },
          { field: 'status',      headerName: 'Status',      width: 120 },
        ],
      },
      {
        headerName: 'Schedule',
        headerClass: 'evtol-grid__group-header',
        children: [
          { field: 'departure', headerName: 'Departure', width: 170 },
          { field: 'arrival',   headerName: 'Arrival',   width: 170 },
        ],
      },
      {
        headerName: 'Telemetry',
        headerClass: 'evtol-grid__group-header',
        children: [
          { field: 'altitudeFt', headerName: 'Alt (ft)',    width: 110, type: 'numericColumn' },
          { field: 'speedKts',   headerName: 'Speed (kts)', width: 120, type: 'numericColumn' },
          { field: 'batteryPct', headerName: 'Battery %',   width: 120, type: 'numericColumn' },
        ],
      },
      {
        headerName: 'Cargo & Crew',
        headerClass: 'evtol-grid__group-header',
        children: [
          { field: 'payloadKg', headerName: 'Payload (kg)', width: 130, type: 'numericColumn' },
          { field: 'pilot',     headerName: 'Pilot',        width: 130 },
        ],
      },
    ],
    [],
  );

  const defaultColDef = useMemo<ColDef>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    [],
  );

  return (
    <div className="evtol-grid" style={{ width: '100%', height: 'calc(100vh - 160px)' }}>
      <AgGridReact<EvtolFlight>
        theme={theme}
        rowData={evtolFlights}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
        getRowClass={(params) =>
          params.node.rowIndex !== null && params.node.rowIndex % 2 === 0
            ? 'evtol-grid__row-even'
            : 'evtol-grid__row-odd'
        }
      />
    </div>
  );
}
