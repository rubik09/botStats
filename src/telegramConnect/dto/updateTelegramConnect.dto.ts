import {PickType} from '@nestjs/mapped-types';
import {TelegramConnectDto} from "./telegramConnect.dto";

export class UpdateTelegramConnectDto extends PickType(TelegramConnectDto, [
    'id',
    'keywords',
    'status',
]) {
}

