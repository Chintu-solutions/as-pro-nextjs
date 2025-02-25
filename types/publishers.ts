/**
 * Publisher Types
 * Defines all types related to publisher management
 */

export interface Publisher {
    id: string;
    email: string;
    name: string;
    status: 'active' | 'inactive' | 'pending' | 'suspended';
    companyName?: string;
    website?: string;
    country?: string;
    phoneNumber?: string;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
  }
  
  export interface PublisherStats {
    totalRevenue: number;
    totalTraffic: number;
    activeWebsites: number;
    performanceScore: number;
    lastPayment?: {
      amount: number;
      date: string;
      status: 'paid' | 'pending' | 'failed';
    };
  }
  
  export interface PublisherFilters {
    status?: Publisher['status'];
    search?: string;
    country?: string;
    sortBy?: 'name' | 'email' | 'createdAt' | 'status';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }
  
  export interface PublisherUpdateData {
    name?: string;
    companyName?: string;
    website?: string;
    country?: string;
    phoneNumber?: string;
    status?: Publisher['status'];
  }
  
  export interface PublisherResponse {
    success: boolean;
    message?: string;
    data?: Publisher;
  }
  
  export interface PublishersListResponse {
    success: boolean;
    message?: string;
    data: {
      publishers: Publisher[];
      total: number;
      page: number;
      totalPages: number;
    };
  }
  
  export interface PublisherStatsResponse {
    success: boolean;
    message?: string;
    data?: PublisherStats;
  }