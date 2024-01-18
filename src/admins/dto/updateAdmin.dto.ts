import {PickType} from '@nestjs/mapped-types';
import {AdminDto} from './admin.dto';

export class UpdateAdminDto extends PickType(AdminDto, [
    'id',
    'email',
    'password',
]) {
}
