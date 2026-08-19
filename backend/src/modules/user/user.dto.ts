import { createZodDto } from 'nestjs-zod';
import { userResponseSchema, updateUserSchema } from '@haejoong.com/shared';

export class UserResponseDto extends createZodDto(userResponseSchema) {}
export class UpdateUserDto extends createZodDto(updateUserSchema) {}
