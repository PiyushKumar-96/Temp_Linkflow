/**
 * LinkedFlow API Client
 * The single fetch wrapper for all server communication.
 * Standardizes headers, base URL, error envelopes, and typed error objects.
 */

export class ApiError extends Error {
  constructor(message, { code = 'API_ERROR', status = 500, requestId = null, details = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.requestId = requestId || `req-${Math.random().toString(36).substring(2, 9)}`;
    this.details = details;
  }
}

const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
import { handleMockRequest } from '@/temp-backend/handler';

/**
 * Executes an HTTP request with auth headers and standard error handling.
 *
 * @template T
 * @param {string} endpoint - API path (e.g. '/posts' or 'http://...')
 * @param {RequestInit & { params?: Record<string, any>, token?: string }} [options={}]
 * @returns {Promise<T>}
 */
export async function apiClient(endpoint, options = {}) {
  const { params, token, headers = {}, body, ...customConfig } = options;

  let url = endpoint.startsWith('http') ? endpoint : `${DEFAULT_BASE_URL}${endpoint}`;

  if (params && Object.keys(params).length > 0) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    }
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  // Retrieve active auth from localStorage if available
  let authToken = token;
  if (!authToken && typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('linkedflow_auth');
      if (saved) {
        const parsed = JSON.parse(saved);
        authToken = parsed.token || (parsed.isAuthenticated ? 'mock-bearer-token' : null);
      }
    } catch {
      // Ignore localStorage error
    }
  }

  const reqHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-Platform': 'linkedflow-web',
    'X-Request-Id': `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ...headers,
  };

  if (authToken) {
    reqHeaders['Authorization'] = `Bearer ${authToken}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    headers: reqHeaders,
    ...customConfig,
  };

  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    config.body = JSON.stringify(body);
  } else if (body) {
    config.body = body;
  }

  // Direct local mock dispatch when using temp-backend
  if (!endpoint.startsWith('http') && (!DEFAULT_BASE_URL.startsWith('http') || import.meta.env.DEV)) {
    try {
      const mockResult = await handleMockRequest(endpoint, { ...config, params, body });
      if (mockResult !== null && mockResult !== undefined) {
        return mockResult;
      }
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(err.message || 'Mock backend processing failed', {
        code: 'MOCK_ERROR',
        status: 500,
        requestId: reqHeaders['X-Request-Id'],
      });
    }
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type') || '';
    // If Vite dev server serves index.html (text/html) for missing endpoints
    if (contentType.includes('text/html')) {
      const mockResult = await handleMockRequest(endpoint, { ...config, params, body });
      if (mockResult !== null && mockResult !== undefined) {
        return mockResult;
      }
      throw new ApiError(`API route not found: ${endpoint}`, {
        code: 'NOT_FOUND',
        status: 404,
        requestId: reqHeaders['X-Request-Id'],
      });
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 404) {
        const mockResult = await handleMockRequest(endpoint, { ...config, params, body });
        if (mockResult !== null && mockResult !== undefined) return mockResult;
      }

      // Standard backend error envelope: { error: { code, message, requestId } }
      const errPayload = data?.error || data;
      throw new ApiError(errPayload?.message || `HTTP error ${response.status}: ${response.statusText}`, {
        code: errPayload?.code || `HTTP_${response.status}`,
        status: response.status,
        requestId: errPayload?.requestId || reqHeaders['X-Request-Id'],
        details: errPayload?.details,
      });
    }

    return data;
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }

    // Fallback to temp-backend when offline or local mock dev
    try {
      const mockResult = await handleMockRequest(endpoint, { ...config, params, body });
      if (mockResult !== null && mockResult !== undefined) return mockResult;
    } catch {
      // Ignore fallback error
    }

    // Network failure or abort
    throw new ApiError(err.message || 'Network connection error', {
      code: err.name === 'AbortError' ? 'ABORTED' : 'NETWORK_ERROR',
      status: 0,
      requestId: reqHeaders['X-Request-Id'],
    });
  }
}

/**
 * Convenience methods
 */
apiClient.get = (endpoint, options) => apiClient(endpoint, { ...options, method: 'GET' });
apiClient.post = (endpoint, body, options) => apiClient(endpoint, { ...options, method: 'POST', body });
apiClient.put = (endpoint, body, options) => apiClient(endpoint, { ...options, method: 'PUT', body });
apiClient.patch = (endpoint, body, options) => apiClient(endpoint, { ...options, method: 'PATCH', body });
apiClient.delete = (endpoint, options) => apiClient(endpoint, { ...options, method: 'DELETE' });

export default apiClient;
