import { PickType } from '@nestjs/mapped-types';

import { AdminDto } from './admin.dto';

export class AdminRegisterDto extends PickType(AdminDto, ['email', 'password']) {}
