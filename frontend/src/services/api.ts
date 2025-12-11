/**
 * API Client Service
 * Handles all HTTP requests to Django backend
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { getCSRFToken, getGlobalCSRFToken } from '@/utils/csrf';
import type { APIError } from '@/types/api';

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api/plugins/floorplan',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
    });

    // Request interceptor: Add CSRF token to all requests
    this.client.interceptors.request.use(
      (config) => {
        const csrfToken = getGlobalCSRFToken() || getCSRFToken();
        if (csrfToken) {
          config.headers['X-CSRFToken'] = csrfToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor: Handle common errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<APIError>) => {
        if (error.response) {
          // Server responded with error status
          const apiError: APIError = error.response.data || {};
          console.error('API Error:', apiError);

          // Handle specific status codes
          if (error.response.status === 403) {
            console.error('Permission denied. Check CSRF token.');
          } else if (error.response.status === 404) {
            console.error('Resource not found');
          } else if (error.response.status >= 500) {
            console.error('Server error');
          }
        } else if (error.request) {
          // Request made but no response received
          console.error('No response from server');
        } else {
          // Error in request setup
          console.error('Request error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * GET request
   */
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response = await this.client.get<T>(url, { params });
    return response.data;
  }

  /**
   * POST request
   */
  async post<T>(url: string, data: any): Promise<T> {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  /**
   * PATCH request (for partial updates)
   */
  async patch<T>(url: string, data: any): Promise<T> {
    const response = await this.client.patch<T>(url, data);
    return response.data;
  }

  /**
   * PUT request (for full updates)
   */
  async put<T>(url: string, data: any): Promise<T> {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  /**
   * DELETE request
   */
  async delete(url: string): Promise<void> {
    await this.client.delete(url);
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export class for testing
export { APIClient };
