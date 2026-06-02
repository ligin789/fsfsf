/**
 * Async thunks for the Geographical Management module.
 *
 * Uses @reduxjs/toolkit's createAsyncThunk (built on Redux Thunk middleware).
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { clusterService, regionService, zoneService } from '../services/geographicalService';
import type {
  ApiError,
  CreateOperatingClusterDTO,
  UpdateOperatingClusterDTO,
  ListClusterParams,
  CreateRegionDTO,
  UpdateRegionDTO,
  CreateOperatingZoneDTO,
  UpdateOperatingZoneDTO,
  PageQuery,
  OperatingClusterDTO,
  RegionDTO,
  OperatingZoneDTO,
} from './geographicalTypes';
import {
  mockRegions,
  mockZones,
  mockClusterPage,
  mockZonePage,
  newId,
} from '../data/mockGeographical';

/**
 * When the backend is unreachable (network / connection error) we fall back to
 * in-memory mock data so the UI stays usable for demos. Genuine HTTP errors
 * (4xx/5xx with a response) are still surfaced as real errors.
 */
const isOfflineError = (err: unknown): boolean =>
  axios.isAxiosError(err) && !err.response;

const extractError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<ApiError>;
    return (
      ax.response?.data?.error ||
      ax.message ||
      'Request failed'
    );
  }
  if (err instanceof Error) return err.message;
  return 'Unexpected error';
};

// ---------- Cluster thunks ----------
export const fetchClusters = createAsyncThunk(
  'geographical/fetchClusters',
  async (params: ListClusterParams | undefined, { rejectWithValue }) => {
    try {
      return await clusterService.list(params || {});
    } catch (err) {
      if (isOfflineError(err)) return mockClusterPage();
      return rejectWithValue(extractError(err));
    }
  },
);

export const createCluster = createAsyncThunk(
  'geographical/createCluster',
  async (payload: CreateOperatingClusterDTO, { rejectWithValue }) => {
    try {
      return await clusterService.create(payload);
    } catch (err) {
      if (isOfflineError(err)) {
        const local: OperatingClusterDTO = {
          ...payload,
          clusterId: newId('cl'),
          createdAt: new Date().toISOString(),
        };
        return local;
      }
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateCluster = createAsyncThunk(
  'geographical/updateCluster',
  async (payload: UpdateOperatingClusterDTO, { rejectWithValue }) => {
    try {
      return await clusterService.update(payload);
    } catch (err) {
      if (isOfflineError(err)) {
        return { ...payload, updatedAt: new Date().toISOString() } as OperatingClusterDTO;
      }
      return rejectWithValue(extractError(err));
    }
  },
);

export const deleteCluster = createAsyncThunk(
  'geographical/deleteCluster',
  async (id: string, { rejectWithValue }) => {
    try {
      await clusterService.remove(id);
      return id;
    } catch (err) {
      if (isOfflineError(err)) return id;
      return rejectWithValue(extractError(err));
    }
  },
);

// ---------- Region thunks ----------
export const fetchRegions = createAsyncThunk(
  'geographical/fetchRegions',
  async (_: void | undefined, { rejectWithValue }) => {
    try {
      return await regionService.list();
    } catch (err) {
      if (isOfflineError(err)) return mockRegions;
      return rejectWithValue(extractError(err));
    }
  },
);

export const createRegion = createAsyncThunk(
  'geographical/createRegion',
  async (payload: CreateRegionDTO, { rejectWithValue }) => {
    try {
      return await regionService.create(payload);
    } catch (err) {
      if (isOfflineError(err)) {
        const local: RegionDTO = {
          ...payload,
          regionId: newId('rg'),
          createdAt: new Date().toISOString(),
        };
        return local;
      }
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateRegion = createAsyncThunk(
  'geographical/updateRegion',
  async (payload: UpdateRegionDTO, { rejectWithValue }) => {
    try {
      return await regionService.update(payload);
    } catch (err) {
      if (isOfflineError(err)) {
        return { ...payload, updatedAt: new Date().toISOString() } as RegionDTO;
      }
      return rejectWithValue(extractError(err));
    }
  },
);

export const deleteRegion = createAsyncThunk(
  'geographical/deleteRegion',
  async (regionId: string, { rejectWithValue }) => {
    try {
      await regionService.remove(regionId);
      return regionId;
    } catch (err) {
      if (isOfflineError(err)) return regionId;
      return rejectWithValue(extractError(err));
    }
  },
);

// ---------- Zone thunks ----------
export const fetchZones = createAsyncThunk(
  'geographical/fetchZones',
  async (_: void | undefined, { rejectWithValue }) => {
    try {
      return await zoneService.list();
    } catch (err) {
      if (isOfflineError(err)) return mockZones;
      return rejectWithValue(extractError(err));
    }
  },
);

export const fetchZonesByRegion = createAsyncThunk(
  'geographical/fetchZonesByRegion',
  async (
    args: { regionId: string; params?: PageQuery },
    { rejectWithValue },
  ) => {
    try {
      return await zoneService.getByRegion(args.regionId, args.params || {});
    } catch (err) {
      if (isOfflineError(err)) {
        return mockZonePage(mockZones.filter((z) => z.regionId === args.regionId));
      }
      return rejectWithValue(extractError(err));
    }
  },
);

export const fetchZonesByCluster = createAsyncThunk(
  'geographical/fetchZonesByCluster',
  async (
    args: { clusterId: string; params?: PageQuery },
    { rejectWithValue },
  ) => {
    try {
      return await zoneService.getByCluster(args.clusterId, args.params || {});
    } catch (err) {
      if (isOfflineError(err)) {
        return mockZonePage(mockZones.filter((z) => z.clusterId === args.clusterId));
      }
      return rejectWithValue(extractError(err));
    }
  },
);

export const createZone = createAsyncThunk(
  'geographical/createZone',
  async (payload: CreateOperatingZoneDTO, { rejectWithValue }) => {
    try {
      return await zoneService.create(payload);
    } catch (err) {
      if (isOfflineError(err)) {
        const local: OperatingZoneDTO = {
          ...payload,
          zoneId: newId('zn'),
          createdAt: new Date().toISOString(),
        };
        return local;
      }
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateZone = createAsyncThunk(
  'geographical/updateZone',
  async (payload: UpdateOperatingZoneDTO, { rejectWithValue }) => {
    try {
      return await zoneService.update(payload);
    } catch (err) {
      if (isOfflineError(err)) {
        return { ...payload, updatedAt: new Date().toISOString() } as OperatingZoneDTO;
      }
      return rejectWithValue(extractError(err));
    }
  },
);

export const deleteZone = createAsyncThunk(
  'geographical/deleteZone',
  async (zoneId: string, { rejectWithValue }) => {
    try {
      await zoneService.remove(zoneId);
      return zoneId;
    } catch (err) {
      if (isOfflineError(err)) return zoneId;
      return rejectWithValue(extractError(err));
    }
  },
);
