import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'eventora:roles';
export const Roles = (...roles: string[]): ReturnType<typeof SetMetadata> =>
  SetMetadata(ROLES_KEY, roles);
