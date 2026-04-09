import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api, setAccessToken, getAccessToken } from '../api';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setAccessToken(null);
  });

  afterEach(() => {
    setAccessToken(null);
  });

  describe('setAccessToken / getAccessToken', () => {
    it('should store and retrieve access token', () => {
      setAccessToken('test-token-123');
      expect(getAccessToken()).toBe('test-token-123');
    });

    it('should clear token when set to null', () => {
      setAccessToken('token');
      setAccessToken(null);
      expect(getAccessToken()).toBeNull();
    });
  });

  describe('api()', () => {
    it('should call fetch with correct URL and default headers', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'test' }),
      });

      const result = await api('/articles');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:4000/api/articles',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          credentials: 'include',
        }),
      );
      expect(result).toEqual({ data: 'test' });
    });

    it('should include Authorization header when token is set', async () => {
      setAccessToken('my-jwt-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({}),
      });

      await api('/test');
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer my-jwt-token',
          }),
        }),
      );
    });

    it('should throw error when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ message: 'Bad request' }),
      });

      await expect(api('/bad')).rejects.toThrow('Bad request');
    });

    it('should throw generic error when error response has no message', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await expect(api('/error')).rejects.toThrow('HTTP 500');
    });

    it('should handle json parse failure on error response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => { throw new Error('invalid json'); },
      });

      await expect(api('/error')).rejects.toThrow('Request failed');
    });

    it('should attempt token refresh on 401 when token exists', async () => {
      setAccessToken('expired-token');

      // First call returns 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Unauthorized' }),
      });

      // Refresh call fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ message: 'Refresh failed' }),
      });

      // Should throw session expired (with window.location mock)
      const originalWindow = global.window;
      // @ts-expect-error -- deleting window for test
      delete global.window;

      await expect(api('/protected')).rejects.toThrow('Phiên đăng nhập hết hạn');

      global.window = originalWindow;
    });

    it('should pass custom options to fetch', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ success: true }),
      });

      await api('/articles', { method: 'POST', body: JSON.stringify({ title: 'Test' }) });
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ title: 'Test' }),
        }),
      );
    });
  });
});
