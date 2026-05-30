import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { storage } from '../utils/storage';

/**
 * Standard API response envelope — matches the server exactly.
 */
export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiError = {
  message: string;
  statusCode?: number;
  data?: unknown;
};

// Your computer's local IP (from Expo's QR code output).
// Update this if your IP changes.
const DEV_MACHINE_IP = '192.168.170.211';

const API_BASE_URL = __DEV__
  ? `http://${DEV_MACHINE_IP}:5000/api`   // Dev: real device + emulator via LAN
  : 'https://your-production-server.com/api'; // Prod: replace with deployed URL

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    });

    // Inject auth token on every request
    this.client.interceptors.request.use(async (config) => {
      const token = await storage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Normalize error responses
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiEnvelope<unknown>>) => {
        const apiError: ApiError = {
          message:
            error.response?.data?.message || error.message || 'Request failed',
          statusCode: error.response?.status,
          data: error.response?.data?.data,
        };

        // Auto-clear auth on 401
        if (error.response?.status === 401) {
          await storage.clearAuth();
        }

        throw Object.assign(new Error(apiError.message), apiError);
      },
    );
  }

  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<ApiEnvelope<T>>(config);
    return response.data.data;
  }

  get<T>(url: string, params?: unknown) {
    return this.request<T>({ method: 'GET', url, params });
  }

  post<T>(url: string, data?: unknown) {
    return this.request<T>({ method: 'POST', url, data });
  }

  put<T>(url: string, data?: unknown) {
    return this.request<T>({ method: 'PUT', url, data });
  }

  delete<T>(url: string) {
    return this.request<T>({ method: 'DELETE', url });
  }
}

export const apiClient = new ApiClient();
