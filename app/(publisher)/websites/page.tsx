import axios from "axios";
import type {
  Website,
  ApiResponse,
  CreateWebsiteRequest,
  UpdateWebsiteRequest,
  VerificationMethod,
  VerificationResponse,
  VerificationCheckResponse,
  WebsiteStats,
} from "@/types/website";

/**
 * Custom error class for API errors
 */
export class WebsiteApiError extends Error {
  constructor(
    message: string,
    public code: string = "UNKNOWN_ERROR",
    public status: number = 500,
    public details?: {
      field?: string;
      reason?: string;
      suggestion?: string;
    }
  ) {
    super(message);
    this.name = "WebsiteApiError";
  }
}

/**
 * Website API client implementation for publishers
 */
export const websiteApi = {
  /**
   * Fetch all websites for the authenticated publisher
   */
  getWebsites: async () => {
    try {
      const response = await axios.get<ApiResponse<Website[]>>(
        "/publisher/websites"
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new WebsiteApiError(
          error.response.data.message || "Failed to fetch websites",
          error.response.data.error?.code || "FETCH_ERROR",
          error.response.status,
          error.response.data.error?.details
        );
      }
      throw new WebsiteApiError("Failed to fetch websites", "FETCH_ERROR", 500);
    }
  },

  /**
   * Fetch details for a specific website
   */
  getWebsite: async (id: string) => {
    try {
      const response = await axios.get<ApiResponse<Website>>(
        `/publisher/websites/${id}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new WebsiteApiError(
          error.response.data.message || "Failed to fetch website details",
          error.response.data.error?.code || "FETCH_ERROR",
          error.response.status,
          error.response.data.error?.details
        );
      }
      throw new WebsiteApiError(
        "Failed to fetch website details",
        "FETCH_ERROR",
        500
      );
    }
  },

  /**
   * Register a new website
   */
  createWebsite: async (data: CreateWebsiteRequest) => {
    try {
      const response = await axios.post<ApiResponse<Website>>(
        "/publisher/websites",
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new WebsiteApiError(
          error.response.data.message || "Failed to create website",
          error.response.data.error?.code || "CREATE_WEBSITE_ERROR",
          error.response.status,
          error.response.data.error?.details
        );
      }
      throw new WebsiteApiError(
        "Failed to create website",
        "CREATE_WEBSITE_ERROR",
        500
      );
    }
  },

  /**
   * Update website settings
   */
  updateWebsite: async (id: string, data: UpdateWebsiteRequest) => {
    try {
      const response = await axios.put<ApiResponse<Website>>(
        `/publisher/websites/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new WebsiteApiError(
          error.response.data.message || "Failed to update website",
          error.response.data.error?.code || "UPDATE_ERROR",
          error.response.status,
          error.response.data.error?.details
        );
      }
      throw new WebsiteApiError(
        "Failed to update website",
        "UPDATE_ERROR",
        500
      );
    }
  },

  /**
   * Delete a website (soft delete)
   */
  deleteWebsite: async (id: string) => {
    try {
      const response = await axios.delete<ApiResponse<void>>(
        `/publisher/websites/${id}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        throw new WebsiteApiError(
          error.response.data.message || "Failed to delete website",
          error.response.data.error?.code || "DELETE_ERROR",
          error.response.status,
          error.response.data.error?.details
        );
      }
      throw new WebsiteApiError(
        "Failed to delete website",
        "DELETE_ERROR",
        500
      );
    }
  },

  /**
   * Website verification methods
   */
  verification: {
    /**
     * Initialize website verification process
     */
    initiate: async (id: string, method: VerificationMethod) => {
      try {
        const response = await axios.post<VerificationResponse>(
          `/publisher/websites/${id}/verification/initiate`,
          { method }
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          throw new WebsiteApiError(
            error.response.data.message || "Failed to initiate verification",
            error.response.data.error?.code || "VERIFICATION_ERROR",
            error.response.status,
            error.response.data.error?.details
          );
        }
        throw new WebsiteApiError(
          "Failed to initiate verification",
          "VERIFICATION_ERROR",
          500
        );
      }
    },

    /**
     * Check verification status
     */
    checkStatus: async (id: string) => {
      try {
        const response = await axios.post<VerificationCheckResponse>(
          `/publisher/websites/${id}/verification/check`
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          throw new WebsiteApiError(
            error.response.data.message ||
              "Failed to check verification status",
            error.response.data.error?.code || "VERIFICATION_CHECK_ERROR",
            error.response.status,
            error.response.data.error?.details
          );
        }
        throw new WebsiteApiError(
          "Failed to check verification status",
          "VERIFICATION_CHECK_ERROR",
          500
        );
      }
    },
  },

  /**
   * Website statistics
   */
  stats: {
    /**
     * Get publisher website statistics
     */
    getStats: async () => {
      try {
        const response = await axios.get<ApiResponse<WebsiteStats>>(
          "/publisher/websites/stats"
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.data) {
          throw new WebsiteApiError(
            error.response.data.message || "Failed to fetch website statistics",
            error.response.data.error?.code || "STATS_ERROR",
            error.response.status,
            error.response.data.error?.details
          );
        }
        throw new WebsiteApiError(
          "Failed to fetch website statistics",
          "STATS_ERROR",
          500
        );
      }
    },
  },
};

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
  data: {
    verificationDetails: NonNullable<
      VerificationResponse["data"]
    >["verificationDetails"];
  };
} {
  return response.success && !!response.data?.verificationDetails;
}
