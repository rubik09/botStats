import { PickType } from '@nestjs/mapped-types';

import { AdminDto } from './admin.dto';

export class AdminLoginDto extends PickType(AdminDto, ['email', 'password']) {}
