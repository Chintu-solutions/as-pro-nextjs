// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    details?: {
      field?: string;
      reason?: string;
      suggestion?: string;
    };
  };
}

// Website Types
export interface Website {
  _id: string;
  domain: string;
  category: string;
  status: 'pending' | 'active' | 'suspended' | 'rejected';
  isActive: boolean;
  isDeleted: boolean;
  publisherId: string;
  verification: {
    isVerified: boolean;
    method?: VerificationMethod;
    verifiedAt?: Date;
    attempts: number;
    maxAttempts: number;
    lastAttempt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Request Types
export interface CreateWebsiteRequest {
  domain: string;
  category: string;
}

export interface UpdateWebsiteRequest {
  category?: string;
  isActive?: boolean;
}

// Verification Types
export type VerificationMethod = 'dns' | 'file';

export interface VerificationDetails {
  type: VerificationMethod;
  instructions: string;
  value: string;
  location?: string;
}

export interface VerificationResponse {
  success: boolean;
  message?: string;
  data?: {
    verificationDetails: VerificationDetails;
    attempts: {
      count: number;
      remaining: number;
    };
  };
}

export interface VerificationCheckResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    domain: string;
    status: string;
    verifiedAt: Date;
  };
  attempts?: {
    count: number;
    remaining: number;
  };
}

export interface WebsiteStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  verified: number;
}

// API Client Interface
export interface WebsiteApiClient {
  getWebsites(): Promise<ApiResponse<Website[]>>;
  getWebsite(id: string): Promise<ApiResponse<Website>>;
  createWebsite(data: CreateWebsiteRequest): Promise<ApiResponse<Website>>;
  updateWebsite(id: string, data: UpdateWebsiteRequest): Promise<ApiResponse<Website>>;
  deleteWebsite(id: string): Promise<ApiResponse<void>>;
  verification: {
    initiate(id: string, method: VerificationMethod): Promise<VerificationResponse>;
    checkStatus(id: string): Promise<VerificationCheckResponse>;
  };
  stats: {
    getStats(): Promise<ApiResponse<WebsiteStats>>;
  };
}