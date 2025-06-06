// Analytics API Service
import { apiClient } from './client';
import { 
  AnalyticsStats, 
  VisitorData, 
  TrackAnalyticsRequest, 
  ApiResponse, 
  PaginatedResponse 
} from '../../../../shared/types';

export interface AnalyticsFilters {
  country?: string;
  city?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  browser?: string;
  os?: string;
  page?: string;
  startDate?: string;
  endDate?: string;
}

export interface BulkDeleteRequest {
  ids?: string[];
  filters?: AnalyticsFilters;
  days?: number;
}

export class AnalyticsApi {
  // Track analytics event
  async track(data: TrackAnalyticsRequest): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>('/analytics/track', data);
  }

  // Get analytics statistics
  async getStats(days?: number): Promise<ApiResponse<AnalyticsStats>> {
    const params = days ? `?days=${days}` : '';
    return apiClient.get<ApiResponse<AnalyticsStats>>(`/analytics/stats${params}`);
  }

  // Get paginated visitor data
  async getVisitors(
    page?: number, 
    limit?: number, 
    days?: number
  ): Promise<ApiResponse<PaginatedResponse<VisitorData>>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (days) params.append('days', days.toString());
    
    const queryString = params.toString();
    const endpoint = `/analytics/visitors${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<ApiResponse<PaginatedResponse<VisitorData>>>(endpoint);
  }

  // Get filtered analytics data
  async getFilteredData(
    filters: AnalyticsFilters,
    page?: number,
    limit?: number,
    days?: number
  ): Promise<ApiResponse<PaginatedResponse<VisitorData>>> {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    if (days) params.append('days', days.toString());
    
    // Add filter parameters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    
    const queryString = params.toString();
    const endpoint = `/analytics/filter${queryString ? `?${queryString}` : ''}`;
    
    return apiClient.get<ApiResponse<PaginatedResponse<VisitorData>>>(endpoint);
  }

  // Delete a specific visitor record
  async deleteVisitor(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(`/analytics/visitor/${id}`);
  }

  // Bulk delete analytics records
  async bulkDelete(request: BulkDeleteRequest): Promise<ApiResponse<{ deletedCount: number }>> {
    return apiClient.post<ApiResponse<{ deletedCount: number }>>('/analytics/bulk', request);
  }

  // Clear all analytics data (with optional date range)
  async clearData(days?: number): Promise<ApiResponse<{ deletedCount: number }>> {
    const params = days ? `?days=${days}` : '';
    return apiClient.delete<ApiResponse<{ deletedCount: number }>>(`/analytics/clear${params}`);
  }

  // Health check specifically for analytics
  async checkHealth(): Promise<boolean> {
    try {
      const response = await apiClient.healthCheck();
      return response.success;
    } catch (error) {
      console.error('Analytics API health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const analyticsApi = new AnalyticsApi(); 