import {PartialType, PickType} from '@nestjs/mapped-types';
import {TelegramConnectDto} from "./telegramConnect.dto";
import {Min, Max, IsNumber, Length, IsString} from "class-validator";
import {setupSteps} from "../../utils/consts";

export class CreateTelegramConnectionDto extends PartialType(PickType(TelegramConnectDto, [
    'keywords',
    'telegramId',
    'apiId',
    'apiHash',
])) {
    @IsNumber()
    @Min(1)
    @Max(3)
    setupStep: setupSteps;

    @Length(5, 5)
    code?: string;

    @IsString()
    @Length(8, 30)
    accountPassword?: string;
}

