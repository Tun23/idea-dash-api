import { ERole } from 'src/enum/role.enum';
import { SetMetadata } from '@nestjs/common';
export const Role = (...roles: ERole[]) => SetMetadata('roles', roles);
