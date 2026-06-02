/**
 * useOem
 *
 * Exposes the OEM Onboarding slice state and dispatcher handlers.
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store/store';
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
} from '../store/oemActions';
import {
  clearMasterFeedback,
  clearContactFeedback,
  clearTypeFeedback,
  clearBatteryFeedback,
} from '../store/oemReducer';
import type {
  MasterRequest,
  ContactRequest,
  AircraftTypeRequest,
  AircraftBatteryProfileRequest,
  PageQuery,
} from '../store/oemTypes';

export const useOem = () => {
  const dispatch = useDispatch<AppDispatch>();
  const masters = useSelector((s: RootState) => s.oem.masters);
  const contacts = useSelector((s: RootState) => s.oem.contacts);
  const aircraftTypes = useSelector((s: RootState) => s.oem.aircraftTypes);
  const batteryProfiles = useSelector((s: RootState) => s.oem.batteryProfiles);

  // Masters
  const loadMasters = useCallback(
    (params?: PageQuery) => dispatch(fetchMasters(params)),
    [dispatch],
  );
  const addMaster = useCallback(
    (payload: MasterRequest) => dispatch(createMaster(payload)),
    [dispatch],
  );
  const editMaster = useCallback(
    (oemId: string, payload: MasterRequest) =>
      dispatch(updateMaster({ oemId, payload })),
    [dispatch],
  );
  const removeMaster = useCallback(
    (oemId: string) => dispatch(deleteMaster(oemId)),
    [dispatch],
  );

  // Contacts
  const loadContacts = useCallback(
    (oemId: string) => dispatch(fetchContacts(oemId)),
    [dispatch],
  );
  const addContact = useCallback(
    (oemId: string, payload: ContactRequest) =>
      dispatch(createContact({ oemId, payload })),
    [dispatch],
  );
  const editContact = useCallback(
    (oemId: string, contactId: string, payload: ContactRequest) =>
      dispatch(updateContact({ oemId, contactId, payload })),
    [dispatch],
  );
  const removeContact = useCallback(
    (oemId: string, contactId: string) =>
      dispatch(deleteContact({ oemId, contactId })),
    [dispatch],
  );

  // Aircraft Types
  const loadTypes = useCallback(
    (oemId: string) => dispatch(fetchAircraftTypes(oemId)),
    [dispatch],
  );
  const addType = useCallback(
    (oemId: string, payload: AircraftTypeRequest) =>
      dispatch(createAircraftType({ oemId, payload })),
    [dispatch],
  );
  const editType = useCallback(
    (oemId: string, typeId: string, payload: AircraftTypeRequest) =>
      dispatch(updateAircraftType({ oemId, typeId, payload })),
    [dispatch],
  );
  const removeType = useCallback(
    (oemId: string, typeId: string) =>
      dispatch(deleteAircraftType({ oemId, typeId })),
    [dispatch],
  );

  // Battery Profiles
  const loadBatteries = useCallback(
    (oemId: string) => dispatch(fetchBatteryProfiles(oemId)),
    [dispatch],
  );
  const addBattery = useCallback(
    (oemId: string, payload: AircraftBatteryProfileRequest) =>
      dispatch(createBatteryProfile({ oemId, payload })),
    [dispatch],
  );
  const editBattery = useCallback(
    (
      oemId: string,
      batterySpecId: string,
      payload: AircraftBatteryProfileRequest,
    ) => dispatch(updateBatteryProfile({ oemId, batterySpecId, payload })),
    [dispatch],
  );
  const removeBattery = useCallback(
    (oemId: string, batterySpecId: string) =>
      dispatch(deleteBatteryProfile({ oemId, batterySpecId })),
    [dispatch],
  );

  const resetMasterFeedback = useCallback(
    () => dispatch(clearMasterFeedback()),
    [dispatch],
  );
  const resetContactFeedback = useCallback(
    () => dispatch(clearContactFeedback()),
    [dispatch],
  );
  const resetTypeFeedback = useCallback(
    () => dispatch(clearTypeFeedback()),
    [dispatch],
  );
  const resetBatteryFeedback = useCallback(
    () => dispatch(clearBatteryFeedback()),
    [dispatch],
  );

  return {
    masters,
    contacts,
    aircraftTypes,
    batteryProfiles,
    loadMasters,
    addMaster,
    editMaster,
    removeMaster,
    loadContacts,
    addContact,
    editContact,
    removeContact,
    loadTypes,
    addType,
    editType,
    removeType,
    loadBatteries,
    addBattery,
    editBattery,
    removeBattery,
    resetMasterFeedback,
    resetContactFeedback,
    resetTypeFeedback,
    resetBatteryFeedback,
  };
};

export default useOem;
