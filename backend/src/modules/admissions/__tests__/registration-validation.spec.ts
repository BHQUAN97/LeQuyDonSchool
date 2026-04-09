/**
 * Security tests — Registration note field validation
 *
 * VULN #9: CreateRegistrationDto.note has no @MaxLength — attackers can submit
 *          huge payloads, causing DB bloat.
 */

import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateRegistrationDto } from '../dto/create-registration.dto';

describe('Registration Validation Security', () => {
  describe('FIX #9: note field now has MaxLength(2000) constraint', () => {
    it('should reject note exceeding 2000 chars', async () => {
      const dto = plainToInstance(CreateRegistrationDto, {
        fullName: 'Nguyen Van A',
        phone: '0912345678',
        grade: 'Lớp 1',
        note: 'X'.repeat(2001),
      });

      const errors = await validate(dto);
      const noteErrors = errors.filter((e) => e.property === 'note');

      // Fix verified — MaxLength rejects oversized note
      expect(noteErrors.length).toBeGreaterThan(0);
    });

    it('should accept note within 2000 chars', async () => {
      const dto = plainToInstance(CreateRegistrationDto, {
        fullName: 'Nguyen Van A',
        phone: '0912345678',
        grade: 'Lớp 1',
        note: 'X'.repeat(2000),
      });

      const errors = await validate(dto);
      const noteErrors = errors.filter((e) => e.property === 'note');

      expect(noteErrors).toHaveLength(0);
    });
  });

  describe('Existing validations work correctly', () => {
    it('should accept valid registration', async () => {
      const dto = plainToInstance(CreateRegistrationDto, {
        fullName: 'Nguyen Van A',
        phone: '0912345678',
        grade: 'Lớp 1',
        email: 'test@example.com',
        note: 'Ghi chu ngan',
      });

      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid phone format', async () => {
      const dto = plainToInstance(CreateRegistrationDto, {
        fullName: 'Test',
        phone: 'abc',
        grade: 'Lớp 1',
      });

      const errors = await validate(dto);
      const phoneErrors = errors.filter((e) => e.property === 'phone');
      expect(phoneErrors.length).toBeGreaterThan(0);
    });

    it('should reject invalid grade', async () => {
      const dto = plainToInstance(CreateRegistrationDto, {
        fullName: 'Test User',
        phone: '0912345678',
        grade: 'Lớp 6', // only 1-5 allowed
      });

      const errors = await validate(dto);
      const gradeErrors = errors.filter((e) => e.property === 'grade');
      expect(gradeErrors.length).toBeGreaterThan(0);
    });

    it('should enforce fullName maxLength of 100', async () => {
      const dto = plainToInstance(CreateRegistrationDto, {
        fullName: 'X'.repeat(101),
        phone: '0912345678',
        grade: 'Lớp 1',
      });

      const errors = await validate(dto);
      const nameErrors = errors.filter((e) => e.property === 'fullName');
      expect(nameErrors.length).toBeGreaterThan(0);
    });
  });
});
