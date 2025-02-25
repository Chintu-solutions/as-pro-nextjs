import axios from '@/lib/config/axios';
import type {
  Website,
  WebsiteStats,
  WebsiteFilters,
  WebsiteUpdateData,
  WebsiteResponse,
  WebsitesListResponse,
  WebsiteStatsResponse,
} from '@/types/website';

/**
 * Admin Website API Client
 * Handles all admin-level website operations
 */
export const websiteApi = {
  /**
   * Get all websites with filters and pagination
   */
  getWebsites: async (filters: WebsiteFilters = {
      isVerified: false,
  }): Promise<WebsitesListResponse> => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.publisherId) queryParams.append('publisherId', filters.publisherId);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.isVerified) queryParams.append('isVerified', filters.isVerified.toString());

    const response = await axios.get<WebsitesListResponse>(`/admin/websites?${queryParams}`);
    return response.data;
  },

  /**
   * Get a single website by ID
   */
  getWebsite: async (id: string): Promise<WebsiteResponse> => {
    const response = await axios.get<WebsiteResponse>(`/admin/websites/${id}`);
    return response.data;
  },

  /**
   * Update website
   */
  updateWebsite: async (id: string, data: WebsiteUpdateData): Promise<WebsiteResponse> => {
    const response = await axios.put<WebsiteResponse>(`/admin/websites/${id}`, data);
    return response.data;
  },

  /**
   * Delete website (soft delete)
   */
  deleteWebsite: async (id: string): Promise<WebsiteResponse> => {
    const response = await axios.delete<WebsiteResponse>(`/admin/websites/${id}`);
    return response.data;
  },

  /**
   * Get global website statistics
   */
  getWebsiteStats: async (): Promise<WebsiteStatsResponse> => {
    const response = await axios.get<WebsiteStatsResponse>('/admin/websites/stats');
    return response.data;
  },

  /**
   * Manage verification status
   */
  manageVerification: async (
    id: string, 
    action: 'approve' | 'reject' | 'reset'
  ): Promise<WebsiteResponse> => {
    const response = await axios.post<WebsiteResponse>(
      `/admin/websites/${id}/verification`,
      { action }
    );
    return response.data;
  },

  /**
   * Toggle website active status
   */
  toggleStatus: async (id: string): Promise<WebsiteResponse> => {
    const response = await axios.patch<WebsiteResponse>(`/admin/websites/${id}/status`);
    return response.data;
  }
};

/**
 * Custom error class for API errors
 */
export class WebsiteApiError extends Error {
  constructor(
    message: string,
    public code: string = 'UNKNOWN_ERROR',
    public status: number = 500,
    public details?: {
      field?: string;
      reason?: string;
      suggestion?: string;
    }
  ) {
    super(message);
    this.name = 'WebsiteApiError';
  }
}

// Add axios interceptor for consistent error handling
axios.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      throw new WebsiteApiError(
        'Network error. Please check your connection.',
        'NETWORK_ERROR',
        0
      );
    }

    const apiError = error.response.data;
    throw new WebsiteApiError(
      apiError.message || 'An unexpected error occurred',
      apiError.error?.code,
      error.response.status,
      apiError.error?.details
    );
  }
);