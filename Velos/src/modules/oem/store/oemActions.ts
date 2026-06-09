/**
 * Async thunks for the OEM Onboarding module.
 * Built on @reduxjs/toolkit's createAsyncThunk.
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import {
  masterService,
  contactService,
  aircraftTypeService,
  batteryProfileService,
} from '../services/oemService';
import type {
  ApiError,
  MasterRequest,
  ContactRequest,
  AircraftTypeRequest,
  AircraftBatteryProfileRequest,
  PageQuery,
} from './oemTypes';

const extractError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<ApiError>;
    return ax.response?.data?.error || ax.message || 'Request failed';
  }
  if (err instanceof Error) return err.message;
  return 'Unexpected error';
};

// ---------- OEM Master ----------
export const fetchMasters = createAsyncThunk(
  'oem/fetchMasters',
  async (params: PageQuery | undefined, { rejectWithValue }) => {
    try {
      return await masterService.list(params || {});
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const createMaster = createAsyncThunk(
  'oem/createMaster',
  async (payload: MasterRequest, { rejectWithValue }) => {
    try {
      return await masterService.create(payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateMaster = createAsyncThunk(
  'oem/updateMaster',
  async (
    args: { oemId: string; payload: MasterRequest },
    { rejectWithValue },
  ) => {
    try {
      return await masterService.update(args.oemId, args.payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const deleteMaster = createAsyncThunk(
  'oem/deleteMaster',
  async (oemId: string, { rejectWithValue }) => {
    try {
      await masterService.remove(oemId);
      return oemId;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

// ---------- Contacts ----------
export const fetchContacts = createAsyncThunk(
  'oem/fetchContacts',
  async (oemId: string, { rejectWithValue }) => {
    try {
      const page = await contactService.list({ page: 0, size: 200 });
      return { oemId, items: page.content };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const createContact = createAsyncThunk(
  'oem/createContact',
  async (
    args: { oemId: string; payload: ContactRequest },
    { rejectWithValue },
  ) => {
    try {
      return { oemId: args.oemId, dto: await contactService.create(args.payload) };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateContact = createAsyncThunk(
  'oem/updateContact',
  async (
    args: { oemId: string; contactId: string; payload: ContactRequest },
    { rejectWithValue },
  ) => {
    try {
      return {
        oemId: args.oemId,
        dto: await contactService.update(args.contactId, args.payload),
      };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const deleteContact = createAsyncThunk(
  'oem/deleteContact',
  async (
    args: { oemId: string; contactId: string },
    { rejectWithValue },
  ) => {
    try {
      await contactService.remove(args.contactId);
      return args;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

// ---------- Aircraft Types ----------
export const fetchAircraftTypes = createAsyncThunk(
  'oem/fetchAircraftTypes',
  async (oemId: string, { rejectWithValue }) => {
    try {
      const page = await aircraftTypeService.list({ page: 0, size: 200 });
      return {
        oemId,
        items: page.content.filter((t) => t.manufacturer === oemId),
      };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const createAircraftType = createAsyncThunk(
  'oem/createAircraftType',
  async (
    args: { oemId: string; payload: AircraftTypeRequest },
    { rejectWithValue },
  ) => {
    try {
      return {
        oemId: args.oemId,
        dto: await aircraftTypeService.create(args.payload),
      };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateAircraftType = createAsyncThunk(
  'oem/updateAircraftType',
  async (
    args: { oemId: string; typeId: string; payload: AircraftTypeRequest },
    { rejectWithValue },
  ) => {
    try {
      return {
        oemId: args.oemId,
        dto: await aircraftTypeService.update(args.typeId, args.payload),
      };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const deleteAircraftType = createAsyncThunk(
  'oem/deleteAircraftType',
  async (
    args: { oemId: string; typeId: string },
    { rejectWithValue },
  ) => {
    try {
      await aircraftTypeService.remove(args.typeId);
      return args;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

// ---------- Battery Profiles ----------
export const fetchBatteryProfiles = createAsyncThunk(
  'oem/fetchBatteryProfiles',
  async (oemId: string, { rejectWithValue }) => {
    try {
      const page = await batteryProfileService.list({ page: 0, size: 200 });
      return {
        oemId,
        items: page.content.filter((b) => b.manufacturer === oemId),
      };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const createBatteryProfile = createAsyncThunk(
  'oem/createBatteryProfile',
  async (
    args: { oemId: string; payload: AircraftBatteryProfileRequest },
    { rejectWithValue },
  ) => {
    try {
      return {
        oemId: args.oemId,
        dto: await batteryProfileService.create(args.payload),
      };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateBatteryProfile = createAsyncThunk(
  'oem/updateBatteryProfile',
  async (
    args: {
      oemId: string;
      batterySpecId: string;
      payload: AircraftBatteryProfileRequest;
    },
    { rejectWithValue },
  ) => {
    try {
      return {
        oemId: args.oemId,
        dto: await batteryProfileService.update(
          args.batterySpecId,
          args.payload,
        ),
      };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const deleteBatteryProfile = createAsyncThunk(
  'oem/deleteBatteryProfile',
  async (
    args: { oemId: string; batterySpecId: string },
    { rejectWithValue },
  ) => {
    try {
      await batteryProfileService.remove(args.batterySpecId);
      return args;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);
