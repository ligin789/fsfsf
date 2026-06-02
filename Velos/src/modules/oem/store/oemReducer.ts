/**
 * Reducer slice for the OEM Onboarding module.
 * Owns: OEM masters (list), and per-OEM contacts / aircraft types /
 * battery profiles.
 *
 * Mutations are applied optimistically on the thunk `pending` phase so the
 * UI stays interactive against seeded sample data without a live backend.
 */
import { createSlice } from '@reduxjs/toolkit';
import type {
  OemState,
  MasterDto,
  ContactDto,
  AircraftTypeDto,
  AircraftBatteryProfileDto,
} from './oemTypes';
import {
  fetchMasters,
  createMaster,
  updateMaster,
  deleteMaster,
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
  fetchAircraftTypes,
  createAircraftType,
  updateAircraftType,
  deleteAircraftType,
  fetchBatteryProfiles,
  createBatteryProfile,
  updateBatteryProfile,
  deleteBatteryProfile,
} from './oemActions';

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;

const PARTNER_A = 'a1b2c3d4-0001-4000-8000-000000000001';
const OEM_JOBY = '22222222-0000-4000-8000-000000000001';
const OEM_VOLO = '22222222-0000-4000-8000-000000000002';
const OEM_ARCHER = '22222222-0000-4000-8000-000000000003';
const TYPE_JOBY_S4 = '33333333-0000-4000-8000-000000000001';

const sampleMasters: MasterDto[] = [
  {
    oemId: OEM_JOBY,
    oemCode: 'JOBY',
    partnerId: PARTNER_A,
    oemName: 'Joby Aviation, Inc.',
    legalEntityType: 'CORPORATION',
    registrationNumber: 'US-DE-5512348',
    registrationCountry: 'United States',
    registration_date: '2015-02-10',
    websiteUrl: 'https://www.jobyaviation.com',
    oemStatus: 'ACTIVE',
    notes: 'Lead eVTOL partner for North America corridor.',
    createdAt: '2025-08-01T10:00:00Z',
  },
  {
    oemId: OEM_VOLO,
    oemCode: 'VOLO',
    partnerId: PARTNER_A,
    oemName: 'Volocopter GmbH',
    legalEntityType: 'LLC',
    registrationNumber: 'DE-HRB-728401',
    registrationCountry: 'Germany',
    registration_date: '2011-11-04',
    websiteUrl: 'https://www.volocopter.com',
    oemStatus: 'ACTIVE',
    notes: 'Multirotor air-taxi supplier for EU pilots.',
    createdAt: '2025-09-15T09:30:00Z',
  },
  {
    oemId: OEM_ARCHER,
    oemCode: 'ARCHER',
    partnerId: PARTNER_A,
    oemName: 'Archer Aviation Inc.',
    legalEntityType: 'CORPORATION',
    registrationNumber: 'US-DE-7790123',
    registrationCountry: 'United States',
    registration_date: '2018-10-22',
    websiteUrl: 'https://www.archer.com',
    oemStatus: 'PENDING',
    notes: 'Onboarding in progress — TC documentation pending.',
    createdAt: '2026-02-01T08:00:00Z',
  },
];

const sampleContacts: Record<string, ContactDto[]> = {
  [OEM_JOBY]: [
    {
      oemContactId: uid(),
      partnerId: PARTNER_A,
      contactRole: 'PRIMARY',
      fullName: 'Dana Pope',
      jobTitle: 'Director of Partnerships',
      email: 'd.pope@jobyaviation.com',
      phonePrimary: '+1-831-555-0142',
      is247Available: false,
      isPrimaryContact: true,
      preferredChannel: 'EMAIL',
      timezone: 'America/Los_Angeles',
      contactStatus: 'ACTIVE',
    },
  ],
};

const sampleTypes: Record<string, AircraftTypeDto[]> = {
  [OEM_JOBY]: [
    {
      typeId: TYPE_JOBY_S4,
      partnerId: PARTNER_A,
      manufacturer: OEM_JOBY,
      typeCode: 'JOBY-S4',
      modelName: 'Joby S4',
      certificationBasis: 'FAA_AC21_37',
      airworthinessCategory: 'ENHANCED',
      operationalCategory: 'COMMERCIAL_TRANSPORT',
      uamClass: 'UAM_PASSENGER',
      propulsionType: 'FULL_ELECTRIC',
      vtolTopology: 'TILTROTOR',
      rotorCount: 6,
      motorCount: 6,
      oeiCapable: true,
      vtolToFixedTransition: true,
      mtowKg: 2177,
      oweKg: 1542,
      maxPayloadKg: 453,
      maxPassengerCount: 4,
      pilotRequired: true,
      pilotSeats: 1,
      standardPaxWeightKg: 90,
      vneKts: 200,
      vmoKts: 165,
      cruiseSpeedKts: 165,
      maxWindKts: 30,
      maxCrosswindKts: 20,
      maxTailwindKts: 10,
      maxDensityAltitudeFt: 6000,
      ceilingFt: 15000,
      maxRangeNm: 130,
      typicalRangeNm: 100,
      noiseClass: 'QUIET_URBAN',
      minTempOpsC: -20,
      maxTempOpsC: 45,
      status: 'ACTIVE',
    },
  ],
};

const sampleBatteries: Record<string, AircraftBatteryProfileDto[]> = {
  [OEM_JOBY]: [
    {
      batterySpecId: uid(),
      typeId: TYPE_JOBY_S4,
      manufacturer: OEM_JOBY,
      partnerId: PARTNER_A,
      typeCode: 'JOBY-S4',
      specCode: 'S4-PRI-01',
      specName: 'S4 Primary Pack',
      packRole: 'PRIMARY',
      cellChemistry: 'LI_ION_NMC',
      nominalVoltageV: 800,
      usableCapacityKwh: 150,
      grossCapacityKwh: 165,
      minSocPct: 10,
      maxSocPct: 100,
      reserveSocPct: 20,
      contingencySocPct: 15,
      dispatchMinSocPct: 30,
      maxChargeRateKw: 320,
      maxChargeCRate: 2,
      chargeProtocol: 'MULTI_STAGE',
      chargingStandard: 'CCS2-Aviation',
      regenBrakingCapable: false,
      minChargeTempC: 0,
      maxChargeTempC: 45,
      minDischargeTempC: -20,
      maxDischargeTempC: 55,
      thermalRunawayTempC: 150,
      activeThermalMgmt: true,
      designCycleLife: 1500,
      sohRemovalThresholdPct: 80,
      packWeightKg: 540,
      effectiveFrom: '2025-01-01',
      isCurrent: true,
    },
  ],
};

const initialState: OemState = {
  masters: { items: sampleMasters, loading: false, error: null, success: null },
  contacts: { byOem: sampleContacts, loading: false, error: null, success: null },
  aircraftTypes: {
    byOem: sampleTypes,
    loading: false,
    error: null,
    success: null,
  },
  batteryProfiles: {
    byOem: sampleBatteries,
    loading: false,
    error: null,
    success: null,
  },
};

const oemSlice = createSlice({
  name: 'oem',
  initialState,
  reducers: {
    clearMasterFeedback(state) {
      state.masters.error = null;
      state.masters.success = null;
    },
    clearContactFeedback(state) {
      state.contacts.error = null;
      state.contacts.success = null;
    },
    clearTypeFeedback(state) {
      state.aircraftTypes.error = null;
      state.aircraftTypes.success = null;
    },
    clearBatteryFeedback(state) {
      state.batteryProfiles.error = null;
      state.batteryProfiles.success = null;
    },
  },
  extraReducers: (builder) => {
    // ---------- Masters ----------
    builder
      .addCase(fetchMasters.pending, (state) => {
        state.masters.loading = true;
        state.masters.error = null;
      })
      .addCase(fetchMasters.fulfilled, (state, action) => {
        state.masters.loading = false;
        if (action.payload?.content?.length) {
          state.masters.items = action.payload.content;
        }
      })
      .addCase(fetchMasters.rejected, (state) => {
        state.masters.loading = false;
      })
      .addCase(createMaster.pending, (state, action) => {
        state.masters.error = null;
        state.masters.success = null;
        const item: MasterDto = {
          ...action.meta.arg,
          oemId: uid(),
          createdAt: new Date().toISOString(),
        };
        state.masters.items = [item, ...state.masters.items];
        state.masters.success = 'OEM onboarded successfully';
      })
      .addCase(updateMaster.pending, (state, action) => {
        state.masters.error = null;
        state.masters.success = null;
        const { oemId, payload } = action.meta.arg;
        state.masters.items = state.masters.items.map((m) =>
          m.oemId === oemId
            ? { ...m, ...payload, oemId, updatedAt: new Date().toISOString() }
            : m,
        );
        state.masters.success = 'OEM updated successfully';
      })
      .addCase(deleteMaster.pending, (state, action) => {
        state.masters.items = state.masters.items.filter(
          (m) => m.oemId !== action.meta.arg,
        );
        state.masters.success = 'OEM removed';
      });

    // ---------- Contacts ----------
    builder
      .addCase(fetchContacts.fulfilled, (state, action) => {
        const { oemId, items } = action.payload;
        if (items.length && !state.contacts.byOem[oemId]) {
          state.contacts.byOem[oemId] = items;
        }
      })
      .addCase(createContact.pending, (state, action) => {
        state.contacts.error = null;
        state.contacts.success = null;
        const { oemId, payload } = action.meta.arg;
        const item: ContactDto = { ...payload, oemContactId: uid() };
        state.contacts.byOem[oemId] = [
          ...(state.contacts.byOem[oemId] ?? []),
          item,
        ];
        state.contacts.success = 'Contact added';
      })
      .addCase(updateContact.pending, (state, action) => {
        state.contacts.error = null;
        state.contacts.success = null;
        const { oemId, contactId, payload } = action.meta.arg;
        state.contacts.byOem[oemId] = (state.contacts.byOem[oemId] ?? []).map(
          (c) => (c.oemContactId === contactId ? { ...c, ...payload } : c),
        );
        state.contacts.success = 'Contact updated';
      })
      .addCase(deleteContact.pending, (state, action) => {
        const { oemId, contactId } = action.meta.arg;
        state.contacts.byOem[oemId] = (
          state.contacts.byOem[oemId] ?? []
        ).filter((c) => c.oemContactId !== contactId);
        state.contacts.success = 'Contact removed';
      });

    // ---------- Aircraft Types ----------
    builder
      .addCase(fetchAircraftTypes.fulfilled, (state, action) => {
        const { oemId, items } = action.payload;
        if (items.length && !state.aircraftTypes.byOem[oemId]) {
          state.aircraftTypes.byOem[oemId] = items;
        }
      })
      .addCase(createAircraftType.pending, (state, action) => {
        state.aircraftTypes.error = null;
        state.aircraftTypes.success = null;
        const { oemId, payload } = action.meta.arg;
        const item: AircraftTypeDto = { ...payload, typeId: uid() };
        state.aircraftTypes.byOem[oemId] = [
          ...(state.aircraftTypes.byOem[oemId] ?? []),
          item,
        ];
        state.aircraftTypes.success = 'Aircraft type added';
      })
      .addCase(updateAircraftType.pending, (state, action) => {
        state.aircraftTypes.error = null;
        state.aircraftTypes.success = null;
        const { oemId, typeId, payload } = action.meta.arg;
        state.aircraftTypes.byOem[oemId] = (
          state.aircraftTypes.byOem[oemId] ?? []
        ).map((t) => (t.typeId === typeId ? { ...t, ...payload } : t));
        state.aircraftTypes.success = 'Aircraft type updated';
      })
      .addCase(deleteAircraftType.pending, (state, action) => {
        const { oemId, typeId } = action.meta.arg;
        state.aircraftTypes.byOem[oemId] = (
          state.aircraftTypes.byOem[oemId] ?? []
        ).filter((t) => t.typeId !== typeId);
        state.aircraftTypes.success = 'Aircraft type removed';
      });

    // ---------- Battery Profiles ----------
    builder
      .addCase(fetchBatteryProfiles.fulfilled, (state, action) => {
        const { oemId, items } = action.payload;
        if (items.length && !state.batteryProfiles.byOem[oemId]) {
          state.batteryProfiles.byOem[oemId] = items;
        }
      })
      .addCase(createBatteryProfile.pending, (state, action) => {
        state.batteryProfiles.error = null;
        state.batteryProfiles.success = null;
        const { oemId, payload } = action.meta.arg;
        const item: AircraftBatteryProfileDto = {
          ...payload,
          batterySpecId: uid(),
        };
        state.batteryProfiles.byOem[oemId] = [
          ...(state.batteryProfiles.byOem[oemId] ?? []),
          item,
        ];
        state.batteryProfiles.success = 'Battery profile added';
      })
      .addCase(updateBatteryProfile.pending, (state, action) => {
        state.batteryProfiles.error = null;
        state.batteryProfiles.success = null;
        const { oemId, batterySpecId, payload } = action.meta.arg;
        state.batteryProfiles.byOem[oemId] = (
          state.batteryProfiles.byOem[oemId] ?? []
        ).map((b) =>
          b.batterySpecId === batterySpecId ? { ...b, ...payload } : b,
        );
        state.batteryProfiles.success = 'Battery profile updated';
      })
      .addCase(deleteBatteryProfile.pending, (state, action) => {
        const { oemId, batterySpecId } = action.meta.arg;
        state.batteryProfiles.byOem[oemId] = (
          state.batteryProfiles.byOem[oemId] ?? []
        ).filter((b) => b.batterySpecId !== batterySpecId);
        state.batteryProfiles.success = 'Battery profile removed';
      });
  },
});

export const {
  clearMasterFeedback,
  clearContactFeedback,
  clearTypeFeedback,
  clearBatteryFeedback,
} = oemSlice.actions;

export default oemSlice.reducer;
