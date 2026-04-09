/**
 * Security tests — Contact form validation
 *
 * VULN #8: CreateContactDto.content has no @MaxLength — an attacker can submit
 *          megabytes of text, causing DB bloat and potential DoS.
 */

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateContactDto } from '../dto/create-contact.dto';

describe('Contact Validation Security', () => {
  describe('FIX #8: content field now has MaxLength(5000) constraint', () => {
    it('should reject content exceeding 5000 chars', async () => {
      const dto = plainToInstance(CreateContactDto, {
        fullName: 'Test User',
        email: 'test@example.com',
        content: 'A'.repeat(5001),
      });

      const errors = await validate(dto);
      const contentErrors = errors.filter((e) => e.property === 'content');

      // Fix verified — MaxLength rejects oversized content
      expect(contentErrors.length).toBeGreaterThan(0);
    });

    it('should accept content within 5000 chars', async () => {
      const dto = plainToInstance(CreateContactDto, {
        fullName: 'Test User',
        email: 'test@example.com',
        content: 'A'.repeat(5000),
      });

      const errors = await validate(dto);
      const contentErrors = errors.filter((e) => e.property === 'content');

      expect(contentErrors).toHaveLength(0);
    });
  });

  describe('Existing validations work correctly', () => {
    it('should reject empty fullName', async () => {
      const dto = plainToInstance(CreateContactDto, {
        fullName: '',
        email: 'test@example.com',
        content: 'Hello, this is a test message',
      });

      const errors = await validate(dto);
      const nameErrors = errors.filter((e) => e.property === 'fullName');
      expect(nameErrors.length).toBeGreaterThan(0);
    });

    it('should reject invalid email', async () => {
      const dto = plainToInstance(CreateContactDto, {
        fullName: 'Test User',
        email: 'not-an-email',
        content: 'Hello, this is a test message',
      });

      const errors = await validate(dto);
      const emailErrors = errors.filter((e) => e.property === 'email');
      expect(emailErrors.length).toBeGreaterThan(0);
    });

    it('should reject content shorter than 10 chars', async () => {
      const dto = plainToInstance(CreateContactDto, {
        fullName: 'Test User',
        email: 'test@example.com',
        content: 'Short',
      });

      const errors = await validate(dto);
      const contentErrors = errors.filter((e) => e.property === 'content');
      expect(contentErrors.length).toBeGreaterThan(0);
    });

    it('should accept valid contact submission', async () => {
      const dto = plainToInstance(CreateContactDto, {
        fullName: 'Nguyen Van A',
        email: 'nguyenvana@example.com',
        phone: '0912345678',
        content: 'Toi muon hoi ve tuyen sinh lop 1 nam hoc 2025-2026.',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should enforce fullName maxLength of 100', async () => {
      const dto = plainToInstance(CreateContactDto, {
        fullName: 'X'.repeat(101),
        email: 'test@example.com',
        content: 'Valid content message here',
      });

      const errors = await validate(dto);
      const nameErrors = errors.filter((e) => e.property === 'fullName');
      expect(nameErrors.length).toBeGreaterThan(0);
    });

    it('should enforce phone maxLength of 20', async () => {
      const dto = plainToInstance(CreateContactDto, {
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '1'.repeat(21),
        content: 'Valid content message here',
      });

      const errors = await validate(dto);
      const phoneErrors = errors.filter((e) => e.property === 'phone');
      expect(phoneErrors.length).toBeGreaterThan(0);
    });
  });
});
