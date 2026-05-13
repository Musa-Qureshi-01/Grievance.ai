import { api, unwrapEnvelope, type ApiEnvelope } from '@/api/client';
import type { LandingPayload } from '@/types/landing';

export const publicService = {
  landing: () => unwrapEnvelope<LandingPayload>(api.get<ApiEnvelope<LandingPayload>>('/public/landing')),
};
