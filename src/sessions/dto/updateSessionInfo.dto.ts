import {PickType} from '@nestjs/mapped-types';
import {SessionDto} from "./session.dto";

export class UpdateSessionInfoDto extends PickType(SessionDto, [
    'apiHash',
    'userId',
]) {
}
