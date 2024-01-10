import {IsNumber} from "class-validator";

export class UpdateStatsDto {
    @IsNumber()
    readonly incoming_messages_count: number;

    @IsNumber()
    readonly users_count: number;
}
