import axios, { type AxiosError } from 'axios';

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/$/, '');
}

export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL;
  if (fromEnv && fromEnv.length > 0) {
    return normalizeBaseUrl(fromEnv);
  }
  return 'http://localhost:5000/api';
}

// eslint-disable-next-line import/no-named-as-default-member -- axios default export factory
export const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
  timeout: 25_000,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiEnvelope<unknown>>) => {
    const message =
      error.response?.data && typeof error.response.data === 'object' && 'message' in error.response.data
        ? String((error.response.data as ApiEnvelope<unknown>).message)
        : error.message;
    return Promise.reject(new Error(message || 'Request failed'));
  },
);

export async function unwrapEnvelope<T>(promise: Promise<{ data: ApiEnvelope<T> }>): Promise<T> {
  const { data } = await promise;
  if (!data.success) {
    throw new Error(data.message || 'Request failed');
  }
  return data.data;
}
