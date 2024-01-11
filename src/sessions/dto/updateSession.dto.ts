import {PickType} from '@nestjs/mapped-types';
import {SessionDto} from "./session.dto";

export class UpdateSessionDto extends PickType(SessionDto, [
    'keywords',
    'region',
    'username',
]) {
}
