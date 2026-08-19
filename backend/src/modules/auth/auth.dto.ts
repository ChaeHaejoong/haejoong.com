import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import {
  loginSchema,
  registerSchema,
  tokenResponseSchema,
} from '@haejoong.com/shared';

const verifyPasswordSchema = z.object({
  password: z.string().min(1),
});

export class LoginDto extends createZodDto(loginSchema) {}
export class RegisterDto extends createZodDto(registerSchema) {}
export class TokenResponseDto extends createZodDto(tokenResponseSchema) {}
export class VerifyPasswordDto extends createZodDto(verifyPasswordSchema) {}
