import axios from '@/lib/config/axios';
import type {
  Publisher,
  PublisherStats,
  PublisherFilters,
  PublisherUpdateData,
  PublisherResponse,
  PublishersListResponse,
  PublisherStatsResponse,
} from '@/types/publishers';

/**
 * Publisher API
 * Handles all publisher-related API calls
 */
export const publisherApi = {
  /**
   * Get all publishers with filters and pagination
   */
  getPublishers: async (filters: PublisherFilters = {}): Promise<PublishersListResponse> => {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.country) queryParams.append('country', filters.country);
    if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const response = await axios.get<PublishersListResponse>(`/publishers?${queryParams}`);
    return response.data;
  },

  /**
   * Get a single publisher by ID
   */
  getPublisher: async (id: string): Promise<PublisherResponse> => {
    const response = await axios.get<PublisherResponse>(`/publishers/${id}`);
    return response.data;
  },

  /**
   * Update a publisher
   */
  updatePublisher: async (id: string, data: PublisherUpdateData): Promise<PublisherResponse> => {
    const response = await axios.put<PublisherResponse>(`/publishers/${id}`, data);
    return response.data;
  },

  /**
   * Delete a publisher (soft delete)
   */
  deletePublisher: async (id: string): Promise<PublisherResponse> => {
    const response = await axios.delete<PublisherResponse>(`/publishers/${id}`);
    return response.data;
  },

  /**
   * Get publisher statistics
   */
  getPublisherStats: async (id: string): Promise<PublisherStatsResponse> => {
    const response = await axios.get<PublisherStatsResponse>(`/publishers/${id}/stats`);
    return response.data;
  },

  /**
   * Toggle publisher status
   */
  toggleStatus: async (id: string): Promise<PublisherResponse> => {
    const response = await axios.patch<PublisherResponse>(`/publishers/${id}/status`);
    return response.data;
  },

  /**
   * Helper method to format error messages
   */
  handleError: (error: any): string => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    return 'An unexpected error occurred. Please try again.';
  }
};