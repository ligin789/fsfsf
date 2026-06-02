/**
 * OEM Onboarding Service
 *
 * REST calls mapped to the OEM Onboarding OpenAPI spec.
 * Uses the project-wide axios instance.
 */
import axiosInstance from '../../../utils/axios';
import type {
  MasterRequest,
  MasterDto,
  PageMasterDto,
  ContactRequest,
  ContactDto,
  PageContactDto,
  AircraftTypeRequest,
  AircraftTypeDto,
  PageAircraftTypeDto,
  AircraftBatteryProfileRequest,
  AircraftBatteryProfileDto,
  PageAircraftBatteryProfileDto,
  PageQuery,
} from '../store/oemTypes';

const MASTER_BASE = '/oem_master';
const CONTACT_BASE = '/oem_contact';
const TYPE_BASE = '/oem_aircraft_type';
const BATTERY_BASE = '/oem_aircraft_battery_profile';

export const masterService = {
  list(params: PageQuery = {}): Promise<PageMasterDto> {
    return axiosInstance
      .get<PageMasterDto>(MASTER_BASE, { params })
      .then((r) => r.data);
  },
  getById(oemId: string): Promise<MasterDto> {
    return axiosInstance
      .get<MasterDto>(`${MASTER_BASE}/id/${oemId}`)
      .then((r) => r.data);
  },
  getByCode(oemCode: string): Promise<MasterDto> {
    return axiosInstance
      .get<MasterDto>(`${MASTER_BASE}/code/${oemCode}`)
      .then((r) => r.data);
  },
  create(payload: MasterRequest): Promise<MasterDto> {
    return axiosInstance
      .post<MasterDto>(MASTER_BASE, payload)
      .then((r) => r.data);
  },
  update(oemId: string, payload: MasterRequest): Promise<MasterDto> {
    return axiosInstance
      .put<MasterDto>(`${MASTER_BASE}/id/${oemId}`, payload)
      .then((r) => r.data);
  },
  remove(oemId: string): Promise<void> {
    return axiosInstance
      .delete<void>(`${MASTER_BASE}/id/${oemId}`)
      .then(() => undefined);
  },
};

export const contactService = {
  list(params: PageQuery = {}): Promise<PageContactDto> {
    return axiosInstance
      .get<PageContactDto>(CONTACT_BASE, { params })
      .then((r) => r.data);
  },
  create(payload: ContactRequest): Promise<ContactDto> {
    return axiosInstance
      .post<ContactDto>(CONTACT_BASE, payload)
      .then((r) => r.data);
  },
  update(oemContactId: string, payload: ContactRequest): Promise<ContactDto> {
    return axiosInstance
      .put<ContactDto>(`${CONTACT_BASE}/id/${oemContactId}`, payload)
      .then((r) => r.data);
  },
  remove(oemContactId: string): Promise<void> {
    return axiosInstance
      .delete<void>(`${CONTACT_BASE}/id/${oemContactId}`)
      .then(() => undefined);
  },
};

export const aircraftTypeService = {
  list(params: PageQuery = {}): Promise<PageAircraftTypeDto> {
    return axiosInstance
      .get<PageAircraftTypeDto>(TYPE_BASE, { params })
      .then((r) => r.data);
  },
  create(payload: AircraftTypeRequest): Promise<AircraftTypeDto> {
    return axiosInstance
      .post<AircraftTypeDto>(TYPE_BASE, payload)
      .then((r) => r.data);
  },
  update(typeId: string, payload: AircraftTypeRequest): Promise<AircraftTypeDto> {
    return axiosInstance
      .put<AircraftTypeDto>(`${TYPE_BASE}/id/${typeId}`, payload)
      .then((r) => r.data);
  },
  remove(typeId: string): Promise<void> {
    return axiosInstance
      .delete<void>(`${TYPE_BASE}/id/${typeId}`)
      .then(() => undefined);
  },
};

export const batteryProfileService = {
  list(params: PageQuery = {}): Promise<PageAircraftBatteryProfileDto> {
    return axiosInstance
      .get<PageAircraftBatteryProfileDto>(BATTERY_BASE, { params })
      .then((r) => r.data);
  },
  create(
    payload: AircraftBatteryProfileRequest,
  ): Promise<AircraftBatteryProfileDto> {
    return axiosInstance
      .post<AircraftBatteryProfileDto>(BATTERY_BASE, payload)
      .then((r) => r.data);
  },
  update(
    batterySpecId: string,
    payload: AircraftBatteryProfileRequest,
  ): Promise<AircraftBatteryProfileDto> {
    return axiosInstance
      .put<AircraftBatteryProfileDto>(
        `${BATTERY_BASE}/id/${batterySpecId}`,
        payload,
      )
      .then((r) => r.data);
  },
  remove(batterySpecId: string): Promise<void> {
    return axiosInstance
      .delete<void>(`${BATTERY_BASE}/id/${batterySpecId}`)
      .then(() => undefined);
  },
};

export default {
  masterService,
  contactService,
  aircraftTypeService,
  batteryProfileService,
};
