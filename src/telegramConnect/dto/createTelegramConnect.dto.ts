import {PickType} from '@nestjs/mapped-types';
import {TelegramConnectDto} from "./telegramConnect.dto";

export class CreateTelegramConnectDto extends PickType(TelegramConnectDto, [
    'apiId',
    'apiHash',
]) {
}

