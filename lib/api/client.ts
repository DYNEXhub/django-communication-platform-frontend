/**
 * API client with JWT authentication and auto-refresh
 */

import type { RefreshTokenResponse } from './types/auth';

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

/**
 * Get auth token from the auth store
 * We import dynamically to avoid circular dependencies
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const authStore = localStorage.getItem('auth-store');
    if (!authStore) return null;

    const parsed = JSON.parse(authStore);
    return parsed.state?.accessToken || null;
  } catch {
    return null;
  }
}

/**
 * Get refresh token from the auth store
 */
function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const authStore = localStorage.getItem('auth-store');
    if (!authStore) return null;

    const parsed = JSON.parse(authStore);
    return parsed.state?.refreshToken || null;
  } catch {
    return null;
  }
}

/**
 * Update access token in the auth store
 */
function updateAccessToken(accessToken: string): void {
  if (typeof window === 'undefined') return;

  try {
    const authStore = localStorage.getItem('auth-store');
    if (!authStore) return;

    const parsed = JSON.parse(authStore);
    parsed.state.accessToken = accessToken;
    localStorage.setItem('auth-store', JSON.stringify(parsed));
  } catch (error) {
    console.error('Failed to update access token:', error);
  }
}

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new ApiError('No refresh token available', 401);
  }

  const response = await fetch(`${BASE_URL}/auth/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    // Clear auth state on refresh failure
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-store');
    }
    throw new ApiError('Token refresh failed', response.status);
  }

  const data: RefreshTokenResponse = await response.json();
  updateAccessToken(data.access);

  return data.access;
}

/**
 * Make an authenticated API request
 */
async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retry: boolean = true
): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 - Token expired
  if (response.status === 401 && retry) {
    // If already refreshing, wait for that promise
    if (isRefreshing && refreshPromise) {
      try {
        await refreshPromise;
        return makeRequest<T>(endpoint, options, false);
      } catch {
        throw new ApiError('Authentication failed', 401);
      }
    }

    // Start refresh process
    isRefreshing = true;
    refreshPromise = refreshAccessToken()
      .then((newToken) => {
        isRefreshing = false;
        refreshPromise = null;
        return newToken;
      })
      .catch((error) => {
        isRefreshing = false;
        refreshPromise = null;
        throw error;
      });

    try {
      await refreshPromise;
      return makeRequest<T>(endpoint, options, false);
    } catch {
      throw new ApiError('Authentication failed', 401);
    }
  }

  // Handle other errors
  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }

    throw new ApiError(
      `API error: ${response.statusText}`,
      response.status,
      errorData
    );
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    return undefined as T;
  }

  return response.json();
}

/**
 * GET request
 */
export async function get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  let url = endpoint;

  if (params) {
    const searchParams = new URLSearchParams(params);
    url = `${endpoint}?${searchParams.toString()}`;
  }

  return makeRequest<T>(url, { method: 'GET' });
}

/**
 * POST request
 */
export async function post<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
  return makeRequest<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * PATCH request
 */
export async function patch<T, D = unknown>(endpoint: string, data: D): Promise<T> {
  return makeRequest<T>(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 */
export async function put<T, D = unknown>(endpoint: string, data: D): Promise<T> {
  return makeRequest<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function del<T>(endpoint: string): Promise<T> {
  return makeRequest<T>(endpoint, { method: 'DELETE' });
}

/**
 * Export the API client
 */
export const apiClient = {
  get,
  post,
  patch,
  put,
  delete: del,
};
