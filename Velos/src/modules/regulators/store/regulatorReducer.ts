/**
 * Reducer slice for the Regulators module.
 * Owns: regulators (list), contacts (per regulator), utms (per regulator).
 *
 * Mutations are applied optimistically on the thunk `pending` phase so the
 * UI remains fully interactive against the seeded sample data even without a
 * live backend. The `fulfilled`/`rejected` phases only manage loading +
 * feedback flags.
 */
import { createSlice } from '@reduxjs/toolkit';
import type { RegulatorsState, RegulatorDto, ContactDto, UtmDto } from './regulatorTypes';
import {
  fetchRegulators,
  createRegulator,
  updateRegulator,
  deleteRegulator,
  fetchContacts,
  createContact,
  updateContact,
  deleteContact,
  fetchUtms,
  createUtm,
  updateUtm,
  deleteUtm,
} from './regulatorActions';

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2)}-${Date.now()}`;

const PARTNER_A = 'a1b2c3d4-0001-4000-8000-000000000001';
const CLUSTER_DXB = 'c1000000-0000-4000-8000-000000000001';
const CLUSTER_AUH = 'c1000000-0000-4000-8000-000000000002';
const UTM_GAA = 'u1000000-0000-4000-8000-000000000001';
const UTM_ANGEL = 'u1000000-0000-4000-8000-000000000002';

const REG_GCAA = '11111111-0000-4000-8000-000000000001';
const REG_GACA = '11111111-0000-4000-8000-000000000002';
const REG_CAAS = '11111111-0000-4000-8000-000000000003';

const sampleRegulators: RegulatorDto[] = [
  {
    regulatorId: REG_GCAA,
    regulatorCode: 'UAE-GCAA',
    partnerId: PARTNER_A,
    regulatorName: 'UAE General Civil Aviation Authority',
    regulatorType: 'CAA',
    clusterIds: [CLUSTER_DXB, CLUSTER_AUH],
    primaryClusterId: CLUSTER_DXB,
    countryIso2: 'AE',
    websiteUrl: 'https://www.gcaa.gov.ae',
    isUtmOwner: true,
    utmFramework: 'U-Space',
    utmAuthorityLevel: 'NATIONAL',
    usspDesignationRequired: true,
    flightIntentRequired: true,
    intentSubmissionLeadHours: 24,
    autonomousOpsPermitted: true,
    maxUtmAltitudeFtAgl: 400,
    opsEmail: 'ops@gcaa.gov.ae',
    opsPhone: '+971-2-4054200',
    emergencyContact: '+971-50-1112233',
    onboardingStatus: 'ACTIVE',
    onboardedAt: '2025-09-12',
    createdAt: '2025-09-12T08:30:00Z',
  },
  {
    regulatorId: REG_GACA,
    regulatorCode: 'KSA-GACA',
    partnerId: PARTNER_A,
    regulatorName: 'General Authority of Civil Aviation (KSA)',
    regulatorType: 'CAA',
    clusterIds: ['c1000000-0000-4000-8000-000000000003'],
    primaryClusterId: 'c1000000-0000-4000-8000-000000000003',
    countryIso2: 'SA',
    websiteUrl: 'https://gaca.gov.sa',
    isUtmOwner: false,
    utmFramework: 'UTM',
    utmAuthorityLevel: 'NATIONAL',
    usspDesignationRequired: false,
    flightIntentRequired: true,
    intentSubmissionLeadHours: 48,
    autonomousOpsPermitted: false,
    maxUtmAltitudeFtAgl: 400,
    opsEmail: 'ops@gaca.gov.sa',
    onboardingStatus: 'PENDING',
    createdAt: '2026-01-20T10:00:00Z',
  },
  {
    regulatorId: REG_CAAS,
    regulatorCode: 'SG-CAAS',
    partnerId: PARTNER_A,
    regulatorName: 'Civil Aviation Authority of Singapore',
    regulatorType: 'CAA',
    clusterIds: ['c1000000-0000-4000-8000-000000000004'],
    primaryClusterId: 'c1000000-0000-4000-8000-000000000004',
    countryIso2: 'SG',
    websiteUrl: 'https://www.caas.gov.sg',
    isUtmOwner: true,
    utmFramework: 'U-Space',
    utmAuthorityLevel: 'NATIONAL',
    usspDesignationRequired: true,
    flightIntentRequired: true,
    intentSubmissionLeadHours: 12,
    autonomousOpsPermitted: true,
    maxUtmAltitudeFtAgl: 200,
    opsEmail: 'utm@caas.gov.sg',
    onboardingStatus: 'ACTIVE',
    onboardedAt: '2025-11-03',
    createdAt: '2025-11-03T09:15:00Z',
  },
];

const sampleContacts: Record<string, ContactDto[]> = {
  [REG_GCAA]: [
    {
      regContactId: uid(),
      regulatorId: REG_GCAA,
      partnerId: PARTNER_A,
      contactRole: 'PRIMARY',
      fullName: 'Aisha Al Mansoori',
      jobTitle: 'Head of UAS Integration',
      email: 'a.almansoori@gcaa.gov.ae',
      phonePrimary: '+971-2-4054210',
      isPrimaryContact: true,
      availableHours: '08:00-17:00 GST',
      preferredChannel: 'EMAIL',
      contactStatus: 'ACTIVE',
    },
    {
      regContactId: uid(),
      regulatorId: REG_GCAA,
      partnerId: PARTNER_A,
      contactRole: 'TECHNICAL',
      fullName: 'Omar Khalid',
      jobTitle: 'UTM Integration Engineer',
      email: 'o.khalid@gcaa.gov.ae',
      phonePrimary: '+971-2-4054211',
      isPrimaryContact: false,
      preferredChannel: 'PORTAL',
      contactStatus: 'ACTIVE',
    },
  ],
};

const sampleUtms: Record<string, UtmDto[]> = {
  [REG_GCAA]: [
    {
      regulatorUtmId: uid(),
      regulatorId: REG_GCAA,
      utmSystemId: UTM_GAA,
      clusterId: CLUSTER_DXB,
      partnerId: PARTNER_A,
      utmIntegrationEnabled: true,
      integrationStatus: 'ENABLED',
      isPrimary: true,
      integrationPriority: 1,
      isFailover: false,
      operationalScope: 'ALL',
      circuitBreakerEnabled: true,
      supportsFlightIntent: true,
      supportsAuthorisation: true,
      supportsOperationalIntent: true,
      supportsConstraints: true,
      supportsTelemetry: true,
      supportsSubscriptions: true,
      consecutiveFailures: 0,
      slaBreached: false,
      complianceStatus: 'APPROVED',
      authScopeOverride: 'utm.read utm.write',
      clientCredentialRef: 'vault://gcaa/utm-primary',
    },
    {
      regulatorUtmId: uid(),
      regulatorId: REG_GCAA,
      utmSystemId: UTM_ANGEL,
      clusterId: CLUSTER_AUH,
      partnerId: PARTNER_A,
      utmIntegrationEnabled: true,
      integrationStatus: 'MAINTENANCE',
      isPrimary: false,
      integrationPriority: 2,
      isFailover: true,
      operationalScope: 'CIVIL',
      circuitBreakerEnabled: true,
      supportsFlightIntent: true,
      supportsAuthorisation: false,
      supportsOperationalIntent: true,
      supportsConstraints: false,
      supportsTelemetry: true,
      supportsSubscriptions: false,
      consecutiveFailures: 1,
      slaBreached: false,
      complianceStatus: 'CONDITIONAL',
      clientCredentialRef: 'vault://gcaa/utm-failover',
    },
  ],
};

const initialState: RegulatorsState = {
  regulators: { items: sampleRegulators, loading: false, error: null, success: null },
  contacts: { byRegulator: sampleContacts, loading: false, error: null, success: null },
  utms: { byRegulator: sampleUtms, loading: false, error: null, success: null },
};

const regulatorsSlice = createSlice({
  name: 'regulators',
  initialState,
  reducers: {
    clearRegulatorFeedback(state) {
      state.regulators.error = null;
      state.regulators.success = null;
    },
    clearContactFeedback(state) {
      state.contacts.error = null;
      state.contacts.success = null;
    },
    clearUtmFeedback(state) {
      state.utms.error = null;
      state.utms.success = null;
    },
  },
  extraReducers: (builder) => {
    // ---------- Regulators ----------
    builder
      .addCase(fetchRegulators.pending, (state) => {
        state.regulators.loading = true;
        state.regulators.error = null;
      })
      .addCase(fetchRegulators.fulfilled, (state, action) => {
        state.regulators.loading = false;
        // Keep seeded items if backend returns nothing (demo mode).
        if (action.payload?.content?.length) {
          state.regulators.items = action.payload.content;
        }
      })
      .addCase(fetchRegulators.rejected, (state) => {
        state.regulators.loading = false;
      })

      .addCase(createRegulator.pending, (state, action) => {
        state.regulators.error = null;
        state.regulators.success = null;
        const req = action.meta.arg;
        const item: RegulatorDto = {
          ...req,
          regulatorId: uid(),
          createdAt: new Date().toISOString(),
        };
        state.regulators.items = [item, ...state.regulators.items];
        state.regulators.success = 'Regulator onboarded successfully';
      })

      .addCase(updateRegulator.pending, (state, action) => {
        state.regulators.error = null;
        state.regulators.success = null;
        const { regulatorId, payload } = action.meta.arg;
        state.regulators.items = state.regulators.items.map((r) =>
          r.regulatorId === regulatorId
            ? { ...r, ...payload, regulatorId, updatedAt: new Date().toISOString() }
            : r,
        );
        state.regulators.success = 'Regulator updated successfully';
      })

      .addCase(deleteRegulator.pending, (state, action) => {
        const id = action.meta.arg;
        state.regulators.items = state.regulators.items.filter(
          (r) => r.regulatorId !== id,
        );
        state.regulators.success = 'Regulator removed';
      });

    // ---------- Contacts ----------
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.contacts.loading = true;
        state.contacts.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.contacts.loading = false;
        const { regulatorId, items } = action.payload;
        if (items.length) state.contacts.byRegulator[regulatorId] = items;
      })
      .addCase(fetchContacts.rejected, (state) => {
        state.contacts.loading = false;
      })

      .addCase(createContact.pending, (state, action) => {
        state.contacts.error = null;
        state.contacts.success = null;
        const req = action.meta.arg;
        const item: ContactDto = { ...req, regContactId: uid() };
        const list = state.contacts.byRegulator[req.regulatorId] ?? [];
        state.contacts.byRegulator[req.regulatorId] = [...list, item];
        state.contacts.success = 'Contact added';
      })

      .addCase(updateContact.pending, (state, action) => {
        state.contacts.error = null;
        state.contacts.success = null;
        const { contactId, payload } = action.meta.arg;
        const list = state.contacts.byRegulator[payload.regulatorId] ?? [];
        state.contacts.byRegulator[payload.regulatorId] = list.map((c) =>
          c.regContactId === contactId ? { ...c, ...payload } : c,
        );
        state.contacts.success = 'Contact updated';
      })

      .addCase(deleteContact.pending, (state, action) => {
        const { contactId, regulatorId } = action.meta.arg;
        const list = state.contacts.byRegulator[regulatorId] ?? [];
        state.contacts.byRegulator[regulatorId] = list.filter(
          (c) => c.regContactId !== contactId,
        );
        state.contacts.success = 'Contact removed';
      });

    // ---------- UTMs ----------
    builder
      .addCase(fetchUtms.pending, (state) => {
        state.utms.loading = true;
        state.utms.error = null;
      })
      .addCase(fetchUtms.fulfilled, (state, action) => {
        state.utms.loading = false;
        const { regulatorId, items } = action.payload;
        if (items.length) state.utms.byRegulator[regulatorId] = items;
      })
      .addCase(fetchUtms.rejected, (state) => {
        state.utms.loading = false;
      })

      .addCase(createUtm.pending, (state, action) => {
        state.utms.error = null;
        state.utms.success = null;
        const req = action.meta.arg;
        const item: UtmDto = { ...req, regulatorUtmId: uid() };
        const list = state.utms.byRegulator[req.regulatorId] ?? [];
        state.utms.byRegulator[req.regulatorId] = [...list, item];
        state.utms.success = 'UTM integration added';
      })

      .addCase(updateUtm.pending, (state, action) => {
        state.utms.error = null;
        state.utms.success = null;
        const { utmId, payload } = action.meta.arg;
        const list = state.utms.byRegulator[payload.regulatorId] ?? [];
        state.utms.byRegulator[payload.regulatorId] = list.map((u) =>
          u.regulatorUtmId === utmId ? { ...u, ...payload } : u,
        );
        state.utms.success = 'UTM integration updated';
      })

      .addCase(deleteUtm.pending, (state, action) => {
        const { utmId, regulatorId } = action.meta.arg;
        const list = state.utms.byRegulator[regulatorId] ?? [];
        state.utms.byRegulator[regulatorId] = list.filter(
          (u) => u.regulatorUtmId !== utmId,
        );
        state.utms.success = 'UTM integration removed';
      });
  },
});

export const {
  clearRegulatorFeedback,
  clearContactFeedback,
  clearUtmFeedback,
} = regulatorsSlice.actions;

export default regulatorsSlice.reducer;
