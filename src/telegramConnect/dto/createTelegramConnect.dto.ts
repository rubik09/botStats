import {PartialType, PickType} from '@nestjs/mapped-types';
import {TelegramConnectDto} from "./telegramConnect.dto";
import {Min, Max, IsNumber, Length, IsString, IsOptional} from "class-validator";
import {setupSteps} from "../../utils/consts";
import {PersonalInfo} from "../../personalInfo/entity/personalInfo.entity";

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

    @IsOptional()
    @Length(5, 5)
    code?: string;

    @IsOptional()
    @IsString()
    @Length(8, 30)
    accountPassword?: string;

    @IsOptional()
    username?: PersonalInfo["username"];

    @IsOptional()
    phoneNumber?: PersonalInfo["phoneNumber"];
}

