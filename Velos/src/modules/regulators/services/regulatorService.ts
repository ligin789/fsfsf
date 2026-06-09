/**
 * Regulator Onboarding Service
 *
 * REST calls mapped to the Regulator Onboarding OpenAPI spec.
 * Uses the project-wide axios instance.
 */
import axiosInstance from '../../../utils/axios';
import type {
  RegulatorRequest,
  RegulatorDto,
  PageRegulatorDto,
  ContactRequest,
  ContactDto,
  PageContactDto,
  UtmRequest,
  UtmDto,
  PageUtmDto,
  PageQuery,
} from '../store/regulatorTypes';

const REGULATOR_BASE = '/regulator';
const CONTACT_BASE = '/regulator_contact';
const UTM_BASE = '/regulator_utm';

export const regulatorService = {
  list(params: PageQuery = {}): Promise<PageRegulatorDto> {
    return axiosInstance
      .get<PageRegulatorDto>(REGULATOR_BASE, { params })
      .then((r) => r.data);
  },
  getById(regulatorId: string): Promise<RegulatorDto> {
    return axiosInstance
      .get<RegulatorDto>(`${REGULATOR_BASE}/id/${regulatorId}`)
      .then((r) => r.data);
  },
  getByCode(regulatorCode: string): Promise<RegulatorDto> {
    return axiosInstance
      .get<RegulatorDto>(`${REGULATOR_BASE}/code/${regulatorCode}`)
      .then((r) => r.data);
  },
  create(payload: RegulatorRequest): Promise<RegulatorDto> {
    return axiosInstance
      .post<RegulatorDto>(REGULATOR_BASE, payload)
      .then((r) => r.data);
  },
  update(regulatorId: string, payload: RegulatorRequest): Promise<RegulatorDto> {
    return axiosInstance
      .put<RegulatorDto>(`${REGULATOR_BASE}/id/${regulatorId}`, payload)
      .then((r) => r.data);
  },
  remove(regulatorId: string): Promise<void> {
    return axiosInstance
      .delete<void>(`${REGULATOR_BASE}/id/${regulatorId}`)
      .then(() => undefined);
  },
};

export const contactService = {
  list(params: PageQuery = {}): Promise<PageContactDto> {
    return axiosInstance
      .get<PageContactDto>(CONTACT_BASE, { params })
      .then((r) => r.data);
  },
  getById(contactId: string): Promise<ContactDto> {
    return axiosInstance
      .get<ContactDto>(`${CONTACT_BASE}/id/${contactId}`)
      .then((r) => r.data);
  },
  create(payload: ContactRequest): Promise<ContactDto> {
    return axiosInstance
      .post<ContactDto>(CONTACT_BASE, payload)
      .then((r) => r.data);
  },
  update(contactId: string, payload: ContactRequest): Promise<ContactDto> {
    return axiosInstance
      .put<ContactDto>(`${CONTACT_BASE}/id/${contactId}`, payload)
      .then((r) => r.data);
  },
  remove(contactId: string): Promise<void> {
    return axiosInstance
      .delete<void>(`${CONTACT_BASE}/id/${contactId}`)
      .then(() => undefined);
  },
};

export const utmService = {
  list(params: PageQuery = {}): Promise<PageUtmDto> {
    return axiosInstance
      .get<PageUtmDto>(UTM_BASE, { params })
      .then((r) => r.data);
  },
  getById(utmId: string): Promise<UtmDto> {
    return axiosInstance
      .get<UtmDto>(`${UTM_BASE}/id/${utmId}`)
      .then((r) => r.data);
  },
  create(payload: UtmRequest): Promise<UtmDto> {
    return axiosInstance.post<UtmDto>(UTM_BASE, payload).then((r) => r.data);
  },
  update(utmId: string, payload: UtmRequest): Promise<UtmDto> {
    return axiosInstance
      .put<UtmDto>(`${UTM_BASE}/id/${utmId}`, payload)
      .then((r) => r.data);
  },
  remove(utmId: string): Promise<void> {
    return axiosInstance
      .delete<void>(`${UTM_BASE}/id/${utmId}`)
      .then(() => undefined);
  },
};

export default { regulatorService, contactService, utmService };
