/**
 * Reducer slice for the Geographical Management module.
 * Owns: clusters, regions, zones (data + loading + error + success).
 */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { GeographicalState } from './geographicalTypes';
import {
  fetchClusters,
  createCluster,
  updateCluster,
  deleteCluster,
  fetchRegions,
  createRegion,
  updateRegion,
  deleteRegion,
  fetchZones,
  fetchZonesByRegion,
  fetchZonesByCluster,
  createZone,
  updateZone,
  deleteZone,
} from './geographicalActions';

const initialState: GeographicalState = {
  clusters: { items: [], page: null, loading: false, error: null, success: null },
  regions: { items: [], loading: false, error: null, success: null },
  zones: { items: [], page: null, loading: false, error: null, success: null },
};

const geographicalSlice = createSlice({
  name: 'geographical',
  initialState,
  reducers: {
    clearClusterFeedback(state) {
      state.clusters.error = null;
      state.clusters.success = null;
    },
    clearRegionFeedback(state) {
      state.regions.error = null;
      state.regions.success = null;
    },
    clearZoneFeedback(state) {
      state.zones.error = null;
      state.zones.success = null;
    },
    clearAllFeedback(state) {
      state.clusters.error = null;
      state.clusters.success = null;
      state.regions.error = null;
      state.regions.success = null;
      state.zones.error = null;
      state.zones.success = null;
    },
  },
  extraReducers: (builder) => {
    // ---------- Clusters ----------
    builder
      .addCase(fetchClusters.pending, (state) => {
        state.clusters.loading = true;
        state.clusters.error = null;
      })
      .addCase(fetchClusters.fulfilled, (state, action) => {
        state.clusters.loading = false;
        state.clusters.page = action.payload;
        state.clusters.items = action.payload?.content ?? [];
      })
      .addCase(fetchClusters.rejected, (state, action) => {
        state.clusters.loading = false;
        state.clusters.error = (action.payload as string) || action.error.message || 'Failed to fetch clusters';
      })

      .addCase(createCluster.pending, (state) => {
        state.clusters.loading = true;
        state.clusters.error = null;
        state.clusters.success = null;
      })
      .addCase(createCluster.fulfilled, (state, action) => {
        state.clusters.loading = false;
        state.clusters.items = [action.payload, ...state.clusters.items];
        state.clusters.success = 'Cluster created successfully';
      })
      .addCase(createCluster.rejected, (state, action) => {
        state.clusters.loading = false;
        state.clusters.error = (action.payload as string) || action.error.message || 'Failed to create cluster';
      })

      .addCase(updateCluster.pending, (state) => {
        state.clusters.loading = true;
        state.clusters.error = null;
        state.clusters.success = null;
      })
      .addCase(updateCluster.fulfilled, (state, action) => {
        state.clusters.loading = false;
        state.clusters.items = state.clusters.items.map((c) =>
          c.clusterId === action.payload.clusterId ? action.payload : c,
        );
        state.clusters.success = 'Cluster updated successfully';
      })
      .addCase(updateCluster.rejected, (state, action) => {
        state.clusters.loading = false;
        state.clusters.error = (action.payload as string) || action.error.message || 'Failed to update cluster';
      })

      .addCase(deleteCluster.pending, (state) => {
        state.clusters.loading = true;
        state.clusters.error = null;
        state.clusters.success = null;
      })
      .addCase(deleteCluster.fulfilled, (state, action: PayloadAction<string>) => {
        state.clusters.loading = false;
        state.clusters.items = state.clusters.items.filter((c) => c.clusterId !== action.payload);
        state.clusters.success = 'Cluster deleted successfully';
      })
      .addCase(deleteCluster.rejected, (state, action) => {
        state.clusters.loading = false;
        state.clusters.error = (action.payload as string) || action.error.message || 'Failed to delete cluster';
      });

    // ---------- Regions ----------
    builder
      .addCase(fetchRegions.pending, (state) => {
        state.regions.loading = true;
        state.regions.error = null;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.regions.loading = false;
        state.regions.items = action.payload || [];
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.regions.loading = false;
        state.regions.error = (action.payload as string) || action.error.message || 'Failed to fetch regions';
      })

      .addCase(createRegion.pending, (state) => {
        state.regions.loading = true;
        state.regions.error = null;
        state.regions.success = null;
      })
      .addCase(createRegion.fulfilled, (state, action) => {
        state.regions.loading = false;
        state.regions.items = [action.payload, ...state.regions.items];
        state.regions.success = 'Region created successfully';
      })
      .addCase(createRegion.rejected, (state, action) => {
        state.regions.loading = false;
        state.regions.error = (action.payload as string) || action.error.message || 'Failed to create region';
      })

      .addCase(updateRegion.pending, (state) => {
        state.regions.loading = true;
        state.regions.error = null;
        state.regions.success = null;
      })
      .addCase(updateRegion.fulfilled, (state, action) => {
        state.regions.loading = false;
        state.regions.items = state.regions.items.map((r) =>
          r.regionId === action.payload.regionId ? action.payload : r,
        );
        state.regions.success = 'Region updated successfully';
      })
      .addCase(updateRegion.rejected, (state, action) => {
        state.regions.loading = false;
        state.regions.error = (action.payload as string) || action.error.message || 'Failed to update region';
      })

      .addCase(deleteRegion.pending, (state) => {
        state.regions.loading = true;
        state.regions.error = null;
        state.regions.success = null;
      })
      .addCase(deleteRegion.fulfilled, (state, action: PayloadAction<string>) => {
        state.regions.loading = false;
        state.regions.items = state.regions.items.filter((r) => r.regionId !== action.payload);
        state.regions.success = 'Region deleted successfully';
      })
      .addCase(deleteRegion.rejected, (state, action) => {
        state.regions.loading = false;
        state.regions.error = (action.payload as string) || action.error.message || 'Failed to delete region';
      });

    // ---------- Zones ----------
    builder
      .addCase(fetchZones.pending, (state) => {
        state.zones.loading = true;
        state.zones.error = null;
      })
      .addCase(fetchZones.fulfilled, (state, action) => {
        state.zones.loading = false;
        state.zones.items = action.payload || [];
        state.zones.page = null;
      })
      .addCase(fetchZones.rejected, (state, action) => {
        state.zones.loading = false;
        state.zones.error = (action.payload as string) || action.error.message || 'Failed to fetch zones';
      })

      .addCase(fetchZonesByRegion.pending, (state) => {
        state.zones.loading = true;
        state.zones.error = null;
      })
      .addCase(fetchZonesByRegion.fulfilled, (state, action) => {
        state.zones.loading = false;
        state.zones.page = action.payload;
        state.zones.items = action.payload?.content ?? [];
      })
      .addCase(fetchZonesByRegion.rejected, (state, action) => {
        state.zones.loading = false;
        state.zones.error = (action.payload as string) || action.error.message || 'Failed to fetch zones';
      })

      .addCase(fetchZonesByCluster.pending, (state) => {
        state.zones.loading = true;
        state.zones.error = null;
      })
      .addCase(fetchZonesByCluster.fulfilled, (state, action) => {
        state.zones.loading = false;
        state.zones.page = action.payload;
        state.zones.items = action.payload?.content ?? [];
      })
      .addCase(fetchZonesByCluster.rejected, (state, action) => {
        state.zones.loading = false;
        state.zones.error = (action.payload as string) || action.error.message || 'Failed to fetch zones';
      })

      .addCase(createZone.pending, (state) => {
        state.zones.loading = true;
        state.zones.error = null;
        state.zones.success = null;
      })
      .addCase(createZone.fulfilled, (state, action) => {
        state.zones.loading = false;
        state.zones.items = [action.payload, ...state.zones.items];
        state.zones.success = 'Zone created successfully';
      })
      .addCase(createZone.rejected, (state, action) => {
        state.zones.loading = false;
        state.zones.error = (action.payload as string) || action.error.message || 'Failed to create zone';
      })

      .addCase(updateZone.pending, (state) => {
        state.zones.loading = true;
        state.zones.error = null;
        state.zones.success = null;
      })
      .addCase(updateZone.fulfilled, (state, action) => {
        state.zones.loading = false;
        state.zones.items = state.zones.items.map((z) =>
          z.zoneId === action.payload.zoneId ? action.payload : z,
        );
        state.zones.success = 'Zone updated successfully';
      })
      .addCase(updateZone.rejected, (state, action) => {
        state.zones.loading = false;
        state.zones.error = (action.payload as string) || action.error.message || 'Failed to update zone';
      })

      .addCase(deleteZone.pending, (state) => {
        state.zones.loading = true;
        state.zones.error = null;
        state.zones.success = null;
      })
      .addCase(deleteZone.fulfilled, (state, action: PayloadAction<string>) => {
        state.zones.loading = false;
        state.zones.items = state.zones.items.filter((z) => z.zoneId !== action.payload);
        state.zones.success = 'Zone deleted successfully';
      })
      .addCase(deleteZone.rejected, (state, action) => {
        state.zones.loading = false;
        state.zones.error = (action.payload as string) || action.error.message || 'Failed to delete zone';
      });
  },
});

export const {
  clearClusterFeedback,
  clearRegionFeedback,
  clearZoneFeedback,
  clearAllFeedback,
} = geographicalSlice.actions;

export default geographicalSlice.reducer;
