// types/website.ts

/**
 * Basic enumerated types
 */
export const WEBSITE_CATEGORIES = [
  'blog',
  'news',
  'entertainment',
  'business',
  'technology',
  'lifestyle',
  'other',
] as const;

export const WEBSITE_STATUSES = ['pending', 'active', 'rejected'] as const;
export const VERIFICATION_METHODS = ['dns', 'file'] as const;
export const UI_VERIFICATION_STATUSES = [
  'idle',
  'initializing',
  'checking',
  'success',
  'error'
] as const;

export type WebsiteCategory = typeof WEBSITE_CATEGORIES[number];
export type WebsiteStatus = typeof WEBSITE_STATUSES[number];
export type VerificationMethod = typeof VERIFICATION_METHODS[number];
export type UIVerificationStatus = typeof UI_VERIFICATION_STATUSES[number];

/**
 * Base API Response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Verification Types
 */
export interface DNSRecord {
  type: string;
  name: string;
  value: string;
}

export interface FileVerification {
  path: string;
  content: string;
  fullUrl: string;
}

// types/website.ts
export interface VerificationDetails {
  instructions: any;
  value: string;
  host: string;
  dns?: {
    record: {
      type: string;
      name: string;
      value: string;
    };
  };
  file?: {
    path: string;
    content: string;
    fullUrl: string;
  };
}

export interface VerificationAttempts {
  count: number;
  remaining: number;
  lastAttempt?: string;
  nextAttemptAt?: string;
}

export interface WebsiteVerification {
  isVerified: boolean;
  method?: VerificationMethod;
  attempts: number;
  maxAttempts: number;
  lastAttempt?: string;
  verifiedAt?: string;
  code?: string;
  codeExpires?: string;
}

/**
 * Website Core Interface
 */
export interface Website {
  _id: string;
  id: string;
  publisherId: string;
  domain: string;
  status: WebsiteStatus;
  category?: WebsiteCategory;
  verification: WebsiteVerification;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * API Request/Response Types
 */
export interface CreateWebsiteRequest {
  domain: string;
  category?: WebsiteCategory;
}

export interface UpdateWebsiteRequest {
  category?: WebsiteCategory;
  settings?: {
    adPositions?: string[];
    excludedCategories?: string[];
  };
}

export interface VerificationResponse extends ApiResponse {
  success: boolean;
  message?: string;
  data?: {
    verificationDetails: VerificationDetails;
    attempts?: VerificationAttempts;
  };
  error?: {
    code: string;
    details?: string;
  };
}

export interface VerificationCheckResponse extends ApiResponse {
  success: boolean;
  message?: string;
  status?: 'verified' | 'failed';
  attempts?: VerificationAttempts;
}

/**
 * Frontend State Types
 */
export interface VerificationState {
  currentStep: number;
  method: VerificationMethod;
  details: VerificationDetails | null;
  status: UIVerificationStatus;
  error: string | null;
  attempts: number;
  remainingAttempts: number;
}

/**
 * Component Props Types
 */
export interface VerificationMethodProps {
  selectedMethod: VerificationMethod;
  onMethodSelect: (method: VerificationMethod) => Promise<void>;
  isLoading?: boolean;
}

export interface VerificationInstructionsProps {
  method: VerificationMethod;
  domain: string;
  details: VerificationDetails;
}

export interface VerificationStatusProps {
  status: UIVerificationStatus;
  error?: string | null;
  attempts: {
    count: number;
    remaining: number;
    nextAttemptAt?: string;
  };
  onRetry?: () => Promise<void>;
}

export interface WebsiteCardProps {
  website: Website;
  onViewScript: (websiteId: string) => void;
  onVerify: (websiteId: string) => void;
}

/**
 * Error Types
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
 * API Client Types
 */
export interface WebsiteApiClient {
  getWebsites: () => Promise<ApiResponse<Website[]>>;
  getWebsite: (id: string) => Promise<ApiResponse<Website>>;
  createWebsite: (data: CreateWebsiteRequest) => Promise<ApiResponse<Website>>;
  updateWebsite: (id: string, data: UpdateWebsiteRequest) => Promise<ApiResponse<Website>>;
  deleteWebsite: (id: string) => Promise<ApiResponse<void>>;
  
  verification: {
    initiate: (id: string, method: VerificationMethod) => Promise<VerificationResponse>;
    checkStatus: (id: string) => Promise<VerificationCheckResponse>;
  };
  
  // Add ads methods
  ads: {
    getImplementationCode: (id: string) => Promise<ApiResponse<{
      scriptCode: string;
      websiteId: string;
    }>>;
  };
}