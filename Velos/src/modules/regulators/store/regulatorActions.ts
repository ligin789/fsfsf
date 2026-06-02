/**
 * Async thunks for the Regulators module.
 * Built on @reduxjs/toolkit's createAsyncThunk.
 */
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import {
  regulatorService,
  contactService,
  utmService,
} from '../services/regulatorService';
import type {
  ApiError,
  RegulatorRequest,
  ContactRequest,
  UtmRequest,
  PageQuery,
} from './regulatorTypes';

const extractError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const ax = err as AxiosError<ApiError>;
    return ax.response?.data?.error || ax.message || 'Request failed';
  }
  if (err instanceof Error) return err.message;
  return 'Unexpected error';
};

// ---------- Regulator thunks ----------
export const fetchRegulators = createAsyncThunk(
  'regulators/fetchRegulators',
  async (params: PageQuery | undefined, { rejectWithValue }) => {
    try {
      return await regulatorService.list(params || {});
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const createRegulator = createAsyncThunk(
  'regulators/createRegulator',
  async (payload: RegulatorRequest, { rejectWithValue }) => {
    try {
      return await regulatorService.create(payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateRegulator = createAsyncThunk(
  'regulators/updateRegulator',
  async (
    args: { regulatorId: string; payload: RegulatorRequest },
    { rejectWithValue },
  ) => {
    try {
      return await regulatorService.update(args.regulatorId, args.payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const deleteRegulator = createAsyncThunk(
  'regulators/deleteRegulator',
  async (regulatorId: string, { rejectWithValue }) => {
    try {
      await regulatorService.remove(regulatorId);
      return regulatorId;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

// ---------- Contact thunks ----------
export const fetchContacts = createAsyncThunk(
  'regulators/fetchContacts',
  async (regulatorId: string, { rejectWithValue }) => {
    try {
      const page = await contactService.list({ page: 0, size: 200 });
      return {
        regulatorId,
        items: page.content.filter((c) => c.regulatorId === regulatorId),
      };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const createContact = createAsyncThunk(
  'regulators/createContact',
  async (payload: ContactRequest, { rejectWithValue }) => {
    try {
      return await contactService.create(payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateContact = createAsyncThunk(
  'regulators/updateContact',
  async (
    args: { contactId: string; payload: ContactRequest },
    { rejectWithValue },
  ) => {
    try {
      return await contactService.update(args.contactId, args.payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const deleteContact = createAsyncThunk(
  'regulators/deleteContact',
  async (
    args: { contactId: string; regulatorId: string },
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

// ---------- UTM thunks ----------
export const fetchUtms = createAsyncThunk(
  'regulators/fetchUtms',
  async (regulatorId: string, { rejectWithValue }) => {
    try {
      const page = await utmService.list({ page: 0, size: 200 });
      return {
        regulatorId,
        items: page.content.filter((u) => u.regulatorId === regulatorId),
      };
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const createUtm = createAsyncThunk(
  'regulators/createUtm',
  async (payload: UtmRequest, { rejectWithValue }) => {
    try {
      return await utmService.create(payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const updateUtm = createAsyncThunk(
  'regulators/updateUtm',
  async (args: { utmId: string; payload: UtmRequest }, { rejectWithValue }) => {
    try {
      return await utmService.update(args.utmId, args.payload);
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);

export const deleteUtm = createAsyncThunk(
  'regulators/deleteUtm',
  async (
    args: { utmId: string; regulatorId: string },
    { rejectWithValue },
  ) => {
    try {
      await utmService.remove(args.utmId);
      return args;
    } catch (err) {
      return rejectWithValue(extractError(err));
    }
  },
);
