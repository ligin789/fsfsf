/**
 * useRegulators
 *
 * Exposes the Regulators slice state and dispatcher handlers.
 */
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store/store';
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
} from '../store/regulatorActions';
import {
  clearRegulatorFeedback,
  clearContactFeedback,
  clearUtmFeedback,
} from '../store/regulatorReducer';
import type {
  RegulatorRequest,
  ContactRequest,
  UtmRequest,
  PageQuery,
} from '../store/regulatorTypes';

export const useRegulators = () => {
  const dispatch = useDispatch<AppDispatch>();
  const regulators = useSelector((s: RootState) => s.regulators.regulators);
  const contacts = useSelector((s: RootState) => s.regulators.contacts);
  const utms = useSelector((s: RootState) => s.regulators.utms);

  // ---------- Regulator ----------
  const loadRegulators = useCallback(
    (params?: PageQuery) => dispatch(fetchRegulators(params)),
    [dispatch],
  );
  const addRegulator = useCallback(
    (payload: RegulatorRequest) => dispatch(createRegulator(payload)),
    [dispatch],
  );
  const editRegulator = useCallback(
    (regulatorId: string, payload: RegulatorRequest) =>
      dispatch(updateRegulator({ regulatorId, payload })),
    [dispatch],
  );
  const removeRegulator = useCallback(
    (regulatorId: string) => dispatch(deleteRegulator(regulatorId)),
    [dispatch],
  );

  // ---------- Contacts ----------
  const loadContacts = useCallback(
    (regulatorId: string) => dispatch(fetchContacts(regulatorId)),
    [dispatch],
  );
  const addContact = useCallback(
    (payload: ContactRequest) => dispatch(createContact(payload)),
    [dispatch],
  );
  const editContact = useCallback(
    (contactId: string, payload: ContactRequest) =>
      dispatch(updateContact({ contactId, payload })),
    [dispatch],
  );
  const removeContact = useCallback(
    (contactId: string, regulatorId: string) =>
      dispatch(deleteContact({ contactId, regulatorId })),
    [dispatch],
  );

  // ---------- UTMs ----------
  const loadUtms = useCallback(
    (regulatorId: string) => dispatch(fetchUtms(regulatorId)),
    [dispatch],
  );
  const addUtm = useCallback(
    (payload: UtmRequest) => dispatch(createUtm(payload)),
    [dispatch],
  );
  const editUtm = useCallback(
    (utmId: string, payload: UtmRequest) =>
      dispatch(updateUtm({ utmId, payload })),
    [dispatch],
  );
  const removeUtm = useCallback(
    (utmId: string, regulatorId: string) =>
      dispatch(deleteUtm({ utmId, regulatorId })),
    [dispatch],
  );

  // ---------- Feedback ----------
  const resetRegulatorFeedback = useCallback(
    () => dispatch(clearRegulatorFeedback()),
    [dispatch],
  );
  const resetContactFeedback = useCallback(
    () => dispatch(clearContactFeedback()),
    [dispatch],
  );
  const resetUtmFeedback = useCallback(
    () => dispatch(clearUtmFeedback()),
    [dispatch],
  );

  return {
    regulators,
    contacts,
    utms,
    loadRegulators,
    addRegulator,
    editRegulator,
    removeRegulator,
    loadContacts,
    addContact,
    editContact,
    removeContact,
    loadUtms,
    addUtm,
    editUtm,
    removeUtm,
    resetRegulatorFeedback,
    resetContactFeedback,
    resetUtmFeedback,
  };
};

export default useRegulators;
