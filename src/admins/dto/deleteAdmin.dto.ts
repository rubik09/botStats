import { PickType } from '@nestjs/mapped-types';

import { AdminDto } from './admin.dto';

export class DeleteAdminDto extends PickType(AdminDto, ['id']) {}
