import { R2Service } from './r2.service';
import { ConfigService } from '@nestjs/config';

describe('R2Service', () => {
  let service: R2Service;
  let configService: ConfigService;

  beforeEach(() => {
    // Mock ConfigService — khong co env vars => R2 disabled
    configService = {
      get: jest.fn((key: string, defaultValue?: any) => defaultValue),
    } as any;

    service = new R2Service(configService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('isEnabled() should return false when no env vars configured', () => {
    expect(service.isEnabled()).toBe(false);
  });

  it('generateKey() should return key with media/ prefix and ulid', () => {
    const result = service.generateKey('photo.jpg');
    expect(result.key).toMatch(/^media\/.+\.jpg$/);
    expect(result.ulid).toBeDefined();
    expect(result.ulid.length).toBeGreaterThan(0);
  });

  it('generateKey() should preserve file extension', () => {
    const result = service.generateKey('document.pdf');
    expect(result.key).toMatch(/\.pdf$/);
  });
});
