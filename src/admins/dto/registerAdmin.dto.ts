import { PickType } from '@nestjs/mapped-types';

import { AdminDto } from './admin.dto';

export class RegisterAdminDto extends PickType(AdminDto, ['email', 'password', 'role']) {}
