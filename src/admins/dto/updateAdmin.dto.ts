import {PartialType, PickType} from '@nestjs/mapped-types';
import {AdminDto} from './admin.dto';

export class UpdateAdminDto extends PartialType(
    PickType(AdminDto, ['email', 'password']),
) {
}
