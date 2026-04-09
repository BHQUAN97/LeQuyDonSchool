/**
 * Integration test — API client auth flow
 *
 * Tests the complete token lifecycle:
 * setting tokens, sending in headers, 401 refresh, mutex dedup, login redirect.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, setAccessToken, getAccessToken } from '@/lib/api';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Auth Flow — Complete Token Lifecycle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setAccessToken(null);
  });

  afterEach(() => {
    setAccessToken(null);
  });

  describe('Access token is set and sent in headers', () => {
    it('should NOT send Authorization header when no token', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await api('/articles');

      const headers = mockFetch.mock.calls[0][1].headers;
      expect(headers.Authorization).toBeUndefined();
    });

    it('should send Bearer token in Authorization header', async () => {
      setAccessToken('valid-jwt-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: [] }),
      });

      await api('/articles');

      const headers = mockFetch.mock.calls[0][1].headers;
      expect(headers.Authorization).toBe('Bearer valid-jwt-token');
    });

    it('should update header after token changes', async () => {
      setAccessToken('token-1');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });
      await api('/test1');
      expect(mockFetch.mock.calls[0][1].headers.Authorization).toBe('Bearer token-1');

      setAccessToken('token-2');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });
      await api('/test2');
      expect(mockFetch.mock.calls[1][1].headers.Authorization).toBe('Bearer token-2');
    });
  });

  describe('401 response triggers refresh', () => {
    it('should attempt refresh and retry original request on 401', async () => {
      setAccessToken('expired-token');

      // Original request → 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      // Refresh call → success with new token
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: { accessToken: 'fresh-token' },
        }),
      });

      // Retry original request → success
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'protected-data' }),
      });

      const result = await api('/protected');

      // 3 fetch calls: original, refresh, retry
      expect(mockFetch).toHaveBeenCalledTimes(3);

      // Refresh was called to /auth/refresh
      expect(mockFetch.mock.calls[1][0]).toContain('/auth/refresh');
      expect(mockFetch.mock.calls[1][1].method).toBe('POST');

      // Retry used the new token
      expect(mockFetch.mock.calls[2][1].headers.Authorization).toBe('Bearer fresh-token');

      // Got the data back
      expect(result).toEqual({ data: 'protected-data' });

      // Token was updated
      expect(getAccessToken()).toBe('fresh-token');
    });

    it('should NOT attempt refresh when no token (public endpoint 401)', async () => {
      // No token set
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      // Should throw without trying to refresh
      await expect(api('/admin-only')).rejects.toThrow('Unauthorized');
      expect(mockFetch).toHaveBeenCalledTimes(1); // no refresh attempted
    });
  });

  describe('Concurrent 401s only trigger one refresh (mutex)', () => {
    it('should deduplicate concurrent refresh attempts', async () => {
      setAccessToken('expired-token');

      // Both original requests → 401
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ message: 'Unauthorized' }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: async () => ({ message: 'Unauthorized' }),
        });

      // Single refresh call → success
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          success: true,
          data: { accessToken: 'new-token' },
        }),
      });

      // Both retry calls → success
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: 'result-1' }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => ({ data: 'result-2' }),
        });

      // Fire both requests concurrently
      const [result1, result2] = await Promise.all([
        api('/endpoint-1'),
        api('/endpoint-2'),
      ]);

      // Should have: 2 original + 1 refresh (deduped) + 2 retries = 5
      // (The mutex ensures only 1 refresh call, not 2)
      const refreshCalls = mockFetch.mock.calls.filter(
        (call: any[]) => call[0]?.includes('/auth/refresh'),
      );
      expect(refreshCalls.length).toBe(1);

      expect(result1).toEqual({ data: 'result-1' });
      expect(result2).toEqual({ data: 'result-2' });
    });
  });

  describe('Failed refresh redirects to login', () => {
    it('should redirect to /admin/login when refresh fails', async () => {
      setAccessToken('expired-token');

      // Mock window.location
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { href: '' },
      });

      // Original request → 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      // Refresh → fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Invalid refresh token' }),
      });

      await expect(api('/protected')).rejects.toThrow('Phiên đăng nhập hết hạn');

      // Window location was set to login
      expect(window.location.href).toBe('/admin/login');

      // Restore
      Object.defineProperty(window, 'location', {
        writable: true,
        value: originalLocation,
      });
    });

    it('should throw session expired without redirect in non-browser env', async () => {
      setAccessToken('expired-token');

      const originalWindow = global.window;
      // @ts-expect-error -- simulate non-browser
      delete global.window;

      // Original → 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      // Refresh → fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({}),
      });

      await expect(api('/protected')).rejects.toThrow('Phiên đăng nhập hết hạn');

      global.window = originalWindow;
    });
  });
});
