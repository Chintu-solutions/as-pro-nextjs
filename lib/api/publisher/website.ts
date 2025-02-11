// lib/api/website.ts

import axios from '@/lib/config/axios';
import type {
  Website,
  ApiResponse,
  CreateWebsiteRequest,
  UpdateWebsiteRequest,
  VerificationMethod,
  VerificationResponse,
  VerificationCheckResponse,
  WebsiteApiClient
} from '@/types/website';

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

/**
 * Website API client implementation
 */
export const websiteApi: WebsiteApiClient = {
  /**
   * Fetch all websites for the authenticated publisher
   */
  getWebsites: async () => {
    const response = await axios.get<ApiResponse<Website[]>>('/websites');
    return response.data;
  },

  /**
   * Fetch details for a specific website
   */
  getWebsite: async (id: string) => {
    const response = await axios.get<ApiResponse<Website>>(`/websites/${id}`);
    return response.data;
  },

  /**
   * Register a new website
   */
  createWebsite: async (data: CreateWebsiteRequest) => {
    const response = await axios.post<ApiResponse<Website>>('/websites', data);
    return response.data;
  },

  /**
   * Update website settings
   */
  updateWebsite: async (id: string, data: UpdateWebsiteRequest) => {
    const response = await axios.put<ApiResponse<Website>>(`/websites/${id}`, data);
    return response.data;
  },

  /**
   * Delete a website (soft delete)
   */
  deleteWebsite: async (id: string) => {
    const response = await axios.delete<ApiResponse<void>>(`/websites/${id}`);
    return response.data;
  },

  /**
   * Website verification methods
   */
  verification: {
    /**
     * Initialize website verification process
     */
    initiate: async (id: string, method: VerificationMethod) => {
      const response = await axios.post<VerificationResponse>(
        `/websites/${id}/verify/init`,
        { method }
      );
      return response.data;
    },

    /**
     * Check verification status
     */
    checkStatus: async (id: string) => {
      const response = await axios.get<VerificationCheckResponse>(
        `/websites/${id}/verify/check`
      );
      return response.data;
    }
  },

  /**
   * Ad implementation methods
   */
  ads: {
    /**
     * Get ad implementation code
     */
    getImplementationCode: async (id: string) => {
      const response = await axios.get<ApiResponse<{
        scriptCode: string;
        websiteId: string;
      }>>(`/websites/${id}/ad-code`);
      return response.data;
    }
  }
};

/**
 * Add axios interceptor for consistent error handling
 */
axios.interceptors.response.use(
  response => response,
  error => {
    // Handle network errors
    if (!error.response) {
      throw new WebsiteApiError(
        'Network error. Please check your connection.',
        'NETWORK_ERROR',
        0
      );
    }

    // Extract error details from the response
    const apiError = error.response.data;
    const errorCode = apiError.error?.code || 'API_ERROR';
    const errorMessage = apiError.message || 'An unexpected error occurred';
    const errorDetails = apiError.error?.details;

    // Create structured error object
    throw new WebsiteApiError(
      errorMessage,
      errorCode,
      error.response.status,
      typeof errorDetails === 'string'
        ? { reason: errorDetails }
        : errorDetails
    );
  }
);

/**
 * Type guard for API responses
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { success: true; data: T } {
  return response.success && !!response.data;
}

/**
 * Type guard for verification responses
 */
export function isVerificationSuccess(
  response: VerificationResponse
): response is VerificationResponse & { 
  success: true; 
  data: { verificationDetails: NonNullable<VerificationResponse['data']>['verificationDetails'] } 
} {
  return response.success && !!response.data?.verificationDetails;
}