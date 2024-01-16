import {PickType} from '@nestjs/mapped-types';
import {SessionDto} from "./session.dto";

export class ConnectToTelegramDto extends PickType(SessionDto, [
    'apiId',
    'apiHash',
    'keywords',
    'userId',
]) {
    setupStep: number;
    phoneCode: number;
    accountPassword: string;
}
