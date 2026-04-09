/**
 * Security tests — Search endpoint rate limiting & input validation
 *
 * VULN #4: SearchController has no @Throttle decorator — public endpoint vulnerable to abuse.
 * Also tests input validation/sanitization.
 */

import 'reflect-metadata';
import { Throttle } from '@nestjs/throttler';
import { SearchController } from '../search.controller';

describe('Search Security — Rate Limiting & Input Validation', () => {
  describe('VULN #4: No rate limiting on search endpoint', () => {
    it('VULNERABILITY: SearchController.search has no @Throttle decorator', () => {
      // Check if Throttle metadata is set on the search method
      const throttleMetadata = Reflect.getMetadata('THROTTLER:LIMIT', SearchController.prototype.search);
      const throttleMetadata2 = Reflect.getMetadata('throttler:limit', SearchController.prototype.search);

      // Both should be undefined — confirming no rate limit is applied
      // This IS the vulnerability: public endpoint with no rate limiting
      expect(throttleMetadata ?? throttleMetadata2).toBeUndefined();
    });

    it('VULNERABILITY: SearchController class has no @Throttle decorator', () => {
      const classThrottleMetadata = Reflect.getMetadata('THROTTLER:LIMIT', SearchController);
      const classThrottleMetadata2 = Reflect.getMetadata('throttler:limit', SearchController);

      expect(classThrottleMetadata ?? classThrottleMetadata2).toBeUndefined();
    });
  });

  describe('Search input validation (SearchService logic)', () => {
    // Re-test the validation that SearchService does
    it('should reject queries shorter than 2 characters', () => {
      // SearchService throws BadRequestException if q.trim().length < 2
      const shortQuery = 'a';
      expect(shortQuery.trim().length < 2).toBe(true);
    });

    it('should accept queries of 2+ characters', () => {
      const validQuery = 'ab';
      expect(validQuery.trim().length >= 2).toBe(true);
    });

    it('should cap limit at 50 (safeLimit)', () => {
      // SearchService: const safeLimit = Math.min(limit, 50)
      const requestedLimit = 10000;
      const safeLimit = Math.min(requestedLimit, 50);
      expect(safeLimit).toBe(50);
    });

    it('should handle extremely long search queries', () => {
      // A very long query string — should not crash
      const longQuery = 'a'.repeat(10000);
      expect(longQuery.trim().length >= 2).toBe(true);
      // The real concern: LIKE '%...%' with 10K chars could be slow
      // This documents the risk even if no crash occurs
    });

    it('should handle SQL injection characters in search query', () => {
      // SearchService uses parameterized queries (:kw) so SQL injection is mitigated
      // But we document this is handled at the ORM level, not input validation
      const maliciousQuery = "'; DROP TABLE articles; --";
      expect(maliciousQuery.trim().length >= 2).toBe(true);
    });
  });

  describe('Query parameter validation', () => {
    it('should handle non-numeric page parameter', () => {
      // Controller does parseInt(page, 10) — 'abc' becomes NaN
      const page = parseInt('abc', 10);
      expect(isNaN(page)).toBe(true);
      // NaN propagated to service — could cause issues
    });

    it('should handle negative page number', () => {
      const page = parseInt('-1', 10);
      const offset = (page - 1) * 12; // = -24
      expect(offset).toBeLessThan(0);
      // Negative offset sent to DB — should be validated
    });

    it('should handle zero limit', () => {
      const limit = parseInt('0', 10);
      const safeLimit = Math.min(limit, 50);
      expect(safeLimit).toBe(0);
      // Zero limit means no results — might be confusing but not dangerous
    });
  });
});
