/**
 * Security tests — Stack trace leak in AppExceptionFilter
 *
 * VULN #2: When NODE_ENV=development, the filter includes exception.stack in the response.
 * In production or when NODE_ENV is unset, stack should NEVER be exposed.
 */

import { HttpException, HttpStatus } from '@nestjs/common';
import { AppExceptionFilter } from '../app-exception.filter';

function createMockHost(responseBody: { json: jest.Mock; status: jest.Mock }, url = '/test') {
  const mockRequest = { method: 'GET', url };
  const mockResponse = {
    status: responseBody.status,
    json: responseBody.json,
  };
  responseBody.status.mockReturnThis();

  return {
    switchToHttp: () => ({
      getResponse: () => mockResponse,
      getRequest: () => mockRequest,
    }),
  } as any;
}

describe('AppExceptionFilter Security — Stack Trace Leak', () => {
  let filter: AppExceptionFilter;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    filter = new AppExceptionFilter();
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();
    // Suppress console.error in tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.restoreAllMocks();
  });

  describe('FIX #2: Stack trace no longer exposed in any mode', () => {
    it('should NOT include stack trace even when NODE_ENV=development', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Something broke');

      const host = createMockHost({ json: jsonMock, status: statusMock });
      filter.catch(error, host);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      const responseBody = jsonMock.mock.calls[0][0];

      // Fix verified — stack trace NOT leaked to client
      expect(responseBody.stack).toBeUndefined();
      expect(responseBody.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(responseBody.timestamp).toBeDefined();
      expect(responseBody.path).toBe('/test');
    });
  });

  describe('Production mode — no stack trace', () => {
    it('should NOT include stack trace when NODE_ENV=production', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Internal failure');

      const host = createMockHost({ json: jsonMock, status: statusMock });
      filter.catch(error, host);

      const responseBody = jsonMock.mock.calls[0][0];
      expect(responseBody.stack).toBeUndefined();
      expect(responseBody.success).toBe(false);
      expect(responseBody.message).toBe('Lỗi hệ thống');
    });

    it('should NOT include stack trace when NODE_ENV is unset', () => {
      delete process.env.NODE_ENV;
      const error = new Error('Internal failure');

      const host = createMockHost({ json: jsonMock, status: statusMock });
      filter.catch(error, host);

      const responseBody = jsonMock.mock.calls[0][0];
      expect(responseBody.stack).toBeUndefined();
    });
  });

  describe('HttpException handling', () => {
    it('should use HttpException status code', () => {
      process.env.NODE_ENV = 'production';
      const error = new HttpException('Not Found', HttpStatus.NOT_FOUND);

      const host = createMockHost({ json: jsonMock, status: statusMock });
      filter.catch(error, host);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      const responseBody = jsonMock.mock.calls[0][0];
      expect(responseBody.message).toBe('Not Found');
      expect(responseBody.stack).toBeUndefined();
    });

    it('should handle validation errors (array messages)', () => {
      process.env.NODE_ENV = 'production';
      const error = new HttpException(
        { message: ['Field A is required', 'Field B must be a string'], statusCode: 400 },
        HttpStatus.BAD_REQUEST,
      );

      const host = createMockHost({ json: jsonMock, status: statusMock });
      filter.catch(error, host);

      const responseBody = jsonMock.mock.calls[0][0];
      expect(responseBody.message).toContain('Field A is required');
      expect(responseBody.message).toContain('Field B must be a string');
    });

    it('should return generic message for non-HttpException errors', () => {
      process.env.NODE_ENV = 'production';
      const error = new TypeError('Cannot read property x of undefined');

      const host = createMockHost({ json: jsonMock, status: statusMock });
      filter.catch(error, host);

      const responseBody = jsonMock.mock.calls[0][0];
      // Should NOT expose the actual error message for non-HTTP errors
      expect(responseBody.message).toBe('Lỗi hệ thống');
      expect(responseBody.stack).toBeUndefined();
    });
  });
});
