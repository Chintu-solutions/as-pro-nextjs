// types/api.ts

/**
 * Represents an error field in API responses
 * Used for form validation and field-specific errors
 */
export interface ApiErrorField {
    field: string;
    message: string;
  }
  
  /**
   * Represents detailed error information in API responses
   * Provides structured error data for better error handling
   */
  export interface ApiErrorInfo {
    code: string;
    message: string;
    details?: string;
    fields?: ApiErrorField[];
  }
  
  /**
   * Base API response type that all responses extend
   * Provides consistent structure for all API communications
   */
  export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: ApiErrorInfo;
  }
  
  /**
   * Custom error class for API-related errors
   * Provides better error handling and type safety
   */
  export class ApiError extends Error {
    constructor(
      message: string,
      public statusCode: number = 500,
      public code: string = 'UNKNOWN_ERROR',
      public details?: string,
      public fields?: ApiErrorField[]
    ) {
      super(message);
      this.name = 'ApiError';
    }
  }