import { ValidationPipe } from '@nestjs/common';

/** Global validation pipe — whitelist + transform + reject unknown fields */
export const globalValidationPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
});
