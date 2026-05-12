import { apiClient } from "../api/client";

export type Complaint = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  department?: { id: string; name: string } | null;
  prediction?: {
    complaint: string;
    validity?: string;
    validity_confidence?: number;
    priority?: string;
    priority_confidence?: number;
    trust_score?: number;
    unavailable?: boolean;
    error?: string;
  };
  whatsappNotification?: {
    sent?: boolean;
    reason?: string;
    sid?: string;
  };
  predictions?: Array<{
    validity?: string | null;
    validityConfidence?: number | string | null;
    priority?: string | null;
    priorityConfidence?: number | string | null;
    trustScore?: number | string | null;
  }>;
  statusHistory?: Array<{ id: string; newStatus: string; createdAt: string; note?: string }>;
};

export type ComplaintList = {
  items: Complaint[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export const complaintService = {
  list: (params?: Record<string, unknown>) => apiClient.get<ComplaintList>("/complaints", params),
  create: (data: { title: string; description: string; priority?: string; departmentId?: string; category?: string; subCategory?: string }) =>
    apiClient.post<Complaint>("/complaints", data),
  getById: (id: string) => apiClient.get<Complaint>(`/complaints/${id}`),
  update: (id: string, data: Partial<Complaint>) => apiClient.put<Complaint>(`/complaints/${id}`, data),
  delete: (id: string) => apiClient.delete<{ id: string }>(`/complaints/${id}`),
};
